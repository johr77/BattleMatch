/* Timer and star labels used on units and buildings. */
window.BM = window.BM || {};

BM.makeTimerSprite = function (n) {
      const canvas = document.createElement("canvas");
      canvas.width = 64; canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.font = "bold 42px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 8;
      ctx.strokeText(String(n), 32, 34);
      ctx.fillStyle = "#ffe082";
      ctx.fillText(String(n), 32, 34);
      const tex = new THREE.CanvasTexture(canvas);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const spr = new THREE.Sprite(mat);
      spr.scale.set(0.5, 0.5, 1);
      spr.position.set(0, 0.95, 0); // on top of a single unit
      return spr;
};

BM.makeStarSprite = function () {
      const canvas = document.createElement("canvas");
      canvas.width = 64; canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.translate(32, 32);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + i * (Math.PI * 2 / 5);
        const x = Math.cos(a) * 16, y = Math.sin(a) * 16;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        const a2 = a + Math.PI / 5;
        ctx.lineTo(Math.cos(a2) * 7, Math.sin(a2) * 7);
      }
      ctx.closePath();
      ctx.fillStyle = "#ffee58";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();
      const tex = new THREE.CanvasTexture(canvas);
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      spr.scale.set(0.38, 0.38, 1);
      return spr;
};
