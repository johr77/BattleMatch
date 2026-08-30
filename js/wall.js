/* Connected security barrier mesh. */
window.BM = window.BM || {};

BM.createWallMesh = function (len, wallLevel) {
  const CELL = BM.CELL;
  const makeStarSprite = BM.makeStarSprite;
      const group = new THREE.Group();
      len = Math.max(1, len);
      const doubled = (wallLevel || 1) >= 2;
      const width = len * CELL;
      const matConc = new THREE.MeshStandardMaterial({ color: doubled ? 0x607d8b : 0x78909c, roughness: 0.85 });
      const matDark = new THREE.MeshStandardMaterial({ color: doubled ? 0x37474f : 0x455a64, roughness: 0.7, metalness: 0.2 });
      const matWire = new THREE.MeshStandardMaterial({ color: 0x90a4ae, metalness: 0.6, roughness: 0.35 });
      const matRust = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.8 });

      const base = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.98, 0.12, CELL * 0.55),
        matConc
      );
      base.position.y = 0.08;
      base.castShadow = true;
      group.add(base);

      // Single = half height. Doubled = stacked / thicker barrier.
      const panelH = doubled ? 0.92 : 0.48;
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.96, panelH, doubled ? 0.18 : 0.12),
        matDark
      );
      panel.position.y = 0.12 + panelH / 2;
      panel.castShadow = true;
      group.add(panel);

      const postH = doubled ? 1.08 : 0.62;
      for (let i = 0; i <= len; i++) {
        const x = -width / 2 + i * CELL;
        const post = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, postH, 0.08),
          matConc
        );
        post.position.set(x, postH / 2 + 0.06, 0);
        post.castShadow = true;
        group.add(post);
      }

      const railYs = doubled ? [0.28, 0.48, 0.72, 0.92] : [0.28, 0.48];
      for (const y of railYs) {
        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(width * 0.94, 0.035, 0.04),
          matWire
        );
        rail.position.set(0, y, doubled ? 0.12 : 0.08);
        group.add(rail);
      }

      const wireY = doubled ? 1.12 : 0.66;
      const coils = Math.max(3, len * 3);
      for (let i = 0; i < coils; i++) {
        const x = -width / 2 + 0.2 + i * ((width - 0.4) / Math.max(1, coils - 1));
        const coil = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.014, 6, 10), matWire);
        coil.position.set(x, wireY, 0.02);
        coil.rotation.y = Math.PI / 2;
        coil.rotation.z = (i % 2) * 0.25;
        group.add(coil);
      }
      for (let i = 0; i < len * 2; i++) {
        const strand = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.2), matRust);
        strand.position.set(-width / 2 + 0.25 + i * (width / Math.max(1, len * 2)), wireY + 0.04, 0.05);
        strand.rotation.x = 0.35 * (i % 2 === 0 ? 1 : -1);
        group.add(strand);
      }

      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.96, 0.07, doubled ? 0.2 : 0.13),
        new THREE.MeshStandardMaterial({ color: doubled ? 0xff9800 : 0xffc107, roughness: 0.6 })
      );
      // Same height on single and double so adjacent levels line up
      stripe.position.y = 0.34;
      group.add(stripe);

      if (doubled) {
        const star = makeStarSprite();
        star.position.set(0, panelH + 0.28, 0.05);
        group.add(star);
      }

      group.userData.isUnit = true;
      group.userData.isWallMesh = true;
      return group;
};
