/* Single-player standing dummies. */
window.BM = window.BM || {};

BM.makeTargetHpSprite = function (hp, maxHp) {
      const canvas = document.createElement("canvas");
      canvas.width = 128; canvas.height = 48;
      const ctx = canvas.getContext("2d");
      ctx.font = "bold 28px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 6;
      const label = hp <= 0 ? "DOWN" : (hp + " HP");
      ctx.strokeText(label, 64, 24);
      ctx.fillStyle = hp <= 0 ? "#9e9e9e" : hp <= 50 ? "#ffcc80" : "#fff59d";
      ctx.fillText(label, 64, 24);
      const tex = new THREE.CanvasTexture(canvas);
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      spr.scale.set(1.15, 0.42, 1);
      return spr;
};

BM.makeTargetFaceTexture = function (kind) {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const cx = size / 2, cy = size / 2;
      const rings = kind === "bull"
        ? [
            [1.00, "#b71c1c"],
            [0.78, "#fafafa"],
            [0.58, "#c62828"],
            [0.38, "#fafafa"],
            [0.18, "#ffe082"]
          ]
        : [
            [1.00, "#b71c1c"],
            [0.72, "#fafafa"],
            [0.42, "#ef9a9a"]
          ];
      rings.forEach(([r, color]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r * (size / 2 - 1), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
      if (kind === "bull") {
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.035, 0, Math.PI * 2);
        ctx.fillStyle = "#3e2723";
        ctx.fill();
      }
      const tex = new THREE.CanvasTexture(canvas);
      if ("SRGBColorSpace" in THREE) tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      return tex;
};

BM.makeLetterTexture = function (letter) {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.font = "bold 46px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = "#1b2a1c";
      ctx.lineWidth = 8;
      ctx.strokeText(String(letter), 32, 36);
      ctx.fillStyle = "#ffe082";
      ctx.fillText(String(letter), 32, 36);
      const tex = new THREE.CanvasTexture(canvas);
      if ("SRGBColorSpace" in THREE) tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
};

BM.makeStandingFigure = function (isBull, label) {
  const makeTargetFaceTexture = BM.makeTargetFaceTexture;
  const makeLetterTexture = BM.makeLetterTexture;
      const figure = new THREE.Group();
      figure.rotation.y = Math.PI;
      const matBody = new THREE.MeshStandardMaterial({
        color: isBull ? 0x3d5c3a : 0x4a6744,
        roughness: 0.62
      });
      const matDark = new THREE.MeshStandardMaterial({ color: 0x2a4328, roughness: 0.7 });
      const matBoot = new THREE.MeshStandardMaterial({ color: 0x1b3d1f, roughness: 0.85 });
      const matEdge = new THREE.MeshStandardMaterial({ color: 0x1b2a1c, roughness: 0.8 });
      const matStake = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.88 });

      const stake = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.82, 8), matStake);
      stake.position.set(0, 0.41, -0.08);
      stake.castShadow = true;
      figure.add(stake);

      const hips = new THREE.Group();
      hips.position.y = 0.28;
      const legL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.28, 0.1), matBody);
      legL.position.set(-0.09, -0.14, 0);
      legL.castShadow = true;
      hips.add(legL);
      const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.16), matBoot);
      bootL.position.set(-0.09, -0.3, 0.02);
      hips.add(bootL);
      const legR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.28, 0.1), matBody);
      legR.position.set(0.09, -0.14, 0);
      hips.add(legR);
      const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.16), matBoot);
      bootR.position.set(0.09, -0.3, 0.02);
      hips.add(bootR);
      figure.add(hips);

      const torso = new THREE.Group();
      torso.position.y = 0.42;
      const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.34, 0.16), matBody);
      torsoMesh.castShadow = true;
      torso.add(torsoMesh);
      const belt = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.18), matDark);
      belt.position.y = -0.14;
      torso.add(belt);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), matBody);
      head.position.y = 0.28;
      head.castShadow = true;
      torso.add(head);
      const helmet = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.55),
        matDark
      );
      helmet.position.y = 0.3;
      torso.add(helmet);
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.03, 12), matDark);
      brim.position.y = 0.24;
      torso.add(brim);

      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.08), matBody);
      armL.position.set(-0.22, -0.02, 0);
      torso.add(armL);
      const armR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.08), matBody);
      armR.position.set(0.22, -0.02, 0);
      torso.add(armR);

      const faceR = isBull ? 0.13 : 0.11;
      const face = new THREE.Mesh(
        new THREE.CircleGeometry(faceR, 28),
        new THREE.MeshStandardMaterial({
          map: makeTargetFaceTexture(isBull ? "bull" : "ring"),
          roughness: 0.48,
          metalness: 0.05
        })
      );
      face.position.set(0, 0.02, 0.09);
      torso.add(face);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(faceR, 0.012, 6, 20), matEdge);
      rim.position.copy(face.position);
      torso.add(rim);

      if (label) {
        const badge = new THREE.Sprite(
          new THREE.SpriteMaterial({ map: makeLetterTexture(label), transparent: true })
        );
        badge.scale.set(0.22, 0.22, 1);
        badge.position.set(0, 0.52, 0);
        torso.add(badge);
      }

      figure.add(torso);
      return figure;
};

BM.createBullseyeMesh = function (widthCols, label, bullIndex) {
  const CELL = BM.CELL;
  const makeStandingFigure = BM.makeStandingFigure;
      const g = new THREE.Group();
      const pivot = new THREE.Group();
      pivot.name = "dummy";
      g.add(pivot);
      const n = Math.max(1, widthCols | 0);
      const bull = bullIndex == null ? Math.floor(n / 2) : bullIndex;
      // 1-shot stays unit size. 2-hit and 3-wide targets scale up.
      const scale = n >= 3 ? 1.68 : n >= 2 ? 1.36 : 1;
      for (let i = 0; i < n; i++) {
        const fig = makeStandingFigure(i === bull, i === bull ? label : "");
        fig.position.x = (i - (n - 1) / 2) * CELL;
        fig.scale.setScalar(scale);
        pivot.add(fig);
      }
      g.userData.idleTarget = true;
      g.userData.dummy = pivot;
      g.userData.faceY = 1.18 * scale;
      g.userData.targetScale = scale;
      return g;
};

BM.spLayout = function () {
      // 8 columns: 3-wide, 1-wide, 2-wide, 2-col (second 3-wide clipped to fit)
      return [
        { name: "A", cols: [0, 1, 2], bull: 1 },
        { name: "D", cols: [3], bull: 3 },
        { name: "C", cols: [4, 5], bull: 4 },
        { name: "B", cols: [6, 7], bull: 6 }
      ];
};

BM.allTargetsDead = function (spTargets) {
  return spTargets.length > 0 && spTargets.every(t => t.hp <= 0);
};

BM.refreshTargetSprite = function (t) {
  const makeTargetHpSprite = BM.makeTargetHpSprite;
      if (t.hpSpr) t.mesh.remove(t.hpSpr);
      t.hpSpr = makeTargetHpSprite(t.hp, t.maxHp);
      const sc = t.mesh.userData.targetScale || 1;
      t.hpSpr.position.set(0, t.mesh.userData.faceY || 1.2, 0);
      t.hpSpr.scale.set(1.15 * sc, 0.42 * sc, 1);
      t.mesh.add(t.hpSpr);
      const dummy = t.mesh.userData.dummy;
      if (dummy) {
        dummy.rotation.x = t.hp <= 0 ? Math.PI / 2.05 : 0;
        dummy.rotation.z = 0;
      }
};
