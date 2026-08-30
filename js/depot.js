/* Blue vertical lock — tank depot. */
window.BM = window.BM || {};

BM.createDepotMesh = function (len, fireTimer, stars) {
  const CELL = BM.CELL;
  const createUnitMesh = BM.createUnitMesh;
  const makeTimerSprite = BM.makeTimerSprite;
  const makeStarSprite = BM.makeStarSprite;
  const buildTankModel = BM.buildTankModel;
      const group = new THREE.Group();
      const depth = len * CELL * 0.92;
      const width = CELL * 0.9;
      const matPad = new THREE.MeshStandardMaterial({ color: 0x5d6a73, roughness: 0.92 });
      const matShop = new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.55, metalness: 0.25 });
      const matRoof = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.7, metalness: 0.2 });
      const matTire = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.95 });
      const matDrum = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.7 });
      const matOlive = new THREE.MeshStandardMaterial({ color: 0x556b2f, roughness: 0.75 });
      const matCrate = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.8 });
      const matCone = new THREE.MeshStandardMaterial({ color: 0xef6c00, roughness: 0.55 });
      const matSteel = new THREE.MeshStandardMaterial({ color: 0x78909c, metalness: 0.5, roughness: 0.35 });
      const matSand = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.85 });
      const matStain = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 1, transparent: true, opacity: 0.55 });

      const pad = new THREE.Mesh(new THREE.BoxGeometry(width, 0.05, depth), matPad);
      pad.position.y = 0.04;
      pad.receiveShadow = true;
      group.add(pad);
      const stain = new THREE.Mesh(new THREE.CircleGeometry(0.16, 10), matStain);
      stain.rotation.x = -Math.PI / 2;
      stain.position.set(0.12, 0.072, depth * 0.08);
      group.add(stain);

      for (let i = 0; i < len; i++) {
        const z = -depth / 2 + CELL * 0.45 + i * (depth / len);
        const bag = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.34), matSand);
        bag.position.set(-width / 2 + 0.1, 0.14, z);
        group.add(bag);
      }

      function tireStack(x, z, count) {
        for (let i = 0; i < count; i++) {
          const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.048, 12), matTire);
          tire.position.set(x, 0.1 + i * 0.05, z);
          group.add(tire);
          const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 8), matSteel);
          rim.position.set(x, 0.1 + i * 0.05, z);
          group.add(rim);
        }
      }
      tireStack(width * 0.32, -depth * 0.38, 4);
      tireStack(width * 0.32, -depth * 0.28, 3);
      tireStack(-width * 0.28, depth * 0.32, 3);

      for (let i = 0; i < 3; i++) {
        const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.16, 10), i === 2 ? matOlive : matDrum);
        drum.position.set(width * 0.28, 0.14, -depth * 0.08 + i * 0.16);
        drum.castShadow = true;
        group.add(drum);
        const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, 0.02, 10), matSteel);
        lid.position.copy(drum.position);
        lid.position.y += 0.08;
        group.add(lid);
      }
      const crate = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.16), matCrate);
      crate.position.set(-width * 0.28, 0.12, -depth * 0.18);
      group.add(crate);
      const crate2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.14), matCrate);
      crate2.position.set(-width * 0.28, 0.23, -depth * 0.18);
      crate2.rotation.y = 0.3;
      group.add(crate2);

      for (const x of [-0.22, 0.08, 0.28]) {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 8), matCone);
        cone.position.set(x, 0.13, depth / 2 - 0.12);
        group.add(cone);
      }

      const shopZ = -depth / 2 + 0.38;
      const shop = new THREE.Group();
      shop.position.z = shopZ;
      const back = new THREE.Mesh(new THREE.BoxGeometry(width * 0.82, 0.55, 0.05), matShop);
      back.position.set(0, 0.34, -0.28);
      shop.add(back);
      const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.55), matShop);
      sideL.position.set(-width * 0.38, 0.32, 0);
      shop.add(sideL);
      const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.55), matShop);
      sideR.position.set(width * 0.38, 0.32, 0);
      shop.add(sideR);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(width * 0.86, 0.04, 0.62), matRoof);
      roof.position.set(0, 0.6, -0.02);
      roof.rotation.x = -0.08;
      shop.add(roof);
      const sign = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.1, 0.02), matOlive);
      sign.position.set(0, 0.52, 0.3);
      shop.add(sign);
      const bench = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.12), matCrate);
      bench.position.set(-0.18, 0.14, 0.05);
      shop.add(bench);
      const chest = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.1), matSteel);
      chest.position.set(0.2, 0.14, -0.08);
      shop.add(chest);
      const light = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfff59d }));
      light.position.set(0, 0.52, 0.05);
      shop.add(light);
      group.add(shop);

      const hoist = new THREE.Group();
      hoist.position.set(0.05, 0.48, shopZ);
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.03), matSteel);
      hoist.add(beam);
      const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 6), matSteel);
      hook.position.y = -0.1;
      hoist.add(hook);
      hoist.userData.y0 = 0.48;
      group.add(hoist);
      group.userData.hoist = hoist;

      const shopTank = buildTankModel(0.7, 0.56);
      shopTank.scale.setScalar(0.34);
      shopTank.position.set(0.02, 0.14, shopZ + 0.04);
      shopTank.rotation.y = 0.4;
      shopTank.userData.y0 = 0.14;
      group.add(shopTank);
      group.userData.shopTank = shopTank;

      const mechanic = createUnitMesh("green", false, 0, false);
      mechanic.scale.setScalar(0.32);
      mechanic.position.set(-0.2, 0.05, shopZ + 0.16);
      mechanic.rotation.y = Math.PI * 0.6;
      group.add(mechanic);
      group.userData.mechanic = mechanic;

      const patrol = [];
      const nTanks = 3 + 2 * (stars || 0);
      for (let i = 0; i < nTanks; i++) {
        const tk = buildTankModel(0.7, 0.56);
        tk.scale.setScalar(0.34);
        const z0 = -depth * 0.05 + (i / Math.max(1, nTanks - 1)) * (depth * 0.42);
        const x0 = (i % 2 === 0 ? -0.18 : 0.16);
        tk.position.set(x0, 0.02, z0);
        tk.userData.walk = {
          x0, z0,
          phase: i * 1.1,
          speed: 0.55 + (i % 3) * 0.18,
          radius: 0.07 + (i % 2) * 0.04
        };
        group.add(tk);
        patrol.push(tk);
      }
      group.userData.patrolTanks = patrol;

      if (fireTimer > 0) {
        const spr = makeTimerSprite(fireTimer);
        spr.position.set(0, 0.85, -depth / 2 + 0.15);
        spr.scale.set(0.55, 0.55, 1);
        group.add(spr);
      }
      const tankStars = stars || 0;
      for (let s = 0; s < tankStars; s++) {
        const star = makeStarSprite();
        star.position.set(-0.22 + s * 0.22, 0.95, -depth / 2 + 0.15);
        group.add(star);
      }

      group.userData.isTank = true;
      group.userData.isUnit = true;
      return group;
};

BM.createBigTankMesh = BM.createDepotMesh;
