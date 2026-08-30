/* Red vertical lock — airfield. */
window.BM = window.BM || {};

BM.createAirportMesh = function (len, fireTimer, stars) {
  const CELL = BM.CELL;
  const makeTimerSprite = BM.makeTimerSprite;
  const makeStarSprite = BM.makeStarSprite;
  const buildPlaneModel = BM.buildPlaneModel;
      const group = new THREE.Group();
      const depth = len * CELL * 0.92;
      const width = CELL * 0.9;
      const matTarmac = new THREE.MeshStandardMaterial({ color: 0x424242, roughness: 0.92 });
      const matRunway = new THREE.MeshStandardMaterial({ color: 0x303030, roughness: 0.85 });
      const matPaint = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.6 });
      const matHangar = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });
      const matRoof = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.65 });
      const matTower = new THREE.MeshStandardMaterial({ color: 0x90a4ae, roughness: 0.5, metalness: 0.2 });
      const matGlass = new THREE.MeshStandardMaterial({ color: 0x81d4fa, roughness: 0.15, metalness: 0.35 });
      const matCone = new THREE.MeshStandardMaterial({ color: 0xef6c00, roughness: 0.55 });
      const matSock = new THREE.MeshStandardMaterial({ color: 0xff7043, roughness: 0.55 });
      const matLight = new THREE.MeshBasicMaterial({ color: 0xfff59d });

      const pad = new THREE.Mesh(new THREE.BoxGeometry(width, 0.05, depth), matTarmac);
      pad.position.y = 0.04;
      pad.receiveShadow = true;
      group.add(pad);

      const runway = new THREE.Mesh(new THREE.BoxGeometry(width * 0.34, 0.012, depth * 0.92), matRunway);
      runway.position.set(0, 0.07, 0);
      group.add(runway);
      const dashes = Math.max(4, len * 2);
      for (let i = 0; i < dashes; i++) {
        const dash = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.01, depth * 0.06), matPaint);
        dash.position.set(0, 0.078, -depth * 0.4 + i * (depth * 0.8 / Math.max(1, dashes - 1)));
        group.add(dash);
      }
      const thresh = new THREE.Mesh(new THREE.BoxGeometry(width * 0.3, 0.01, 0.04), matPaint);
      thresh.position.set(0, 0.078, depth / 2 - 0.1);
      group.add(thresh);

      for (const x of [-width * 0.22, width * 0.22]) {
        for (let i = 0; i < len + 1; i++) {
          const lite = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.03), matLight);
          lite.position.set(x, 0.09, -depth / 2 + 0.12 + i * ((depth - 0.24) / len));
          group.add(lite);
        }
      }

      function hangar(x, z) {
        const h = new THREE.Group();
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.32, 0.04), matHangar);
        back.position.set(0, 0.22, -0.16);
        h.add(back);
        const sideA = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.32), matHangar);
        sideA.position.set(-0.16, 0.21, 0);
        h.add(sideA);
        const sideB = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.32), matHangar);
        sideB.position.set(0.16, 0.21, 0);
        h.add(sideB);
        const roof = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.36), matRoof);
        roof.position.set(0, 0.38, -0.02);
        h.add(roof);
        h.position.set(x, 0, z);
        group.add(h);
      }
      hangar(-width * 0.28, -depth / 2 + 0.32);
      hangar(width * 0.28, -depth / 2 + 0.32);

      const tower = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.12), matTower);
      shaft.position.y = 0.32;
      tower.add(shaft);
      const cab = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.22), matGlass);
      cab.position.y = 0.62;
      tower.add(cab);
      const roofT = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.24), matRoof);
      roofT.position.y = 0.7;
      tower.add(roofT);
      tower.position.set(width * 0.32, 0, depth * 0.12);
      group.add(tower);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.28, 6), matTower);
      pole.position.set(-width * 0.32, 0.22, depth * 0.28);
      group.add(pole);
      const sock = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.16, 6), matSock);
      sock.rotation.z = Math.PI / 2;
      sock.position.set(-width * 0.32 + 0.08, 0.34, depth * 0.28);
      group.add(sock);
      group.userData.windsock = sock;

      for (const x of [-0.14, 0.14]) {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.1, 8), matCone);
        cone.position.set(x, 0.12, depth / 2 - 0.18);
        group.add(cone);
      }

      const taxi = [];
      const nPlanes = 3 + 2 * (stars || 0);
      for (let i = 0; i < nPlanes; i++) {
        const pl = buildPlaneModel();
        pl.scale.setScalar(0.34);
        const parked = i < 2;
        if (parked) {
          const hx = i === 0 ? -width * 0.28 : width * 0.28;
          pl.position.set(hx, 0.02, -depth / 2 + 0.34);
          pl.rotation.y = i === 0 ? 0.15 : -0.15;
          pl.userData.taxi = { parked: true, x0: hx, z0: -depth / 2 + 0.34, speed: 0, phase: i, span: 0 };
        } else {
          const x0 = (i % 2 === 0 ? -0.05 : 0.05);
          const z0 = -depth * 0.05 + ((i - 2) / Math.max(1, nPlanes - 3)) * depth * 0.35;
          pl.position.set(x0, 0.02, z0);
          pl.userData.taxi = {
            parked: false, x0, z0,
            phase: i * 0.9,
            speed: 0.7 + (i % 3) * 0.15,
            span: depth * 0.22
          };
        }
        group.add(pl);
        taxi.push(pl);
      }
      group.userData.taxiPlanes = taxi;

      if (fireTimer > 0) {
        const spr = makeTimerSprite(fireTimer);
        spr.position.set(0, 0.85, -depth / 2 + 0.15);
        spr.scale.set(0.55, 0.55, 1);
        group.add(spr);
      }
      const planeStars = stars || 0;
      for (let s = 0; s < planeStars; s++) {
        const star = makeStarSprite();
        star.position.set(-0.22 + s * 0.22, 0.95, -depth / 2 + 0.15);
        group.add(star);
      }

      group.userData.isPlane = true;
      group.userData.isUnit = true;
      return group;
};

BM.createBigPlaneMesh = BM.createAirportMesh;
