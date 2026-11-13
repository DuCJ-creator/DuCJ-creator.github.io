(() => {
  "use strict";

  const canvas = document.querySelector("#aquarium");
  const ctx = canvas.getContext("2d", { alpha: false });
  const ui = {
    listenButton: document.querySelector("#listenButton"),
    listenLabel: document.querySelector("#listenLabel"),
    dbValue: document.querySelector("#dbValue"),
    dbMeterFill: document.querySelector("#dbMeterFill"),
    wakeDb: document.querySelector("#wakeDb"),
    angryDb: document.querySelector("#angryDb"),
    attackDb: document.querySelector("#attackDb"),
    orbRing: document.querySelector("#orbRing"),
    countdown: document.querySelector("#countdown"),
    fishCount: document.querySelector("#fishCount"),
    progressBar: document.querySelector("#progressBar"),
    progressFill: document.querySelector("#progressFill"),
    quietMessage: document.querySelector("#quietMessage"),
    quietCard: document.querySelector("#quietCard"),
    progressToggleButton: document.querySelector("#progressToggleButton"),
    settingsButton: document.querySelector("#settingsButton"),
    settingsPanel: document.querySelector("#settingsPanel"),
    thresholdRange: document.querySelector("#thresholdRange"),
    thresholdOutput: document.querySelector("#thresholdOutput"),
    sensitivityRange: document.querySelector("#sensitivityRange"),
    sensitivityOutput: document.querySelector("#sensitivityOutput"),
    testFishButton: document.querySelector("#testFishButton"),
    resetButton: document.querySelector("#resetButton"),
    fullscreenButton: document.querySelector("#fullscreenButton"),
    dropTimer: document.querySelector("#dropTimer"),
    timerValue: document.querySelector("#timerValue"),
    timerMinutes: document.querySelector("#timerMinutes"),
    timerToggleButton: document.querySelector("#timerToggleButton"),
    timerResetButton: document.querySelector("#timerResetButton"),
    timerStatus: document.querySelector("#timerStatus"),
    toast: document.querySelector("#toast")
  };

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    running: false,
    audioContext: null,
    analyser: null,
    stream: null,
    audioData: null,
    displayDb: 30,
    targetDb: 30,
    threshold: 50,
    micOffset: 0,
    quietSeconds: 0,
    lastTimerTick: performance.now(),
    loudSeconds: 0,
    creatures: [],
    bubbles: [],
    particles: [],
    plants: [],
    kelp: [],
    shellMounds: [],
    rockFormation: null,
    usedNumbers: new Set(),
    sharkResponse: 0,
    sharkHunt: 0,
    sharkAttack: null,
    nextHuntAllowed: 0,
    nextWakeBubble: 0,
    examTimer: {
      durationMinutes: 10,
      remainingSeconds: 600,
      running: false,
      endAt: 0,
      renderedSecond: -1,
      finished: false
    },
    toastTimer: 0,
    lastFrame: performance.now(),
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  const QUIET_GOAL = 60;
  const TAU = Math.PI * 2;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const random = (min, max) => min + Math.random() * (max - min);
  try {
    const savedOffset = Number(localStorage.getItem("quietAquariumMicOffset"));
    if (Number.isFinite(savedOffset)) state.micOffset = clamp(savedOffset, -15, 15);
  } catch { /* Storage is optional; microphone analysis still works without it. */ }

  class Bubble {
    constructor(initial = false) { this.reset(initial); }
    reset(initial = false) {
      this.x = random(0.04, 0.96);
      this.y = initial ? random(0.05, 1.05) : random(1, 1.15);
      this.r = random(2, 9);
      this.speed = random(0.014, 0.058);
      this.wobble = random(0.6, 1.8);
      this.phase = random(0, TAU);
      this.alpha = random(0.2, 0.58);
      this.driftX = 0;
      this.wake = 0;
    }
    update(dt, time) {
      const px = this.x * state.width;
      const py = this.y * state.height;
      for (const creature of state.creatures) {
        const dx = px - creature.x;
        const dy = py - creature.y;
        const reach = creature.size * (creature.type === "urchin" ? 3.8 : 3.1);
        const distance = Math.hypot(dx, dy);
        if (distance > reach || distance < .1) continue;
        const influence = 1 - distance / reach;
        this.driftX += (Math.sign(dx) * 42 + creature.direction * creature.speed * .72) * influence * dt;
        this.y -= influence * .008 * dt;
        this.wake = Math.max(this.wake, influence);
      }
      this.driftX *= Math.pow(.09, dt);
      this.x += this.driftX * dt / Math.max(1, state.width);
      this.y -= this.speed * dt;
      if (this.x < .015) this.x = .985;
      if (this.x > .985) this.x = .015;
      if (this.y < -0.05) this.reset();
      this.draw(time);
      this.wake = Math.max(0, this.wake - dt * 1.7);
    }
    releaseFrom(creature) {
      this.x = clamp((creature.x - creature.direction * creature.size * random(.6, 1.2)) / state.width, .02, .98);
      this.y = clamp((creature.y + random(-creature.size * .25, creature.size * .35)) / state.height, .05, .94);
      this.r = random(1.8, 4.4);
      this.speed = random(.022, .064);
      this.alpha = random(.38, .7);
      this.driftX = -creature.direction * random(8, 24);
      this.wake = 1;
      this.phase = random(0, TAU);
    }
    draw(time) {
      const turbulence = 8 + this.wake * 10;
      const x = this.x * state.width + Math.sin(time * .001 * this.wobble + this.phase) * turbulence;
      const y = this.y * state.height;
      const radius = this.r * (1 + this.wake * .16);
      const alpha = Math.min(.84, this.alpha + this.wake * .18);
      const gradient = ctx.createRadialGradient(x - radius * .35, y - radius * .35, .2, x, y, radius);
      gradient.addColorStop(0, `rgba(235,255,252,${alpha})`);
      gradient.addColorStop(.28, `rgba(185,244,237,${this.alpha * .08})`);
      gradient.addColorStop(.8, `rgba(149,226,219,${this.alpha * .05})`);
      gradient.addColorStop(1, `rgba(222,255,250,${alpha * .7})`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(x, y, radius * (.8 + this.wake * .12), radius, -.2 + this.driftX * .003, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = `rgba(226,255,249,${alpha * .5})`;
      ctx.lineWidth = .65;
      ctx.beginPath();
      ctx.arc(x - radius * .12, y - radius * .08, radius * .68, -2.8, -.65);
      ctx.stroke();
      ctx.fillStyle = `rgba(248,255,253,${alpha * .8})`;
      ctx.beginPath();
      ctx.arc(x - radius * .28, y - radius * .35, Math.max(.65, radius * .105), 0, TAU);
      ctx.fill();
    }
  }

  function drawNumberTag(creature, yOffset, alpha = 1) {
    const age = clamp((performance.now() - creature.born) / 900, 0, 1);
    ctx.save();
    ctx.globalAlpha = age * alpha * .92;
    ctx.translate(creature.x, creature.y - yOffset);
    ctx.fillStyle = "rgba(2,28,34,.72)";
    ctx.strokeStyle = "rgba(223,253,245,.32)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(237,255,250,.94)";
    ctx.font = "600 10px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(creature.number), 0, .5);
    ctx.restore();
  }

  class AquaticResident {
    constructor(number, type, name, options = {}) {
      this.number = number;
      this.type = type;
      this.name = name;
      this.size = random(options.minSize || 22, options.maxSize || 34);
      this.x = random(.12, .82) * state.width;
      this.y = random(options.minY || .22, options.maxY || .72) * state.height;
      this.direction = Math.random() < .5 ? -1 : 1;
      this.speed = random(options.minSpeed || 6, options.maxSpeed || 15);
      this.phase = random(0, TAU);
      this.depth = random(.78, 1.04);
      this.turnTimer = random(3, 8);
      this.born = performance.now();
      this.flee = 0;
      this.bottomDweller = Boolean(options.bottomDweller);
    }
    isAttacked() { return state.sharkAttack?.target === this; }
    patrol(dt, time, minY = .16, maxY = .76, bob = 2.5) {
      if (this.isAttacked()) return;
      this.turnTimer -= dt;
      if (this.turnTimer <= 0) {
        if (Math.random() < .34) this.direction *= -1;
        this.turnTimer = random(3.5, 9);
      }
      const margin = this.size * 2.5;
      if (this.x < margin) this.direction = 1;
      if (this.x > state.width - margin) this.direction = -1;
      const fright = state.sharkResponse > .68 ? state.sharkResponse * 18 : 0;
      this.x += this.direction * (this.speed + fright + this.flee * 65) * dt;
      this.y += Math.sin(time * .0015 + this.phase) * bob * dt;
      this.y = clamp(this.y, state.height * minY, state.height * maxY);
      this.flee = Math.max(0, this.flee - dt * .7);
    }
  }

  class Koi extends AquaticResident {
    constructor(number) {
      super(number, "koi", "小錦鯉", { minSize: 30, maxSize: 43, minY: .2, maxY: .73, minSpeed: 12, maxSpeed: 22 });
      this.depth = random(.72, 1.06);
    }
    update(dt, time) {
      const beingAttacked = state.sharkAttack?.target === this;
      if (!beingAttacked) {
        this.turnTimer -= dt;
        if (this.turnTimer <= 0) {
          if (Math.random() < .36) this.direction *= -1;
          this.turnTimer = random(3.5, 9);
        }
        const margin = this.size * 2.5;
        if (this.x < margin) this.direction = 1;
        if (this.x > state.width - margin) this.direction = -1;
        const fright = state.sharkResponse > .68 ? state.sharkResponse * 20 : 0;
        this.x += this.direction * (this.speed + fright + this.flee * 70) * dt;
        this.y += Math.sin(time * .0013 + this.phase) * 3.5 * dt;
        this.y = clamp(this.y, state.height * .15, state.height * .76);
        this.flee = Math.max(0, this.flee - dt * .7);
      }
      this.draw(time);
    }
    draw(time) {
      const age = clamp((time - this.born) / 900, 0, 1);
      const scale = this.depth * age;
      const sway = Math.sin(time * .006 + this.phase);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(this.direction * scale, scale);

      ctx.globalAlpha = .12 * age;
      ctx.fillStyle = "#00171b";
      ctx.beginPath();
      ctx.ellipse(-this.size * .08, this.size * .66, this.size * 1.08, this.size * .2, 0, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;

      const tailAngle = sway * .24;
      ctx.save();
      ctx.translate(-this.size * .88, 0);
      ctx.rotate(tailAngle);
      const tail = ctx.createLinearGradient(-this.size, 0, 0, 0);
      tail.addColorStop(0, "rgba(203,71,57,.18)");
      tail.addColorStop(.48, "rgba(239,112,84,.54)");
      tail.addColorStop(1, "rgba(142,42,39,.9)");
      ctx.fillStyle = tail;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size * .44, -this.size * .15, -this.size * .76, -this.size * .72, -this.size * 1.05, -this.size * .56);
      ctx.bezierCurveTo(-this.size * .92, -this.size * .18, -this.size * .92, this.size * .12, -this.size * 1.08, this.size * .52);
      ctx.bezierCurveTo(-this.size * .7, this.size * .68, -this.size * .4, this.size * .14, 0, 0);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,190,165,.16)";
      ctx.lineWidth = .7;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(-this.size * .1, 0);
        ctx.quadraticCurveTo(-this.size * .58, i * this.size * .13, -this.size * .98, i * this.size * .22);
        ctx.stroke();
      }
      ctx.restore();

      const bodyPath = new Path2D();
      bodyPath.moveTo(-this.size * .92, 0);
      bodyPath.bezierCurveTo(-this.size * .58, -this.size * .54, this.size * .38, -this.size * .64, this.size * .98, -this.size * .16);
      bodyPath.quadraticCurveTo(this.size * 1.16, 0, this.size * .98, this.size * .18);
      bodyPath.bezierCurveTo(this.size * .38, this.size * .62, -this.size * .58, this.size * .54, -this.size * .92, 0);

      const body = ctx.createLinearGradient(0, -this.size * .62, 0, this.size * .62);
      body.addColorStop(0, "#ffb39c");
      body.addColorStop(.15, "#e8644d");
      body.addColorStop(.52, "#b52d2d");
      body.addColorStop(.82, "#7b2227");
      body.addColorStop(1, "#421d24");
      ctx.fillStyle = body;
      ctx.fill(bodyPath);

      ctx.save();
      ctx.clip(bodyPath);
      const patch = ctx.createRadialGradient(this.size * .42, -this.size * .27, 0, this.size * .42, -this.size * .27, this.size * .52);
      patch.addColorStop(0, "rgba(255,218,190,.52)");
      patch.addColorStop(.58, "rgba(245,138,105,.24)");
      patch.addColorStop(1, "rgba(245,138,105,0)");
      ctx.fillStyle = patch;
      ctx.fillRect(-this.size, -this.size, this.size * 2.3, this.size * 2);

      const scaleRadius = this.size * .155;
      ctx.lineWidth = Math.max(.55, this.size * .018);
      for (let row = 0; row < 5; row++) {
        const sy = (row - 2) * this.size * .18;
        for (let col = 0; col < 9; col++) {
          const sx = -this.size * .72 + col * this.size * .19 + (row % 2) * this.size * .095;
          const edgeFade = 1 - Math.min(1, Math.abs(sx) / (this.size * 1.05));
          ctx.strokeStyle = `rgba(255,203,177,${.16 + edgeFade * .2})`;
          ctx.beginPath();
          ctx.arc(sx, sy, scaleRadius, .12, Math.PI - .12);
          ctx.stroke();
          ctx.strokeStyle = `rgba(71,20,27,${.09 + edgeFade * .11})`;
          ctx.beginPath();
          ctx.arc(sx, sy + this.size * .015, scaleRadius * .88, Math.PI + .18, TAU - .18);
          ctx.stroke();
        }
      }

      ctx.globalCompositeOperation = "screen";
      const sheen = ctx.createLinearGradient(-this.size, -this.size * .5, this.size, this.size * .45);
      sheen.addColorStop(0, "rgba(255,255,255,0)");
      sheen.addColorStop(.42, "rgba(255,226,205,.14)");
      sheen.addColorStop(.54, "rgba(255,246,232,.28)");
      sheen.addColorStop(.68, "rgba(255,255,255,0)");
      ctx.fillStyle = sheen;
      ctx.fillRect(-this.size, -this.size, this.size * 2.2, this.size * 2);
      ctx.restore();

      ctx.fillStyle = "rgba(129,34,38,.72)";
      ctx.beginPath();
      ctx.moveTo(-this.size * .25, -this.size * .45);
      ctx.quadraticCurveTo(-this.size * .04, -this.size * .88, this.size * .2, -this.size * .46);
      ctx.quadraticCurveTo(-this.size * .03, -this.size * .34, -this.size * .25, -this.size * .45);
      ctx.fill();

      const finWave = sway * this.size * .06;
      ctx.fillStyle = "rgba(225,88,67,.5)";
      ctx.beginPath();
      ctx.moveTo(this.size * .08, this.size * .34);
      ctx.quadraticCurveTo(this.size * .26 + finWave, this.size * .78, this.size * .48, this.size * .38);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(82,21,27,.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.size * .58, 0, this.size * .29, -1.1, 1.12);
      ctx.stroke();

      ctx.fillStyle = "#0d1616";
      ctx.beginPath();
      ctx.arc(this.size * .78, -this.size * .18, this.size * .057, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "rgba(245,255,240,.8)";
      ctx.beginPath();
      ctx.arc(this.size * .8, -this.size * .2, this.size * .018, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,185,154,.55)";
      ctx.lineWidth = .75;
      ctx.beginPath();
      ctx.moveTo(this.size * .94, this.size * .06);
      ctx.quadraticCurveTo(this.size * 1.12, this.size * .14, this.size * 1.2, this.size * .25);
      ctx.moveTo(this.size * .92, this.size * .1);
      ctx.quadraticCurveTo(this.size * 1.08, this.size * .22, this.size * 1.12, this.size * .34);
      ctx.stroke();
      ctx.restore();

      drawNumberTag(this, this.size * scale * .88, age);
    }
  }

  class Shrimp extends AquaticResident {
    constructor(number) {
      super(number, "shrimp", "小蝦", { minSize: 22, maxSize: 30, minY: .28, maxY: .76, minSpeed: 7, maxSpeed: 12 });
      this.dart = random(1.5, 4.5);
    }
    update(dt, time) {
      if (!this.isAttacked()) {
        this.dart -= dt;
        if (this.dart < 0) {
          this.flee = 1.25;
          this.direction *= Math.random() < .3 ? -1 : 1;
          this.dart = random(2.8, 6.5);
        }
      }
      this.patrol(dt, time, .22, .76, 4);
      this.draw(time);
    }
    draw(time) {
      const s = this.size * this.depth;
      const curl = Math.sin(time * .011 + this.phase);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(this.direction, 1);
      ctx.strokeStyle = "rgba(242,167,139,.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(s * .52, -s * .12);
      ctx.bezierCurveTo(s * 1.05, -s * .82, s * 1.35, -s * .42, s * 1.65, -s * .72 + curl * 2);
      ctx.moveTo(s * .48, -s * .06);
      ctx.bezierCurveTo(s * 1.08, -s * .48, s * 1.4, .1 * s, s * 1.7, -s * .12 - curl * 2);
      ctx.stroke();
      const body = ctx.createLinearGradient(-s, -s * .4, s, s * .35);
      body.addColorStop(0, "rgba(116,49,47,.88)");
      body.addColorStop(.45, "rgba(215,104,82,.9)");
      body.addColorStop(1, "rgba(247,171,137,.72)");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.moveTo(s * .58, -.08 * s);
      ctx.bezierCurveTo(s * .28, -s * .43, -s * .55, -s * .36, -s * .82, .02 * s);
      ctx.bezierCurveTo(-s * .6, s * .38, s * .08, s * .38, s * .58, -.08 * s);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,211,187,.36)";
      for (let i = 0; i < 5; i++) {
        const x = -s * .52 + i * s * .2;
        ctx.beginPath(); ctx.arc(x, 0, s * .31, -.95, .92); ctx.stroke();
      }
      ctx.fillStyle = "rgba(171,72,61,.78)";
      ctx.beginPath();
      ctx.moveTo(-s * .75, 0); ctx.lineTo(-s * 1.18, -s * (.4 + curl * .04)); ctx.lineTo(-s * 1.02, 0);
      ctx.lineTo(-s * 1.2, s * (.38 - curl * .04)); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(231,150,123,.45)";
      for (let i = 0; i < 5; i++) {
        const x = -s * .42 + i * s * .19;
        ctx.beginPath(); ctx.moveTo(x, s * .2); ctx.lineTo(x - s * .12, s * (.55 + (i % 2) * .08)); ctx.stroke();
      }
      ctx.fillStyle = "#101918"; ctx.beginPath(); ctx.arc(s * .43, -s * .2, 2.1, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(240,255,244,.8)"; ctx.beginPath(); ctx.arc(s * .48, -s * .24, .65, 0, TAU); ctx.fill();
      ctx.restore();
      drawNumberTag(this, s * .82);
    }
  }

  class Crab extends AquaticResident {
    constructor(number) {
      super(number, "crab", "小螃蟹", { minSize: 21, maxSize: 29, minY: .83, maxY: .87, minSpeed: 5, maxSpeed: 9, bottomDweller: true });
      this.y = state.height * random(.84, .885);
    }
    update(dt, time) {
      if (!this.isAttacked()) {
        this.x += this.direction * (this.speed + this.flee * 40) * dt;
        if (this.x < this.size * 2 || this.x > state.width - this.size * 2) this.direction *= -1;
        this.y = state.height * .865 + Math.sin(time * .002 + this.phase) * 2;
        this.flee = Math.max(0, this.flee - dt);
      }
      this.draw(time);
    }
    draw(time) {
      const s = this.size * this.depth;
      const step = Math.sin(time * .012 + this.phase) * s * .11;
      ctx.save(); ctx.translate(this.x, this.y); ctx.scale(this.direction, 1);
      ctx.strokeStyle = "rgba(145,68,53,.92)"; ctx.lineWidth = 2.2; ctx.lineCap = "round";
      for (let side = -1; side <= 1; side += 2) for (let i = 0; i < 3; i++) {
        const ox = side * (s * (.22 + i * .17));
        ctx.beginPath(); ctx.moveTo(ox, s * .12); ctx.lineTo(side * (s * (.55 + i * .13)), s * (.36 + (i % 2 ? -step : step) / s)); ctx.lineTo(side * (s * (.68 + i * .11)), s * .47); ctx.stroke();
      }
      const shell = ctx.createRadialGradient(-s * .18, -s * .22, 1, 0, 0, s);
      shell.addColorStop(0, "#d27a59"); shell.addColorStop(.5, "#9f4d40"); shell.addColorStop(1, "#512d2f");
      ctx.fillStyle = shell; ctx.beginPath(); ctx.ellipse(0, 0, s * .72, s * .43, 0, Math.PI, TAU); ctx.lineTo(s * .57, s * .2); ctx.quadraticCurveTo(0, s * .48, -s * .57, s * .2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(238,145,105,.75)";
      for (let side = -1; side <= 1; side += 2) {
        ctx.beginPath(); ctx.moveTo(side * s * .56, -s * .04); ctx.quadraticCurveTo(side * s * .95, -s * .5, side * s * 1.12, -s * .15); ctx.quadraticCurveTo(side * s * .91, -s * .03, side * s * .72, s * .12); ctx.fill();
        ctx.strokeStyle = "rgba(97,49,43,.9)"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(side * s * .28, -s * .3); ctx.lineTo(side * s * .32, -s * .55); ctx.stroke();
        ctx.fillStyle = "#111918"; ctx.beginPath(); ctx.arc(side * s * .32, -s * .58, 2.15, 0, TAU); ctx.fill();
      }
      ctx.restore(); drawNumberTag(this, s * .9);
    }
  }

  class Seahorse extends AquaticResident {
    constructor(number) { super(number, "seahorse", "小海馬", { minSize: 24, maxSize: 32, minY: .22, maxY: .72, minSpeed: 3, maxSpeed: 7 }); }
    update(dt, time) { this.patrol(dt, time, .18, .74, 7); this.draw(time); }
    draw(time) {
      const s = this.size * this.depth;
      const fin = Math.sin(time * .025 + this.phase);
      ctx.save(); ctx.translate(this.x, this.y); ctx.scale(this.direction, 1);
      ctx.strokeStyle = "rgba(185,145,73,.92)"; ctx.lineWidth = s * .22; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(s * .08, -s * .56); ctx.bezierCurveTo(-s * .28, -s * .22, s * .18, s * .05, -s * .08, s * .45); ctx.bezierCurveTo(-s * .28, s * .78, -s * .02, s * .92, s * .18, s * .72); ctx.stroke();
      ctx.strokeStyle = "rgba(232,191,103,.55)"; ctx.lineWidth = s * .1; ctx.beginPath(); ctx.moveTo(s * .06, -s * .54); ctx.bezierCurveTo(-s * .18, -s * .2, s * .18, .02 * s, -.06 * s, s * .42); ctx.stroke();
      ctx.fillStyle = "#b88742"; ctx.beginPath(); ctx.ellipse(s * .1, -s * .62, s * .32, s * .26, -.22, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(s * .27, -s * .68); ctx.quadraticCurveTo(s * .68, -s * .75, s * .72, -s * .59); ctx.quadraticCurveTo(s * .47, -s * .52, s * .24, -s * .55); ctx.fill();
      ctx.fillStyle = "rgba(110,125,72,.42)"; ctx.beginPath(); ctx.moveTo(-s * .09, -s * .2); ctx.quadraticCurveTo(-s * (.58 + fin * .06), 0, -s * .08, s * .22); ctx.fill();
      ctx.strokeStyle = "rgba(86,75,42,.55)"; ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-s * .02, -s * (.43 - i * .16)); ctx.lineTo(-s * .18, -s * (.37 - i * .16)); ctx.stroke(); }
      ctx.fillStyle = "#111817"; ctx.beginPath(); ctx.arc(s * .22, -s * .69, 2, 0, TAU); ctx.fill();
      ctx.restore(); drawNumberTag(this, s * 1.18);
    }
  }

  class Cuttlefish extends AquaticResident {
    constructor(number) { super(number, "cuttlefish", "小花枝", { minSize: 24, maxSize: 34, minY: .2, maxY: .7, minSpeed: 7, maxSpeed: 13 }); }
    update(dt, time) { this.patrol(dt, time, .18, .73, 3); this.draw(time); }
    draw(time) {
      const s = this.size * this.depth;
      const pulse = Math.sin(time * .009 + this.phase);
      ctx.save(); ctx.translate(this.x, this.y); ctx.scale(this.direction, 1);
      const mantle = ctx.createRadialGradient(-s * .2, -s * .25, 1, 0, 0, s);
      mantle.addColorStop(0, "rgba(197,169,151,.92)"); mantle.addColorStop(.5, "rgba(112,84,89,.9)"); mantle.addColorStop(1, "rgba(51,48,61,.94)");
      ctx.fillStyle = mantle; ctx.beginPath(); ctx.ellipse(-s * .08, 0, s * .82, s * (.45 + pulse * .025), 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(177,145,137,.48)"; ctx.beginPath();
      ctx.moveTo(-s * .8, 0); ctx.quadraticCurveTo(-s * .2, -s * (.72 + pulse * .05), s * .65, -s * .2); ctx.quadraticCurveTo(-s * .1, -s * .48, -s * .8, 0); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-s * .8, 0); ctx.quadraticCurveTo(-s * .1, s * (.7 + pulse * .05), s * .65, s * .2); ctx.quadraticCurveTo(-s * .2, s * .44, -s * .8, 0); ctx.fill();
      ctx.fillStyle = "rgba(218,184,159,.36)";
      for (let i = 0; i < 10; i++) { const a = i * 2.21 + this.phase; ctx.beginPath(); ctx.arc(Math.cos(a) * s * .52, Math.sin(a) * s * .28, 1.3 + (i % 2), 0, TAU); ctx.fill(); }
      ctx.strokeStyle = "rgba(126,91,91,.78)"; ctx.lineWidth = 1.5;
      for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(s * .65, (i - 2.5) * s * .055); ctx.quadraticCurveTo(s * (1 + pulse * .05), (i - 2.5) * s * .13, s * (1.18 + (i % 2) * .12), (i - 2.5) * s * .16); ctx.stroke(); }
      ctx.fillStyle = "#111817"; ctx.beginPath(); ctx.arc(s * .48, -s * .13, 2.4, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(214,224,196,.65)"; ctx.beginPath(); ctx.arc(s * .49, -s * .14, .8, 0, TAU); ctx.fill();
      ctx.restore(); drawNumberTag(this, s * .86);
    }
  }

  class SeaCucumber extends AquaticResident {
    constructor(number) {
      super(number, "cucumber", "小海蔘", { minSize: 24, maxSize: 34, minY: .85, maxY: .89, minSpeed: 1.3, maxSpeed: 2.5, bottomDweller: true });
      this.y = state.height * random(.875, .9);
    }
    update(dt, time) {
      if (!this.isAttacked()) {
        this.x += this.direction * (this.speed + this.flee * 18) * dt;
        if (this.x < this.size * 2 || this.x > state.width - this.size * 2) this.direction *= -1;
        this.y = state.height * .885;
        this.flee = Math.max(0, this.flee - dt);
      }
      this.draw(time);
    }
    draw(time) {
      const s = this.size * this.depth;
      const breathe = Math.sin(time * .004 + this.phase);
      ctx.save(); ctx.translate(this.x, this.y); ctx.scale(this.direction * (1 - breathe * .035), 1 + breathe * .07);
      const skin = ctx.createLinearGradient(0, -s * .4, 0, s * .4);
      skin.addColorStop(0, "#8c7250"); skin.addColorStop(.55, "#564d38"); skin.addColorStop(1, "#2e332b");
      ctx.fillStyle = skin; ctx.beginPath(); ctx.moveTo(-s * .95, 0); ctx.bezierCurveTo(-s * .7, -s * .46, s * .65, -s * .42, s * .96, -.05 * s); ctx.bezierCurveTo(s * .72, s * .36, -s * .7, s * .4, -s * .95, 0); ctx.fill();
      ctx.fillStyle = "rgba(190,159,103,.35)";
      for (let i = 0; i < 11; i++) { const x = -s * .75 + i * s * .15; ctx.beginPath(); ctx.arc(x, -s * (.18 + (i % 3) * .035), 1.3, 0, TAU); ctx.fill(); }
      ctx.strokeStyle = "rgba(130,105,68,.7)"; ctx.lineWidth = 1.2;
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(s * .86, -s * .05); ctx.quadraticCurveTo(s * (1.08 + i * .03), -s * (.3 - i * .13), s * (1.16 + i * .025), -s * (.45 - i * .18)); ctx.stroke(); }
      ctx.restore(); drawNumberTag(this, s * .68);
    }
  }

  class Urchin extends AquaticResident {
    constructor(number) {
      super(number, "urchin", "小海膽", { minSize: 19, maxSize: 26, minY: .46, maxY: .8, minSpeed: 3.2, maxSpeed: 6.5 });
      this.y = state.height * random(.5, .78);
      this.rotation = random(0, TAU);
    }
    update(dt, time) {
      if (!this.isAttacked()) {
        this.patrol(dt, time, .42, .81, 7.5);
        this.rotation += this.direction * dt * (.18 + this.speed * .018);
      }
      this.draw(time);
    }
    draw(time) {
      const s = this.size * this.depth;
      ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rotation);
      ctx.strokeStyle = "rgba(67,54,70,.92)"; ctx.lineWidth = 1.15;
      for (let i = 0; i < 28; i++) {
        const a = i / 28 * TAU;
        const sway = Math.sin(time * .0028 + this.phase + i * .8) * .06;
        const length = s * (.78 + (i % 4) * .08);
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * s * .24, Math.sin(a) * s * .24); ctx.lineTo(Math.cos(a + sway) * length, Math.sin(a + sway) * length); ctx.stroke();
      }
      const core = ctx.createRadialGradient(-s * .15, -s * .18, 1, 0, 0, s * .62);
      core.addColorStop(0, "#68536b"); core.addColorStop(.5, "#3d3445"); core.addColorStop(1, "#211f2c");
      ctx.fillStyle = core; ctx.beginPath(); ctx.arc(0, 0, s * .5, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(130,174,153,.42)";
      for (let i = 0; i < 8; i++) { const a = i * 2.4; ctx.beginPath(); ctx.arc(Math.cos(a) * s * .32, Math.sin(a) * s * .32, 1.15, 0, TAU); ctx.fill(); }
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = "rgba(146, 205, 184, .32)";
      ctx.lineWidth = .8;
      for (let i = 0; i < 4; i++) {
        const paddle = Math.sin(time * .006 + this.phase + i * 1.5) * 5;
        ctx.beginPath();
        ctx.moveTo(this.x - this.direction * s * .2, this.y + (i - 1.5) * s * .13);
        ctx.quadraticCurveTo(this.x - this.direction * s * .75, this.y + (i - 1.5) * s * .14 + paddle, this.x - this.direction * s, this.y + (i - 1.5) * s * .08);
        ctx.stroke();
      }
      ctx.restore();
      drawNumberTag(this, s * 1.15);
    }
  }

  function resize() {
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    canvas.width = Math.round(state.width * state.dpr);
    canvas.height = Math.round(state.height * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    buildPlants();
  }

  function buildPlants() {
    const count = Math.ceil(state.width / 105);
    state.plants = Array.from({ length: count }, (_, i) => ({
      x: (i + random(-.25, .25)) * (state.width / Math.max(1, count - 1)),
      phase: random(0, TAU),
      hue: random(102, 132),
      type: Math.random() < .68 ? "ribbon" : "fern",
      blades: Array.from({ length: Math.floor(random(3, 7)) }, (_, blade) => ({
        offset: random(-21, 21),
        height: random(state.height * .1, state.height * .28) * (1 - Math.abs(blade - 2) * .035),
        width: random(5, 13),
        bend: random(-.7, .7),
        phase: random(-.8, .8)
      }))
    }));

    const kelpCount = Math.max(5, Math.ceil(state.width / 260));
    state.kelp = Array.from({ length: kelpCount }, (_, i) => ({
      x: (i + .35 + random(-.18, .18)) * (state.width / kelpCount),
      height: random(state.height * .32, state.height * .62),
      width: random(13, 24),
      phase: random(0, TAU),
      lean: random(-26, 26),
      hue: random(78, 104),
      blades: Math.floor(random(3, 6))
    }));

    state.shellMounds = [
      { x: state.width * .22, width: Math.min(190, state.width * .22), height: random(32, 54), phase: .7 },
      { x: state.width * .78, width: Math.min(160, state.width * .19), height: random(28, 48), phase: 2.4 }
    ];

    state.rockFormation = {
      x: state.width * (state.width < 720 ? .22 : .27),
      y: state.height * (state.width < 720 ? .78 : .91),
      size: clamp(state.width * .095, 72, 138)
    };
  }

  function drawWater(time) {
    const gradient = ctx.createLinearGradient(0, 0, 0, state.height);
    gradient.addColorStop(0, "#0b4d50");
    gradient.addColorStop(.2, "#083f43");
    gradient.addColorStop(.68, "#052d33");
    gradient.addColorStop(1, "#031c22");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, state.width, state.height);

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = .13;
    ctx.strokeStyle = "rgba(205, 229, 218, .22)";
    for (let i = 0; i < 7; i++) {
      const bandY = 24 + i * 19;
      const drift = Math.sin(time * .00018 + i * 1.17) * 38;
      ctx.lineWidth = .7 + (i % 3) * .45;
      ctx.beginPath();
      ctx.moveTo(-80, bandY + drift * .12);
      for (let x = -80; x <= state.width + 100; x += 80) {
        ctx.quadraticCurveTo(x + 40, bandY + Math.sin(x * .012 + time * .00035 + i) * 10, x + 80, bandY);
      }
      ctx.stroke();
    }
    ctx.restore();

    const depthHaze = ctx.createLinearGradient(0, state.height * .35, 0, state.height * .82);
    depthHaze.addColorStop(0, "rgba(6, 38, 43, 0)");
    depthHaze.addColorStop(.72, "rgba(2, 24, 29, .08)");
    depthHaze.addColorStop(1, "rgba(1, 18, 22, .24)");
    ctx.fillStyle = depthHaze;
    ctx.fillRect(0, state.height * .32, state.width, state.height * .55);

    state.particles.forEach((p) => {
      p.x += Math.sin(time * .0002 + p.phase) * .012;
      p.y -= p.speed;
      if (p.y < 0) p.y = 1;
      ctx.fillStyle = p.r > .7 ? "rgba(205, 225, 216, .045)" : "rgba(178, 203, 195, .028)";
      ctx.beginPath();
      ctx.arc(p.x * state.width, p.y * state.height, p.r, 0, TAU);
      ctx.fill();
    });
  }

  function drawKelp(time) {
    const floorY = state.height * .9;
    state.kelp.forEach((kelp, kelpIndex) => {
      for (let bladeIndex = 0; bladeIndex < kelp.blades; bladeIndex++) {
        const offset = (bladeIndex - (kelp.blades - 1) / 2) * kelp.width * .65;
        const bladeHeight = kelp.height * (1 - Math.abs(bladeIndex - 2) * .055) * (.94 + (bladeIndex % 3) * .025);
        const wave = Math.sin(time * .00052 + kelp.phase + bladeIndex * .7) * 24 + kelp.lean;
        const baseX = kelp.x + offset;
        const tipX = baseX + wave;
        const half = kelp.width * (bladeIndex % 2 ? .34 : .46);
        const ribbon = new Path2D();
        ribbon.moveTo(baseX - half, floorY);
        ribbon.bezierCurveTo(baseX - half * .5, floorY - bladeHeight * .3, baseX + wave * .72 - half, floorY - bladeHeight * .68, tipX, floorY - bladeHeight);
        ribbon.bezierCurveTo(baseX + wave * .65 + half, floorY - bladeHeight * .68, baseX + half * .55, floorY - bladeHeight * .28, baseX + half, floorY);
        ribbon.closePath();
        const kelpGradient = ctx.createLinearGradient(baseX - half, 0, baseX + half, 0);
        kelpGradient.addColorStop(0, `hsla(${kelp.hue - 10},43%,17%,.2)`);
        kelpGradient.addColorStop(.38, `hsla(${kelp.hue},48%,31%,.5)`);
        kelpGradient.addColorStop(.7, `hsla(${kelp.hue + 8},53%,42%,.36)`);
        kelpGradient.addColorStop(1, `hsla(${kelp.hue - 8},38%,17%,.13)`);
        ctx.fillStyle = kelpGradient;
        ctx.fill(ribbon);
        ctx.strokeStyle = `hsla(${kelp.hue + 18},52%,64%,.1)`;
        ctx.lineWidth = .8;
        ctx.beginPath();
        ctx.moveTo(baseX, floorY);
        ctx.bezierCurveTo(baseX, floorY - bladeHeight * .28, baseX + wave * .67, floorY - bladeHeight * .7, tipX, floorY - bladeHeight + 2);
        ctx.stroke();

        if ((bladeIndex + kelpIndex) % 2 === 0) {
          for (let node = .28; node < .78; node += .24) {
            const nx = lerp(baseX, tipX, node) + Math.sin(node * 8 + kelp.phase) * 4;
            const ny = floorY - bladeHeight * node;
            ctx.fillStyle = `hsla(${kelp.hue + 5},48%,42%,.34)`;
            ctx.beginPath();
            ctx.ellipse(nx + half * .75, ny, half * .28, half * .2, -.3, 0, TAU);
            ctx.fill();
          }
        }
      }
    });
  }

  function drawRockFormation() {
    const formation = state.rockFormation;
    if (!formation) return;
    const { x, y, size } = formation;
    const rocks = [
      { dx: -.62, dy: -.05, sx: .75, sy: .44, rotation: -.08, light: 0 },
      { dx: .53, dy: -.04, sx: .72, sy: .4, rotation: .09, light: -5 },
      { dx: -.18, dy: -.36, sx: .78, sy: .72, rotation: -.04, light: 5 },
      { dx: .34, dy: -.42, sx: .58, sy: .68, rotation: .08, light: -2 },
      { dx: .02, dy: -.78, sx: .42, sy: .55, rotation: -.03, light: 8 }
    ];

    ctx.save();
    ctx.globalAlpha = .28;
    ctx.fillStyle = "#001416";
    ctx.beginPath();
    ctx.ellipse(x, y + size * .08, size * 1.25, size * .16, 0, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;

    rocks.forEach((rock, index) => {
      const rx = x + rock.dx * size;
      const ry = y + rock.dy * size;
      const rw = size * rock.sx;
      const rh = size * rock.sy;
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(rock.rotation);
      const rockPath = new Path2D();
      rockPath.moveTo(-rw, rh * .26);
      rockPath.bezierCurveTo(-rw * .92, -rh * .35, -rw * .48, -rh * .98, -rw * .08, -rh);
      rockPath.bezierCurveTo(rw * .38, -rh * .9, rw * .95, -rh * .36, rw, rh * .18);
      rockPath.bezierCurveTo(rw * .58, rh * .58, -rw * .42, rh * .62, -rw, rh * .26);
      const rockGradient = ctx.createLinearGradient(-rw, -rh, rw, rh);
      rockGradient.addColorStop(0, `hsl(151, 12%, ${39 + rock.light}%)`);
      rockGradient.addColorStop(.38, `hsl(157, 13%, ${28 + rock.light}%)`);
      rockGradient.addColorStop(.72, `hsl(164, 16%, ${20 + rock.light * .5}%)`);
      rockGradient.addColorStop(1, "hsl(169, 19%, 13%)");
      ctx.fillStyle = rockGradient;
      ctx.fill(rockPath);

      ctx.save();
      ctx.clip(rockPath);
      ctx.fillStyle = "rgba(216,224,202,.045)";
      for (let grain = 0; grain < 24; grain++) {
        const gx = -rw + ((grain * 37 + index * 19) % Math.max(1, Math.floor(rw * 2)));
        const gy = -rh + ((grain * 23 + index * 11) % Math.max(1, Math.floor(rh * 1.6)));
        ctx.beginPath();
        ctx.arc(gx, gy, .5 + (grain % 3) * .35, 0, TAU);
        ctx.fill();
      }
      ctx.restore();

      ctx.strokeStyle = "rgba(7,27,27,.58)";
      ctx.lineWidth = Math.max(.8, size * .008);
      ctx.beginPath();
      ctx.moveTo(-rw * .2, -rh * .82);
      ctx.lineTo(-rw * .03, -rh * .32);
      ctx.lineTo(-rw * .25, rh * .02);
      ctx.lineTo(-rw * .1, rh * .34);
      ctx.moveTo(rw * .38, -rh * .55);
      ctx.lineTo(rw * .22, -rh * .12);
      ctx.stroke();

      if (index === 2 || index === 4) {
        ctx.fillStyle = "rgba(58,91,55,.42)";
        ctx.beginPath();
        ctx.ellipse(-rw * .34, -rh * .62, rw * .28, rh * .1, -.2, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    });

    ctx.fillStyle = "rgba(1,17,19,.78)";
    ctx.beginPath();
    ctx.ellipse(x + size * .02, y - size * .18, size * .22, size * .13, -.08, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(170,190,171,.09)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function drawFloor(time) {
    const y = state.height * .84;
    const bed = ctx.createLinearGradient(0, y, 0, state.height);
    bed.addColorStop(0, "rgba(178, 164, 126, .18)");
    bed.addColorStop(.18, "#81775e");
    bed.addColorStop(.62, "#625f4d");
    bed.addColorStop(1, "#3c463e");
    ctx.fillStyle = bed;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= state.width; x += 50) ctx.lineTo(x, y + Math.sin(x * .018) * 9 + Math.sin(x * .006) * 7);
    ctx.lineTo(state.width, state.height);
    ctx.lineTo(0, state.height);
    ctx.fill();

    ctx.strokeStyle = "rgba(224, 211, 174, .09)";
    ctx.lineWidth = 1;
    for (let ripple = 0; ripple < 7; ripple++) {
      const rippleY = y + 17 + ripple * 14;
      ctx.beginPath();
      ctx.moveTo(-30, rippleY);
      for (let x = -30; x <= state.width + 30; x += 42) {
        ctx.quadraticCurveTo(x + 21, rippleY + Math.sin(x * .03 + ripple) * 3, x + 42, rippleY);
      }
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(229, 211, 170, .18)";
    for (let grain = 0; grain < 280; grain++) {
      const gx = (grain * 67.31) % state.width;
      const gy = y + 5 + ((grain * 29.73) % Math.max(8, state.height - y - 3));
      const gr = .25 + (grain % 5) * .12;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, TAU);
      ctx.fill();
    }

    drawRockFormation();

    state.plants.forEach((p) => {
      const baseY = state.height * .91 + Math.sin(p.x * .018) * 8;
      p.blades.forEach((blade, index) => {
        const sway = Math.sin(time * .00072 + p.phase + blade.phase) * 18 + blade.bend * 18;
        const bx = p.x + blade.offset;
        const tipX = bx + sway;
        const shoulderX = bx + sway * .42;
        const half = blade.width * .5;
        const leaf = new Path2D();
        leaf.moveTo(bx - half, baseY);
        leaf.bezierCurveTo(bx - half * .7, baseY - blade.height * .35, shoulderX - half * .45, baseY - blade.height * .72, tipX, baseY - blade.height);
        leaf.bezierCurveTo(shoulderX + half * .35, baseY - blade.height * .7, bx + half * .75, baseY - blade.height * .3, bx + half, baseY);
        leaf.closePath();
        const leafGradient = ctx.createLinearGradient(bx - half, 0, bx + half, 0);
        const lightness = p.type === "fern" ? 30 : 26;
        leafGradient.addColorStop(0, `hsla(${p.hue - 7},42%,${lightness - 8}%,.32)`);
        leafGradient.addColorStop(.46, `hsla(${p.hue},46%,${lightness + 8}%,.7)`);
        leafGradient.addColorStop(.72, `hsla(${p.hue + 8},36%,${lightness + 3}%,.48)`);
        leafGradient.addColorStop(1, `hsla(${p.hue - 4},40%,${lightness - 10}%,.2)`);
        ctx.fillStyle = leafGradient;
        ctx.fill(leaf);
        ctx.strokeStyle = `hsla(${p.hue + 20},48%,68%,.16)`;
        ctx.lineWidth = .7;
        ctx.beginPath();
        ctx.moveTo(bx, baseY - 2);
        ctx.bezierCurveTo(bx, baseY - blade.height * .32, shoulderX, baseY - blade.height * .7, tipX, baseY - blade.height + 3);
        ctx.stroke();
        if (p.type === "fern" && index % 2 === 0) {
          ctx.strokeStyle = `hsla(${p.hue + 10},35%,65%,.11)`;
          for (let vein = .3; vein < .85; vein += .18) {
            const vy = baseY - blade.height * vein;
            const vx = lerp(bx, tipX, vein * .9);
            ctx.beginPath();
            ctx.moveTo(vx, vy);
            ctx.lineTo(vx + half * (vein % .36 < .2 ? 1 : -1), vy - blade.height * .06);
            ctx.stroke();
          }
        }
      });
    });

    state.shellMounds.forEach((mound) => {
      const baseY = state.height * .925;
      const moundGradient = ctx.createRadialGradient(mound.x, baseY - mound.height * .45, 2, mound.x, baseY, mound.width * .58);
      moundGradient.addColorStop(0, "rgba(151,142,113,.36)");
      moundGradient.addColorStop(.55, "rgba(91,101,82,.38)");
      moundGradient.addColorStop(1, "rgba(31,58,52,.08)");
      ctx.fillStyle = moundGradient;
      ctx.beginPath();
      ctx.moveTo(mound.x - mound.width * .55, baseY);
      ctx.quadraticCurveTo(mound.x - mound.width * .34, baseY - mound.height * .8, mound.x, baseY - mound.height);
      ctx.quadraticCurveTo(mound.x + mound.width * .34, baseY - mound.height * .82, mound.x + mound.width * .56, baseY);
      ctx.fill();

      const shellCount = Math.max(10, Math.floor(mound.width / 10));
      for (let i = 0; i < shellCount; i++) {
        const t = (i + .5) / shellCount;
        const sx = mound.x + (t - .5) * mound.width * .9;
        const arc = 1 - Math.pow((t - .5) * 2, 2);
        const sy = baseY - arc * mound.height * .72 - (i % 3) * 5;
        const sr = 4 + (i % 4) * 1.4;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(Math.sin(i * 2.1 + mound.phase) * .65);
        const shellGradient = ctx.createLinearGradient(-sr, -sr, sr, sr);
        shellGradient.addColorStop(0, "rgba(221,205,166,.72)");
        shellGradient.addColorStop(.52, "rgba(151,126,94,.7)");
        shellGradient.addColorStop(1, "rgba(71,75,64,.55)");
        ctx.fillStyle = shellGradient;
        ctx.beginPath();
        ctx.moveTo(-sr, sr * .35);
        ctx.quadraticCurveTo(0, -sr * 1.15, sr, sr * .35);
        ctx.quadraticCurveTo(0, sr * .75, -sr, sr * .35);
        ctx.fill();
        ctx.strokeStyle = "rgba(240,226,190,.24)";
        ctx.lineWidth = .55;
        for (let ridge = -2; ridge <= 2; ridge++) {
          ctx.beginPath();
          ctx.moveTo(0, -sr * .7);
          ctx.lineTo(ridge * sr * .34, sr * .35);
          ctx.stroke();
        }
        ctx.restore();
      }
    });

    ctx.fillStyle = "rgba(73,82,68,.18)";
    for (let pebble = 0; pebble < 18; pebble++) {
      const px = (pebble * 91.7) % state.width;
      const pr = 1.2 + (pebble % 4) * .7;
      ctx.beginPath();
      ctx.ellipse(px, state.height * .9 + ((pebble * 17) % (state.height * .085)), pr * 1.35, pr * .55, .1, 0, TAU);
      ctx.fill();
    }
  }

  function drawShark(time) {
    const attack = state.sharkAttack;
    const attackProgress = attack ? clamp(attack.elapsed / attack.duration, 0, 1) : 0;
    const attackWake = attack ? Math.sin(Math.PI * clamp(attackProgress * 1.2, 0, 1)) : 0;
    const r = Math.max(state.sharkResponse, attackWake);
    const hunt = state.sharkHunt;
    const size = clamp(state.width * .085, 82, 132);
    const patrolPhase = time * .000055;
    const restingX = state.width * (.52 + Math.sin(patrolPhase) * .27);
    const baseY = state.height * (state.width < 720 ? .62 : .69)
      + Math.sin(time * .00011 + 1.3) * state.height * .045;
    const patrolFacing = Math.cos(patrolPhase) >= 0 ? 1 : -1;
    let x = restingX + hunt * state.width * .025;
    let y = baseY - r * size * .34 - hunt * size * .12;
    let angle = lerp(Math.sin(time * .00018) * .035, -.34, r) + Math.sin(time * .0008) * .018;
    let facing = patrolFacing;

    if (attack) {
      const smooth = (value) => value * value * (3 - 2 * value);
      const approach = attackProgress < .62
        ? smooth(attackProgress / .62)
        : smooth(1 - (attackProgress - .62) / .38);
      facing = attack.target.x < restingX ? -1 : 1;
      const targetAngle = Math.atan2(attack.target.y - baseY, attack.target.x - restingX)
        + (facing < 0 ? Math.PI : 0);
      // Resolve the shark's body position from the rotated mouth pocket so the
      // visible bite point—not the body centre—lands exactly on the koi.
      const mouthLocalX = facing * size * .96;
      const mouthLocalY = size * .17;
      const cos = Math.cos(targetAngle);
      const sin = Math.sin(targetAngle);
      const attackX = attack.target.x - (mouthLocalX * cos - mouthLocalY * sin);
      const attackY = attack.target.y - (mouthLocalX * sin + mouthLocalY * cos);
      x = lerp(restingX, attackX, approach);
      y = lerp(baseY, attackY, approach);
      angle = lerp(-.1, targetAngle, approach);
    }
    const breath = Math.sin(time * .0022) * 2 * (1 - r);

    ctx.save();
    ctx.translate(x, y + breath);
    ctx.rotate(angle);
    ctx.scale(facing, 1);

    const tailTempo = attack ? .0062 : .0026 + r * .0012;
    const tailBeat = Math.sin(time * tailTempo) * (attack ? .2 : .085 + r * .055);
    ctx.save();
    ctx.translate(-size * 1.01, 0);
    ctx.rotate(tailBeat);
    const tailSkin = ctx.createLinearGradient(-size * .55, -size * .5, 0, size * .45);
    tailSkin.addColorStop(0, "#4e6666");
    tailSkin.addColorStop(.48, "#364e50");
    tailSkin.addColorStop(1, "#233b3f");
    ctx.fillStyle = tailSkin;
    ctx.beginPath();
    ctx.moveTo(size * .04, 0);
    ctx.bezierCurveTo(-size * .18, -size * .05, -size * .42, -size * .53, -size * .67, -size * .77);
    ctx.bezierCurveTo(-size * .64, -size * .43, -size * .56, -size * .12, -size * .37, -.01 * size);
    ctx.bezierCurveTo(-size * .55, size * .07, -size * .61, size * .25, -size * .61, size * .37);
    ctx.bezierCurveTo(-size * .39, size * .3, -size * .18, size * .09, size * .04, 0);
    ctx.fill();
    ctx.strokeStyle = "rgba(190, 210, 202, .12)";
    ctx.lineWidth = .7;
    for (let ray = 0; ray < 5; ray++) {
      const spread = (ray - 2) * size * .09;
      ctx.beginPath();
      ctx.moveTo(-size * .08, 0);
      ctx.quadraticCurveTo(-size * .42, spread * .6, -size * (.67 + Math.abs(ray - 2) * .025), spread * 2.1);
      ctx.stroke();
    }
    ctx.restore();

    // The far pectoral fin is painted first so the body overlaps its root.
    ctx.fillStyle = "rgba(31, 52, 55, .68)";
    ctx.beginPath();
    ctx.moveTo(size * .34, size * .055);
    ctx.bezierCurveTo(size * .05, size * .24, -size * .25, size * .39, -size * .48, size * .38);
    ctx.bezierCurveTo(-size * .2, size * .18, size * .07, size * .08, size * .34, size * .055);
    ctx.closePath();
    ctx.fill();

    const sharkBody = new Path2D();
    sharkBody.moveTo(-size * 1.08, 0);
    sharkBody.bezierCurveTo(-size * .72, -size * .16, size * .04, -size * .34, size * .72, -size * .2);
    sharkBody.bezierCurveTo(size * 1.02, -size * .14, size * 1.24, -size * .065, size * 1.31, size * .006);
    sharkBody.quadraticCurveTo(size * 1.25, size * .105, size * 1.02, size * .17);
    sharkBody.bezierCurveTo(size * .52, size * .29, -size * .23, size * .22, -size * .72, size * .13);
    sharkBody.bezierCurveTo(-size * .89, size * .1, -size * 1.01, size * .04, -size * 1.08, 0);

    const skin = ctx.createLinearGradient(0, -size * .5, 0, size * .5);
    skin.addColorStop(0, "#536b6c");
    skin.addColorStop(.28, "#41595b");
    skin.addColorStop(.55, "#31494c");
    skin.addColorStop(.69, "#879894");
    skin.addColorStop(.83, "#a5aea7");
    skin.addColorStop(1, "#697d79");
    ctx.fillStyle = skin;
    ctx.fill(sharkBody);
    ctx.strokeStyle = "rgba(9, 25, 27, .42)";
    ctx.lineWidth = Math.max(.7, size * .007);
    ctx.stroke(sharkBody);

    ctx.save();
    ctx.clip(sharkBody);
    ctx.fillStyle = "rgba(8, 25, 28, .16)";
    ctx.beginPath();
    ctx.moveTo(-size * 1.1, -size * .03);
    ctx.bezierCurveTo(-size * .35, -size * .12, size * .3, -size * .09, size * 1.25, -size * .02);
    ctx.lineTo(size * 1.25, -size * .42);
    ctx.lineTo(-size * 1.1, -size * .42);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(214, 226, 218, .085)";
    ctx.lineWidth = .65;
    for (let i = 0; i < 74; i++) {
      const px = -size * .92 + ((i * 43) % Math.round(size * 2.05));
      const py = -size * .25 + ((i * 31) % Math.round(size * .43));
      const length = 1.8 + (i % 4) * .45;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - length, py + length * .32);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(10, 27, 29, .055)";
    for (let patch = 0; patch < 17; patch++) {
      const px = -size * .88 + ((patch * 61) % Math.round(size * 1.92));
      const py = -size * .19 + ((patch * 37) % Math.round(size * .34));
      ctx.beginPath();
      ctx.ellipse(px, py, size * (.035 + (patch % 4) * .012), size * (.012 + (patch % 3) * .006), (patch % 5 - 2) * .16, 0, TAU);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = "rgba(201, 222, 214, .035)";
    ctx.lineWidth = size * .025;
    for (let band = 0; band < 3; band++) {
      const shift = Math.sin(time * .00055 + band * 2.1) * size * .25;
      ctx.beginPath();
      ctx.moveTo(-size * 1.2 + shift + band * size * .72, -size * .46);
      ctx.quadraticCurveTo(-size * .7 + shift + band * size * .65, -size * .05, -size * .38 + shift + band * size * .7, size * .28);
      ctx.stroke();
    }
    ctx.restore();

    const dorsal = ctx.createLinearGradient(0, -size * .7, 0, -size * .2);
    dorsal.addColorStop(0, "#394f50");
    dorsal.addColorStop(1, "#2d4649");
    ctx.fillStyle = dorsal;
    ctx.beginPath();
    ctx.moveTo(-size * .2, -size * .24);
    ctx.bezierCurveTo(-size * .08, -size * .61, size * .02, -size * .75, size * .18, -size * .25);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(182, 202, 194, .09)";
    ctx.lineWidth = .7;
    ctx.stroke();

    ctx.fillStyle = "rgba(42, 65, 67, .84)";
    ctx.beginPath();
    ctx.moveTo(-size * .59, -size * .13);
    ctx.bezierCurveTo(-size * .53, -size * .29, -size * .44, -size * .36, -size * .31, -size * .14);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(54, 76, 75, .6)";
    ctx.beginPath();
    ctx.moveTo(-size * .5, size * .11);
    ctx.bezierCurveTo(-size * .57, size * .25, -size * .68, size * .31, -size * .72, size * .3);
    ctx.bezierCurveTo(-size * .56, size * .16, -size * .4, size * .12, -size * .3, size * .12);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(38, 63, 66, .88)";
    ctx.beginPath();
    ctx.moveTo(size * .18, size * .13);
    ctx.bezierCurveTo(-size * .02, size * .35, -size * .43, size * .43, -size * .67, size * .3);
    ctx.bezierCurveTo(-size * .37, size * .18, -size * .04, size * .14, size * .18, size * .13);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(196, 211, 204, .13)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-size * .72, -size * .02);
    ctx.bezierCurveTo(-size * .15, size * .02, size * .34, -.01 * size, size * .77, -size * .08);
    ctx.stroke();

    ctx.strokeStyle = "rgba(18, 39, 42, .72)";
    ctx.lineWidth = Math.max(.85, size * .009);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(size * (.55 - i * .052), -size * .005, size * (.13 + i * .004), -.62, .52);
      ctx.stroke();
    }

    const attackMouth = attack
      ? Math.sin(Math.PI * clamp((attackProgress - .16) / .64, 0, 1))
      : 0;
    const mouth = Math.max(clamp((r - .4) / .6, 0, 1), attackMouth);
    if (mouth < .04) {
      ctx.strokeStyle = "rgba(18, 31, 32, .78)";
      ctx.lineWidth = Math.max(.8, size * .008);
      ctx.beginPath();
      ctx.moveTo(size * .73, size * .1);
      ctx.quadraticCurveTo(size * .92, size * .13, size * 1.07, size * .035);
      ctx.stroke();
    } else {
      ctx.fillStyle = "rgba(25, 18, 18, .9)";
      const jaw = new Path2D();
      jaw.moveTo(size * .7, size * .09);
      jaw.quadraticCurveTo(size * .93, size * (.08 + mouth * .11), size * 1.08, size * .02);
      jaw.quadraticCurveTo(size * .94, size * (.17 + mouth * .14), size * .7, size * .09);
      ctx.fill(jaw);
    }
    if (mouth > .18) {
      ctx.fillStyle = "rgba(221, 222, 203, .78)";
      for (let i = 0; i < 5; i++) {
        const tx = size * (.75 + i * .056);
        ctx.beginPath();
        ctx.moveTo(tx, size * .085);
        ctx.lineTo(tx + size * .014, size * (.115 + mouth * .04));
        ctx.lineTo(tx + size * .027, size * .082);
        ctx.fill();
      }
    }

    ctx.fillStyle = "rgba(8, 17, 18, .66)";
    ctx.beginPath();
    ctx.ellipse(size * 1.03, -size * .035, size * .011, size * .006, -.15, 0, TAU);
    ctx.fill();

    const eyeOpen = .48 + r * .52;
    ctx.fillStyle = "rgba(5, 13, 14, .94)";
    ctx.beginPath();
    ctx.ellipse(size * .76, -size * .145, size * .026, size * .017 * eyeOpen, -.08, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(12, 28, 29, .72)";
    ctx.lineWidth = Math.max(.65, size * .006);
    ctx.beginPath();
    ctx.moveTo(size * .71, -size * .158);
    ctx.quadraticCurveTo(size * .76, -size * (.18 + r * .012), size * .815, -size * .153);
    ctx.stroke();
    if (r > .2) {
      ctx.fillStyle = "rgba(198, 214, 205, .42)";
      ctx.beginPath();
      ctx.arc(size * .767, -size * .151, size * .0055, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function measureSound() {
    if (!state.analyser || !state.audioData) return;
    state.analyser.getFloatTimeDomainData(state.audioData);
    let sum = 0;
    for (const sample of state.audioData) sum += sample * sample;
    const rms = Math.sqrt(sum / state.audioData.length);
    const dbfs = 20 * Math.log10(rms + 1e-7);
    state.targetDb = clamp(95 + dbfs + state.micOffset, 30, 100);
  }

  function updateBehavior(dt, now) {
    const dbBlend = state.targetDb > state.displayDb
      ? 1 - Math.pow(.68, dt * 60)
      : 1 - Math.pow(.93, dt * 60);
    state.displayDb = lerp(state.displayDb, state.targetDb, dbBlend);
    const quiet = state.running && state.displayDb < state.threshold;
    const wakeStart = state.threshold - 3;
    const responseTarget = state.running ? clamp((state.displayDb - wakeStart) / 17, 0, 1) : 0;
    state.sharkResponse = lerp(state.sharkResponse, responseTarget, 1 - Math.pow(.08, dt));

    if (quiet) {
      state.quietSeconds += dt;
      state.loudSeconds = Math.max(0, state.loudSeconds - dt * 2);
    } else if (state.running) {
      state.quietSeconds = Math.max(0, state.quietSeconds - dt * .22);
      if (state.sharkResponse > .76) state.loudSeconds += dt;
      else state.loudSeconds = Math.max(0, state.loudSeconds - dt);
    }

    if (state.quietSeconds >= QUIET_GOAL) {
      state.quietSeconds -= QUIET_GOAL;
      spawnCreature(false);
    }

    if (state.loudSeconds > 1.35 && now > state.nextHuntAllowed && state.creatures.length && !state.sharkAttack) {
      eatRandomCreature();
      state.loudSeconds = 0;
      state.nextHuntAllowed = now + 9000;
    }

    if (state.sharkAttack) {
      const attack = state.sharkAttack;
      attack.elapsed += dt;
      const progress = attack.elapsed / attack.duration;
      attack.target.speed = 1;
      attack.target.turnTimer = 99;
      if (progress >= .62 && !attack.captured) {
        const targetIndex = state.creatures.indexOf(attack.target);
        if (targetIndex >= 0) state.creatures.splice(targetIndex, 1);
        attack.captured = true;
        showToast(`鯊魚咬住了${attack.target.name} #${attack.target.number}`);
      }
      if (progress >= 1) {
        state.sharkAttack = null;
        state.sharkHunt = 0;
      } else {
        state.sharkHunt = 1;
      }
    } else {
      state.sharkHunt = Math.max(0, state.sharkHunt - dt * .8);
    }
  }

  function updateUI() {
    const display = Math.round(state.displayDb);
    ui.dbValue.textContent = state.running ? display : "—";
    const quiet = state.running && display < state.threshold;
    const wakeDb = state.threshold - 3;
    const angryDb = state.threshold + 4;
    const attackDb = state.threshold + 10;
    const loud = state.running && display >= attackDb;
    ui.wakeDb.textContent = `${wakeDb} dB`;
    ui.angryDb.textContent = `${angryDb} dB`;
    ui.attackDb.textContent = `${attackDb} dB`;
    const color = !state.running || display < wakeDb
      ? "138,185,167"
      : display < attackDb ? "208,170,112" : "213,107,89";
    const level = state.running ? clamp((display - 30) / 70, 0, 1) : 0;
    ui.dbMeterFill.style.width = `${level * 100}%`;
    ui.dbMeterFill.style.backgroundColor = `rgb(${color})`;
    ui.orbRing.style.borderColor = `rgba(${color},${.28 + level * .38})`;

    const remaining = Math.max(0, Math.ceil(QUIET_GOAL - state.quietSeconds));
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    ui.countdown.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    const progress = clamp(state.quietSeconds / QUIET_GOAL, 0, 1);
    ui.progressFill.style.width = `${progress * 100}%`;
    ui.progressBar.setAttribute("aria-valuenow", String(Math.round(state.quietSeconds)));
    ui.fishCount.textContent = String(state.creatures.length);
    ui.quietMessage.textContent = !state.running
      ? "水面正在等你安靜下來。"
      : quiet
        ? progress > .75 ? "下一位小住客快到了。" : "安靜正在水裡慢慢累積。"
        : "計時放慢了；安靜下來就會繼續。";
  }

  function getNextNumber() {
    const activeNumbers = new Set(state.creatures.map((creature) => creature.number));
    let available = Array.from({ length: 50 }, (_, index) => index + 1)
      .filter((number) => !state.usedNumbers.has(number) && !activeNumbers.has(number));
    if (!available.length) {
      state.usedNumbers = new Set(activeNumbers);
      available = Array.from({ length: 50 }, (_, index) => index + 1)
        .filter((number) => !activeNumbers.has(number));
    }
    if (!available.length) return null;
    const number = available[Math.floor(Math.random() * available.length)];
    state.usedNumbers.add(number);
    return number;
  }

  const creatureTypes = [
    { type: "koi", name: "小錦鯉", create: (number) => new Koi(number) },
    { type: "shrimp", name: "小蝦", create: (number) => new Shrimp(number) },
    { type: "crab", name: "小螃蟹", create: (number) => new Crab(number) },
    { type: "seahorse", name: "小海馬", create: (number) => new Seahorse(number) },
    { type: "cuttlefish", name: "小花枝", create: (number) => new Cuttlefish(number) },
    { type: "cucumber", name: "小海蔘", create: (number) => new SeaCucumber(number) },
    { type: "urchin", name: "小海膽", create: (number) => new Urchin(number) }
  ];

  function spawnCreature(test = false, announce = true, forcedType = null) {
    const number = getNextNumber();
    if (number === null) {
      if (announce) showToast("海底世界已有 50 位住客");
      return null;
    }
    const species = creatureTypes.find((item) => item.type === forcedType)
      || creatureTypes[Math.floor(Math.random() * creatureTypes.length)];
    const creature = species.create(number);
    state.creatures.push(creature);
    state.creatures.forEach((resident) => resident.flee = .4);
    if (announce) showToast(test ? `${species.name} #${number} 已入水` : `一分鐘安靜，${species.name} #${number} 搬進來了`);
    return creature;
  }

  function eatRandomCreature() {
    const index = Math.floor(Math.random() * state.creatures.length);
    beginSharkAttack(state.creatures[index], false);
  }

  function beginSharkAttack(target, demo) {
    if (!target || state.sharkAttack) return;
    state.sharkAttack = {
      target,
      elapsed: 0,
      duration: 3.6,
      captured: false,
      demo
    };
    state.sharkHunt = 1;
    state.sharkResponse = Math.max(state.sharkResponse, .55);
    showToast(demo ? "演示開始：鯊魚被聲音驚醒" : `太吵了，鯊魚鎖定了${target.name} #${target.number}`);
  }

  function demoSharkAttack() {
    if (state.sharkAttack) {
      showToast("鯊魚正在攻擊，請看魚缸");
      return;
    }
    let target = state.creatures.find((creature) => !creature.bottomDweller);
    if (!target) {
      target = spawnCreature(false, false, "koi");
    }
    if (!target) return;
    target.x = state.width * .34;
    target.y = state.height * .43;
    target.direction = 1;
    target.speed = 1;
    target.turnTimer = 99;
    target.flee = 0;
    target.born = performance.now() - 1200;
    beginSharkAttack(target, true);
  }

  function showToast(message) {
    clearTimeout(state.toastTimer);
    ui.toast.textContent = message;
    ui.toast.classList.add("is-visible");
    state.toastTimer = setTimeout(() => ui.toast.classList.remove("is-visible"), 3200);
  }

  async function startListening() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        video: false
      });
      state.stream = stream;
      state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await state.audioContext.resume();
      const source = state.audioContext.createMediaStreamSource(stream);
      state.analyser = state.audioContext.createAnalyser();
      state.analyser.fftSize = 1024;
      state.analyser.smoothingTimeConstant = .35;
      state.audioData = new Float32Array(state.analyser.fftSize);
      source.connect(state.analyser);
      state.running = true;
      ui.listenButton.classList.add("is-listening");
      ui.listenLabel.textContent = "正在聆聽";
      showToast("聆聽已開始，聲音不會離開這台裝置");
    } catch (error) {
      console.warn("Microphone unavailable", error);
      showToast("無法使用麥克風，請在瀏覽器設定中允許權限");
    }
  }

  function stopListening() {
    state.stream?.getTracks().forEach((track) => track.stop());
    state.audioContext?.close();
    state.stream = null;
    state.audioContext = null;
    state.analyser = null;
    state.audioData = null;
    state.running = false;
    state.targetDb = 30;
    ui.listenButton.classList.remove("is-listening");
    ui.listenLabel.textContent = "開始聆聽";
    showToast("聆聽已暫停");
  }

  function readTimerMinutes() {
    const minutes = clamp(Math.round(Number(ui.timerMinutes.value) || 1), 1, 100);
    ui.timerMinutes.value = String(minutes);
    return minutes;
  }

  function formatExamTime(seconds) {
    const rounded = Math.max(0, Math.ceil(seconds));
    const minutes = Math.floor(rounded / 60);
    const remainder = rounded % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  }

  function renderExamTimer(force = false) {
    const second = Math.max(0, Math.ceil(state.examTimer.remainingSeconds));
    if (!force && second === state.examTimer.renderedSecond) return;
    state.examTimer.renderedSecond = second;
    ui.timerValue.textContent = formatExamTime(second);
    ui.timerToggleButton.setAttribute("aria-label", state.examTimer.running ? "暫停倒數" : "開始倒數");
    ui.timerToggleButton.title = state.examTimer.running ? "暫停倒數" : "開始倒數";
    ui.timerMinutes.disabled = state.examTimer.running;
    ui.dropTimer.classList.toggle("is-running", state.examTimer.running);
  }

  function resetExamTimer(announce = false) {
    const minutes = readTimerMinutes();
    state.examTimer.durationMinutes = minutes;
    state.examTimer.remainingSeconds = minutes * 60;
    state.examTimer.running = false;
    state.examTimer.endAt = 0;
    state.examTimer.finished = false;
    state.examTimer.renderedSecond = -1;
    ui.dropTimer.classList.remove("is-running", "is-finished");
    ui.timerStatus.textContent = announce ? `倒數已重設為 ${minutes} 分鐘` : "";
    renderExamTimer(true);
  }

  function toggleExamTimer() {
    if (state.examTimer.running) {
      state.examTimer.remainingSeconds = Math.max(0, (state.examTimer.endAt - Date.now()) / 1000);
      state.examTimer.running = false;
      ui.timerStatus.textContent = `倒數已暫停，剩餘 ${formatExamTime(state.examTimer.remainingSeconds)}`;
      renderExamTimer(true);
      return;
    }
    const requestedMinutes = readTimerMinutes();
    if (requestedMinutes !== state.examTimer.durationMinutes) {
      state.examTimer.durationMinutes = requestedMinutes;
      state.examTimer.remainingSeconds = requestedMinutes * 60;
      state.examTimer.renderedSecond = -1;
    }
    if (state.examTimer.remainingSeconds <= 0 || state.examTimer.finished) resetExamTimer(false);
    state.examTimer.running = true;
    state.examTimer.finished = false;
    state.examTimer.endAt = Date.now() + state.examTimer.remainingSeconds * 1000;
    ui.dropTimer.classList.remove("is-finished");
    ui.timerStatus.textContent = `開始 ${state.examTimer.durationMinutes} 分鐘倒數`;
    renderExamTimer(true);
  }

  function updateExamTimer() {
    if (!state.examTimer.running) return;
    state.examTimer.remainingSeconds = Math.max(0, (state.examTimer.endAt - Date.now()) / 1000);
    if (state.examTimer.remainingSeconds <= 0) {
      state.examTimer.running = false;
      state.examTimer.finished = true;
      state.examTimer.remainingSeconds = 0;
      ui.dropTimer.classList.remove("is-running");
      ui.dropTimer.classList.add("is-finished");
      ui.timerStatus.textContent = "倒數結束，時間到";
      showToast("時間到，最後一滴水已落入海裡");
    }
    renderExamTimer();
  }

  function emitCreatureWake(now) {
    if (state.reducedMotion || now < state.nextWakeBubble || !state.bubbles.length) return;
    const swimmers = state.creatures.filter((creature) => !creature.bottomDweller && !creature.isAttacked());
    if (!swimmers.length) return;
    const swimmer = swimmers[Math.floor(Math.random() * swimmers.length)];
    const bubble = state.bubbles[Math.floor(Math.random() * state.bubbles.length)];
    bubble.releaseFrom(swimmer);
    state.nextWakeBubble = now + random(150, 260);
  }

  function resetAquarium() {
    state.creatures.length = 0;
    state.usedNumbers.clear();
    state.quietSeconds = 0;
    state.loudSeconds = 0;
    state.sharkResponse = 0;
    state.sharkAttack = null;
    spawnCreature(false, false, "koi");
    showToast("海底世界已重新開始");
  }

  function frame(now) {
    const dt = Math.min((now - state.lastFrame) / 1000, .05);
    state.lastFrame = now;
    if (state.running) measureSound();
    updateBehavior(dt, now);
    updateExamTimer();
    drawWater(now);
    drawKelp(now);
    state.bubbles.forEach((bubble, index) => { if (index % 2 === 0) bubble.update(dt, now); });
    state.creatures.filter((creature) => !creature.bottomDweller).forEach((creature) => creature.update(dt, now));
    emitCreatureWake(now);
    drawShark(now);
    drawFloor(now);
    state.creatures.filter((creature) => creature.bottomDweller).forEach((creature) => creature.update(dt, now));
    state.bubbles.forEach((bubble, index) => { if (index % 2 === 1) bubble.update(dt, now); });
    updateUI();
    requestAnimationFrame(frame);
  }

  ui.thresholdRange.addEventListener("input", () => {
    state.threshold = Number(ui.thresholdRange.value);
    ui.thresholdOutput.value = `${state.threshold} dB`;
  });
  function updateSensitivityControl() {
    ui.sensitivityRange.value = String(state.micOffset);
    ui.sensitivityOutput.value = state.micOffset === 0
      ? "標準"
      : state.micOffset > 0 ? `更靈敏 +${state.micOffset}` : `較不靈敏 ${state.micOffset}`;
  }
  ui.sensitivityRange.addEventListener("input", () => {
    state.micOffset = Number(ui.sensitivityRange.value);
    updateSensitivityControl();
    try { localStorage.setItem("quietAquariumMicOffset", String(state.micOffset)); } catch { /* Optional preference. */ }
  });
  ui.timerMinutes.addEventListener("change", () => resetExamTimer(false));
  ui.timerMinutes.addEventListener("blur", () => resetExamTimer(false));
  window.aquariumActions = {
    toggleListening: () => state.running ? stopListening() : startListening(),
    toggleSettings: () => {
      const open = ui.settingsPanel.hidden;
      ui.settingsPanel.hidden = !open;
      ui.settingsButton.setAttribute("aria-expanded", String(open));
    },
    toggleProgress: (show) => {
      ui.quietCard.hidden = !show;
      ui.progressToggleButton.hidden = show;
      if (show) ui.quietCard.querySelector(".quiet-card__hide").focus();
      else ui.progressToggleButton.focus();
    },
    testFish: () => spawnCreature(true),
    demoAttack: demoSharkAttack,
    reset: resetAquarium,
    toggleTimer: toggleExamTimer,
    resetTimer: () => resetExamTimer(true),
    toggleFullscreen: async () => {
      try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
      } catch { showToast("這個瀏覽器暫時不支援全螢幕"); }
    }
  };
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !ui.settingsPanel.hidden) {
      ui.settingsPanel.hidden = true;
      ui.settingsButton.setAttribute("aria-expanded", "false");
      ui.settingsButton.focus();
    }
  });
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("beforeunload", () => state.stream?.getTracks().forEach((track) => track.stop()));

  state.bubbles = Array.from({ length: state.reducedMotion ? 30 : 78 }, () => new Bubble(true));
  state.particles = Array.from({ length: state.reducedMotion ? 40 : 120 }, () => ({
    x: Math.random(), y: Math.random(), r: random(.25, 1.1), speed: random(.00002, .00016), phase: random(0, TAU)
  }));
  resize();
  updateSensitivityControl();
  resetExamTimer(false);
  spawnCreature(false, false, "koi");
  requestAnimationFrame(frame);

  window.__aquariumDebug = {
    spawnFish: () => spawnCreature(true),
    spawnCreature: (type) => spawnCreature(true, true, type),
    setLevel: (db) => { state.running = true; state.targetDb = clamp(Number(db), 28, 96); },
    setTimerSeconds: (seconds) => {
      state.examTimer.remainingSeconds = clamp(Number(seconds), 0, 6000);
      state.examTimer.endAt = Date.now() + state.examTimer.remainingSeconds * 1000;
      state.examTimer.renderedSecond = -1;
      renderExamTimer(true);
    },
    getState: () => ({ creatures: state.creatures.length, numbers: state.creatures.map((creature) => creature.number), types: state.creatures.map((creature) => creature.type), quietSeconds: state.quietSeconds, db: state.displayDb, shark: state.sharkResponse, timer: Math.ceil(state.examTimer.remainingSeconds), timerRunning: state.examTimer.running })
  };
})();
