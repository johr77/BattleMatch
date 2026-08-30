/* Army men, plus small tanks/planes when those colors sit as single pieces. */
window.BM = window.BM || {};

BM.createUnitMesh = function (color, locked, fireTimer, isWall) {
  const COLOR_HEX = BM.COLOR_HEX;
  const buildTankModel = BM.buildTankModel;
  const buildPlaneModel = BM.buildPlaneModel;
  const makeTimerSprite = BM.makeTimerSprite;
      const group = new THREE.Group();
      const hex = COLOR_HEX[color];
      const dark = new THREE.Color(hex).multiplyScalar(0.65).getHex();

      if (color === "green") {
        // Low-poly army man — hierarchical limbs for idle anim
        const mat = new THREE.MeshStandardMaterial({ color: hex, roughness: 0.55 });
        const matD = new THREE.MeshStandardMaterial({ color: dark, roughness: 0.6 });
        const matGun = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.4, metalness: 0.3 });
        const matBoot = new THREE.MeshStandardMaterial({ color: 0x1b3d1f, roughness: 0.8 });

        // Hips / lower body anchor
        const hips = new THREE.Group();
        hips.position.y = 0.28;

        // Legs (from hips)
        const legL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.28, 0.1), mat);
        legL.position.set(-0.09, -0.14, 0);
        legL.castShadow = true;
        hips.add(legL);
        const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.16), matBoot);
        bootL.position.set(-0.09, -0.3, 0.02);
        hips.add(bootL);

        const legR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.28, 0.1), mat);
        legR.position.set(0.09, -0.14, 0);
        legR.castShadow = true;
        hips.add(legR);
        const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.16), matBoot);
        bootR.position.set(0.09, -0.3, 0.02);
        hips.add(bootR);

        group.add(hips);

        // Torso (animated slightly)
        const torso = new THREE.Group();
        torso.position.y = 0.42;
        torso.name = "torso";
        const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.34, 0.18), mat);
        torsoMesh.castShadow = true;
        torso.add(torsoMesh);
        // belt
        const belt = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.2), matD);
        belt.position.y = -0.14;
        torso.add(belt);
        // pack
        const pack = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.08), matD);
        pack.position.set(0, 0.02, -0.13);
        torso.add(pack);

        // Head + helmet on torso
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), mat);
        head.position.y = 0.28;
        head.castShadow = true;
        torso.add(head);
        const helmet = new THREE.Mesh(
          new THREE.SphereGeometry(0.13, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55),
          matD
        );
        helmet.position.y = 0.3;
        torso.add(helmet);
        // brim
        const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.03, 12), matD);
        brim.position.y = 0.24;
        torso.add(brim);

        // Left arm (idle swing)
        const armL = new THREE.Group();
        armL.position.set(-0.2, 0.1, 0);
        armL.name = "armL";
        const armLMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.08), mat);
        armLMesh.position.y = -0.12;
        armLMesh.castShadow = true;
        armL.add(armLMesh);
        torso.add(armL);

        // Right arm + rifle
        const armR = new THREE.Group();
        armR.position.set(0.2, 0.1, 0);
        armR.name = "armR";
        const armRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), mat);
        armRMesh.position.y = -0.08;
        armRMesh.castShadow = true;
        armR.add(armRMesh);
        // rifle held forward
        const rifle = new THREE.Group();
        rifle.position.set(0.05, -0.12, 0.18);
        const stock = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.45), matGun);
        rifle.add(stock);
        const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.2), matGun);
        barrel.position.z = 0.28;
        rifle.add(barrel);
        const grip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.1, 0.04), matGun);
        grip.position.set(0, -0.05, -0.05);
        rifle.add(grip);
        armR.add(rifle);
        torso.add(armR);

        group.add(torso);
        group.userData.idle = true; // mark for breathing animation
      } else if (color === "blue") {
        const tank = buildTankModel(0.7, 0.56);
        tank.position.y = 0.02;
        group.add(tank);
        group.userData.isTankModel = true;
      } else {
        const pl = buildPlaneModel();
        pl.position.y = 0.02;
        group.add(pl);
      }

      // Gold lock ring when matched
      if (locked) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.38, 0.035, 8, 24),
          new THREE.MeshBasicMaterial({ color: isWall ? 0xb0bec5 : 0xffe082 })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.08;
        group.add(ring);
        // Countdown badge for armed (non-wall) locks
        if (!isWall && fireTimer > 0) {
          group.add(makeTimerSprite(fireTimer));
        }
      }

      group.userData.isUnit = true;
      return group;
};

BM.animateArmyIdle = function (root, t) {
      root.traverse(obj => {
        if (obj.name === "torso") {
          obj.rotation.y = Math.sin(t * 1.2) * 0.04;
          obj.position.y = 0.42 + Math.sin(t * 2.0) * 0.012; // breathe
        }
        if (obj.name === "armL") {
          obj.rotation.x = Math.sin(t * 1.5) * 0.15;
        }
        if (obj.name === "armR") {
          obj.rotation.x = Math.sin(t * 1.5 + 0.5) * 0.08;
        }
      });
};
