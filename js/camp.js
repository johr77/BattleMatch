/* Green vertical lock — army camp. */
window.BM = window.BM || {};

BM.createCampMesh = function (len, fireTimer, side, stars) {
  const CELL = BM.CELL;
  const createUnitMesh = BM.createUnitMesh;
  const makeTimerSprite = BM.makeTimerSprite;
  const makeStarSprite = BM.makeStarSprite;
      const group = new THREE.Group();
      const depth = len * CELL * 0.92;
      const matSand = new THREE.MeshStandardMaterial({ color: 0x6b5b3a, roughness: 0.9 });
      const matTent = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.7 });
      const matDark = new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.75 });
      const matBag = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.85 });
      const matMetal = new THREE.MeshStandardMaterial({ color: 0x37474f, metalness: 0.4, roughness: 0.4 });
      const matTroop = new THREE.MeshStandardMaterial({ color: 0x43a047, roughness: 0.55 });

      // Ground tarp / base
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(CELL * 0.88, 0.06, depth),
        matSand
      );
      base.position.y = 0.05;
      base.receiveShadow = true;
      group.add(base);

      // Sandbag walls
      for (let i = 0; i < len; i++) {
        const z = -depth / 2 + CELL * 0.5 + i * CELL;
        const bag = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.2), matBag);
        bag.position.set(0, 0.15, z);
        group.add(bag);
      }

      // Tents along the camp (cone point up)
      const tentCount = Math.min(3, Math.max(2, len));
      for (let i = 0; i < tentCount; i++) {
        const z = -depth / 2 + (i + 0.5) * (depth / tentCount);
        const tent = new THREE.Group();
        // ConeGeometry points +Y by default
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(0.22, 0.38, 4),
          matTent
        );
        cone.position.y = 0.32;
        cone.rotation.y = Math.PI / 4; // diamond footprint
        cone.castShadow = true;
        tent.add(cone);
        const floor = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.3), matDark);
        floor.position.y = 0.13;
        tent.add(floor);
        tent.position.set(i % 2 === 0 ? -0.18 : 0.18, 0, z);
        group.add(tent);
      }

      // Flag pole
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 6), matMetal);
      pole.position.set(0.28, 0.45, -depth / 2 + 0.2);
      group.add(pole);
      const flag = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.02), matTent);
      flag.position.set(0.38, 0.7, -depth / 2 + 0.2);
      group.add(flag);

      // Machine gun nests at front (toward enemy)
      const frontZ = depth / 2 - 0.15;
      for (const x of [-0.25, 0.25]) {
        const nest = new THREE.Group();
        const bag = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.2, 0.22), matBag);
        bag.position.y = 0.18;
        nest.add(bag);
        const gun = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.4), matMetal);
        gun.position.set(0, 0.28, 0.15);
        nest.add(gun);
        nest.position.set(x, 0, frontZ);
        group.add(nest);
      }

      // Troops that walk around (animated) — 3 men, +2 per star
      const troops = [];
      const nMen = 3 + 2 * (stars || 0);
      for (let i = 0; i < nMen; i++) {
        const troop = createUnitMesh("green", false, 0, false);
        troop.scale.setScalar(0.38);
        const z0 = -depth / 2 + 0.22 + (i / Math.max(1, nMen - 1)) * (depth - 0.44);
        const x0 = (i % 2 === 0 ? -0.16 : 0.16);
        troop.position.set(x0, 0.02, z0);
        troop.userData.walk = {
          x0, z0,
          phase: i * 0.9,
          speed: 0.8 + (i % 3) * 0.25,
          radius: 0.08 + (i % 2) * 0.05
        };
        group.add(troop);
        troops.push(troop);
      }

      // Countdown at bottom front of camp
      if (fireTimer > 0) {
        const spr = makeTimerSprite(fireTimer);
        // On top, at the near / back end of the 3 tiles
        spr.position.set(0, 0.85, -depth / 2 + 0.15);
        spr.scale.set(0.55, 0.55, 1);
        group.add(spr);
      }
      const campStars = stars || 0;
      for (let s = 0; s < campStars; s++) {
        const star = makeStarSprite();
        star.position.set(-0.22 + s * 0.22, 0.95, -depth / 2 + 0.15);
        group.add(star);
      }

      group.userData.isCamp = true;
      group.userData.troops = troops;
      group.userData.isUnit = true;
      return group;
};
