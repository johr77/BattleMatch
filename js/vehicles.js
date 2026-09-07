/* Tank and plane models used inside the depot and airport. */
window.BM = window.BM || {};

BM.buildTankModel = function (length, width) {
      const g = new THREE.Group();
      const matHull = new THREE.MeshStandardMaterial({ color: 0x1e88e5, roughness: 0.42, metalness: 0.38 });
      const matDark = new THREE.MeshStandardMaterial({ color: 0x1565c0, roughness: 0.46, metalness: 0.32 });
      const matDeep = new THREE.MeshStandardMaterial({ color: 0x0d47a1, roughness: 0.5, metalness: 0.3 });
      const matTrack = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.88 });
      const matSteel = new THREE.MeshStandardMaterial({ color: 0x546e7a, metalness: 0.58, roughness: 0.32 });
      const matRubber = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.92 });
      const matTrim = new THREE.MeshStandardMaterial({ color: 0x37474f, metalness: 0.4, roughness: 0.45 });

      const trackW = Math.max(0.11, width * 0.22);
      const trackX = width * 0.38;
      const nWheels = Math.max(3, Math.round(length / 0.26));

      for (const x of [-trackX, trackX]) {
        const pad = new THREE.Mesh(new THREE.BoxGeometry(trackW, 0.07, length * 0.9), matTrack);
        pad.position.set(x, 0.055, 0);
        g.add(pad);
        const skirt = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, length * 0.88), matDeep);
        skirt.position.set(x + Math.sign(x) * (trackW * 0.28), 0.16, 0);
        g.add(skirt);
        for (let i = 0; i < nWheels; i++) {
          const z = -length * 0.36 + i * (length * 0.72 / Math.max(1, nWheels - 1));
          const r = (i === 0 || i === nWheels - 1) ? 0.085 : 0.07;
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(r, r, trackW * 0.92, 10), matRubber);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(x, 0.085, z);
          wheel.name = "wheel";
          wheel.castShadow = true;
          g.add(wheel);
          const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.4, r * 0.4, trackW * 1.05, 8), matSteel);
          hub.rotation.z = Math.PI / 2;
          hub.position.set(x, 0.085, z);
          g.add(hub);
        }
      }

      const hull = new THREE.Mesh(new THREE.BoxGeometry(width * 0.62, 0.16, length * 0.78), matHull);
      hull.position.y = 0.22;
      hull.castShadow = true;
      g.add(hull);

      const glacis = new THREE.Mesh(new THREE.BoxGeometry(width * 0.58, 0.1, length * 0.28), matDark);
      glacis.position.set(0, 0.24, length * 0.28);
      glacis.rotation.x = -0.48;
      glacis.castShadow = true;
      g.add(glacis);

      const deck = new THREE.Mesh(new THREE.BoxGeometry(width * 0.56, 0.08, length * 0.42), matDark);
      deck.position.set(0, 0.3, -length * 0.04);
      g.add(deck);

      const bustle = new THREE.Mesh(new THREE.BoxGeometry(width * 0.5, 0.1, length * 0.22), matDeep);
      bustle.position.set(0, 0.28, -length * 0.32);
      g.add(bustle);

      const hatch = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.04, 8), matTrim);
      hatch.position.set(-width * 0.1, 0.35, -length * 0.08);
      g.add(hatch);

      const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.14, 8), matSteel);
      exhaust.rotation.z = Math.PI / 2;
      exhaust.position.set(width * 0.22, 0.34, -length * 0.34);
      g.add(exhaust);
      const smoke = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, 0.08, 6), matTrim);
      smoke.position.set(width * 0.3, 0.38, -length * 0.34);
      g.add(smoke);

      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.42, 5), matSteel);
      antenna.position.set(-width * 0.18, 0.52, -length * 0.22);
      g.add(antenna);

      const turret = new THREE.Group();
      turret.name = "turret";
      turret.position.set(0, 0.42, length * 0.02);
      const tBody = new THREE.Mesh(new THREE.CylinderGeometry(width * 0.2, width * 0.24, 0.18, 8), matDark);
      tBody.castShadow = true;
      turret.add(tBody);
      const tTop = new THREE.Mesh(new THREE.CylinderGeometry(width * 0.16, width * 0.2, 0.05, 8), matHull);
      tTop.position.y = 0.11;
      turret.add(tTop);
      const mantle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.16), matSteel);
      mantle.position.set(0, 0.01, width * 0.2);
      turret.add(mantle);
      const barrelLen = Math.max(0.45, length * 0.55);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.038, barrelLen, 8), matSteel);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.02, width * 0.2 + barrelLen * 0.5);
      turret.add(barrel);
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, barrelLen * 0.28, 8), matTrim);
      sleeve.rotation.x = Math.PI / 2;
      sleeve.position.set(0, 0.02, width * 0.2 + barrelLen * 0.28);
      turret.add(sleeve);
      const brake = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.1, 8), matSteel);
      brake.rotation.x = Math.PI / 2;
      brake.position.set(0, 0.02, width * 0.2 + barrelLen + 0.02);
      turret.add(brake);
      const cupola = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.07, 8), matHull);
      cupola.position.set(0.07, 0.16, -0.04);
      turret.add(cupola);
      const flash = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfff59d, transparent: true, opacity: 0 })
      );
      flash.position.set(0, 0.02, width * 0.2 + barrelLen + 0.1);
      turret.add(flash);
      g.add(turret);
      g.userData.flash = flash;
      g.userData.isTankModel = true;
      return g;
};

BM.buildPlaneModel = function (hex) {
      const group = new THREE.Group();
      const body = hex != null ? hex : 0xe53935;
      const mat = new THREE.MeshStandardMaterial({ color: body, roughness: 0.45, metalness: 0.25 });
      const matDark = new THREE.MeshStandardMaterial({ color: new THREE.Color(body).multiplyScalar(0.65), roughness: 0.5 });
      const matSteel = new THREE.MeshStandardMaterial({ color: 0x37474f, metalness: 0.45, roughness: 0.4 });
      const fuselage = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.55), mat);
      fuselage.position.y = 0.28;
      fuselage.castShadow = true;
      group.add(fuselage);
      const nose = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.14), matDark);
      nose.position.set(0, 0.27, 0.32);
      group.add(nose);
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.03, 0.18), mat);
      wing.position.set(0, 0.26, 0.02);
      wing.castShadow = true;
      group.add(wing);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.03, 0.1), mat);
      tail.position.set(0, 0.28, -0.22);
      group.add(tail);
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.14, 0.1), matDark);
      fin.position.set(0, 0.36, -0.22);
      group.add(fin);
      const cockpit = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.06, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x81d4fa, roughness: 0.2, metalness: 0.3 })
      );
      cockpit.position.set(0, 0.35, 0.1);
      group.add(cockpit);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.08, 8), matSteel);
      hub.rotation.x = Math.PI / 2;
      hub.position.set(0, 0.28, 0.4);
      group.add(hub);
      const prop = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.02, 0.04), matSteel);
      prop.position.set(0, 0.28, 0.44);
      prop.name = "prop";
      group.add(prop);
      group.userData.isPlaneModel = true;
      return group;
};
