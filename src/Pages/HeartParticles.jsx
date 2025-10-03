import React, { useEffect, useRef } from 'react';

export default function HeartParticles() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;

    const settings = {
      particles: {
        length: 3000,
        duration: 3,
        velocity: 80,
        effect: -1.2,
        size: 10
      }
    };

    // ---------- Geometry helpers ----------
    class Point {
      constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
      }
      clone() {
        return new Point(this.x, this.y);
      }
      length(length) {
        if (typeof length === 'undefined')
          return Math.sqrt(this.x * this.x + this.y * this.y);
        this.normalize();
        this.x *= length;
        this.y *= length;
        return this;
      }
      normalize() {
        const length = this.length();
        if (length === 0) {
          this.x = 1;
          this.y = 0;
          return this;
        }
        this.x /= length;
        this.y /= length;
        return this;
      }
    }

    // ---------- Particle classes ----------
    class Particle {
      constructor() {
        this.position = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();
        this.age = 0;
      }

      initialize(x, y, dx, dy) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.acceleration.x = dx * settings.particles.effect;
        this.acceleration.y = dy * settings.particles.effect;
        this.age = 0;
      }

      update(deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.age += deltaTime;
      }

      draw(context, image) {
        function ease(t) {
          return (--t) * t * t + 1;
        }
        const size = image.width * ease(this.age / settings.particles.duration);
        context.globalAlpha = Math.max(0, 1 - this.age / settings.particles.duration);
        context.drawImage(
          image,
          this.position.x - size / 2,
          this.position.y - size / 2,
          size,
          size
        );
      }
    }

    class ParticlePool {
      constructor(length) {
        this.particles = new Array(length);
        for (let i = 0; i < this.particles.length; i++) this.particles[i] = new Particle();
        this.firstActive = 0;
        this.firstFree = 0;
        this.duration = settings.particles.duration;
      }

      add(x, y, dx, dy) {
        const p = this.particles[this.firstFree];
        p.initialize(x, y, dx, dy);
        this.firstFree++;
        if (this.firstFree === this.particles.length) this.firstFree = 0;
        if (this.firstActive === this.firstFree) {
          this.firstActive++;
          if (this.firstActive === this.particles.length) this.firstActive = 0;
        }
      }

      update(deltaTime) {
        let i;
        if (this.firstActive < this.firstFree) {
          for (i = this.firstActive; i < this.firstFree; i++) this.particles[i].update(deltaTime);
        }
        if (this.firstFree < this.firstActive) {
          for (i = this.firstActive; i < this.particles.length; i++) this.particles[i].update(deltaTime);
          for (i = 0; i < this.firstFree; i++) this.particles[i].update(deltaTime);
        }
        while (this.particles[this.firstActive].age >= this.duration && this.firstActive !== this.firstFree) {
          this.firstActive++;
          if (this.firstActive === this.particles.length) this.firstActive = 0;
        }
      }

      draw(context, image) {
        if (this.firstActive < this.firstFree) {
          for (let i = this.firstActive; i < this.firstFree; i++) this.particles[i].draw(context, image);
        }
        if (this.firstFree < this.firstActive) {
          for (let i = this.firstActive; i < this.particles.length; i++) this.particles[i].draw(context, image);
          for (let i = 0; i < this.firstFree; i++) this.particles[i].draw(context, image);
        }
      }
    }

    // ---------- Heart parametric curve ----------
    function pointOnHeart(t) {
      return new Point(
        160 * Math.pow(Math.sin(t), 3),
        130 * Math.cos(t) -
          50 * Math.cos(2 * t) -
          20 * Math.cos(3 * t) -
          10 * Math.cos(4 * t) +
          25
      );
    }

    // ---------- Create small heart image (gradient) ----------
    function createHeartImage(size) {
      const c = document.createElement('canvas');
      const cc = c.getContext('2d');
      c.width = size;
      c.height = size;

      function to(t) {
        const p = pointOnHeart(t);
        return {
          x: size / 2 + (p.x * size) / 350,
          y: size / 2 - (p.y * size) / 350
        };
      }

      cc.beginPath();
      let t = -Math.PI;
      let pt = to(t);
      cc.moveTo(pt.x, pt.y);
      while (t < Math.PI) {
        t += 0.01;
        pt = to(t);
        cc.lineTo(pt.x, pt.y);
      }
      cc.closePath();

      const grad = cc.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size / 1.1);
      grad.addColorStop(0, '#ff6b9d');
      grad.addColorStop(0.5, '#ea5f89');
      grad.addColorStop(1, '#c9184a');
      cc.fillStyle = grad;
      cc.fill();

      const img = new Image();
      img.src = c.toDataURL();
      return img;
    }

    const image = createHeartImage(settings.particles.size);

    // ---------- Setup particle pool & emission ----------
    const particles = new ParticlePool(settings.particles.length);
    const particleRate = settings.particles.length / settings.particles.duration; // particles per second
    let emitAccumulator = 0;

    // ---------- Resize handling (use bounding rect * dpr) ----------
    function resize() {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      // ensure the CSS size is set (component likely sets width:100% height:100vh)
      if (rect.width === 0 || rect.height === 0) {
        // fallback to window size
        canvas.width = Math.round(window.innerWidth * dpr);
        canvas.height = Math.round(window.innerHeight * dpr);
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
      } else {
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
      }
      // set transform so we can draw in CSS pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', resize);
    resize();

    // ---------- Stars and Shooting Stars ----------
    class Star {
      constructor() {
        this.x = Math.random() * canvas.width / dpr;
        this.y = Math.random() * canvas.height / dpr;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinklePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.twinklePhase += this.twinkleSpeed;
        this.opacity = 0.2 + Math.sin(this.twinklePhase) * 0.6;
      }

      draw(context) {
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = '#ffffff';
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    class ShootingStar {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width / dpr;
        this.y = Math.random() * canvas.height / dpr * 0.3;
        this.vx = (Math.random() * 3 + 2) * (Math.random() < 0.5 ? 1 : -1);
        this.vy = Math.random() * 2 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 3 + 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        
        if (this.life <= 0 || this.x < 0 || this.x > canvas.width / dpr || this.y > canvas.height / dpr) {
          this.reset();
        }
      }

      draw(context) {
        context.save();
        context.globalAlpha = this.life;
        context.strokeStyle = '#ffffff';
        context.lineWidth = this.size;
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.x - this.vx * 10, this.y - this.vy * 10);
        context.stroke();
        context.restore();
      }
    }

    // Create stars and shooting stars
    const stars = [];
    const shootingStars = [];
    
    for (let i = 0; i < 100; i++) {
      stars.push(new Star());
    }
    
    for (let i = 0; i < 3; i++) {
      shootingStars.push(new ShootingStar());
    }

    // ---------- Rendering loop ----------
    let lastTime = performance.now() / 1000;

    function render() {
      rafRef.current = requestAnimationFrame(render);

      const now = performance.now() / 1000;
      let deltaTime = now - lastTime;
      lastTime = now;
      // clamp deltaTime to avoid huge jumps after tab switch
      if (deltaTime > 0.05) deltaTime = 0.05;

      // clear canvas (in CSS pixels)
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      // Draw stars
      stars.forEach(star => {
        star.update();
        star.draw(ctx);
      });

      // Draw shooting stars
      shootingStars.forEach(star => {
        star.update();
        star.draw(ctx);
      });

      // compute how many particles to emit this frame, keep fractional remainder
      emitAccumulator += particleRate * deltaTime;
      const emitCount = Math.floor(emitAccumulator);
      emitAccumulator -= emitCount;

      for (let i = 0; i < emitCount; i++) {
        // spawn along heart curve (random t)
        const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
        const dir = pos.clone().length(settings.particles.velocity);
        // position centered
        particles.add(
          canvas.width / (2 * dpr) + pos.x,
          canvas.height / (2 * dpr) - pos.y,
          dir.x,
          -dir.y
        );
      }

      particles.update(deltaTime);
      particles.draw(ctx, image);
    }

    // Start rendering as soon as image is ready (image is dataURL so usually ready immediately)
    if (image.complete) {
      render();
    } else {
      image.onload = () => {
        render();
      };
      // in the unlikely event it errors, still render
      image.onerror = () => {
        render();
      };
    }

    // ---------- cleanup ----------
    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}
