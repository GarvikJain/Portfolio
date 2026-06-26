import { useEffect, useRef } from 'react';

interface FallingStarsProps {
  isDayMode?: boolean;
}

export default function FallingStars({ isDayMode = false }: FallingStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Star {
      id: number;
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
    }

    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
    }

    // Drifting particles representing either stars (night) or sun dust motes (day)
    const stars: Star[] = Array.from({ length: 80 }, (_, idx) => ({
      id: idx,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.4 + 0.2, // medium speed drift
      opacity: Math.random() * 0.6 + 0.2,
    }));

    const shootingStars: ShootingStar[] = [];
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      phase += 0.015;

      if (isDayMode) {
        // ----------------------------------------------------
        // DAY MODE: Warm Golden Morning Sunbeams & Dust Motes
        // ----------------------------------------------------
        
        // 1. Draw glowing sunbeams sweeping diagonally
        ctx.save();
        const beamCount = 3;
        for (let b = 0; b < beamCount; b++) {
          // Calculate sliding beam starting X
          const beamX = width * 0.2 + b * (width * 0.25) + Math.sin(phase * 0.4 + b) * 40;
          const beamW = width * 0.12;

          // Warm golden vertical gradient
          const grad = ctx.createLinearGradient(beamX, 0, beamX - 150, height);
          grad.addColorStop(0, `rgba(255, 225, 170, ${0.06 + Math.sin(phase * 0.6 + b) * 0.03})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(beamX - beamW, 0);
          ctx.lineTo(beamX + beamW, 0);
          ctx.lineTo(beamX + beamW - 180, height);
          ctx.lineTo(beamX - beamW - 180, height);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // 2. Draw golden dust particles drifting gently
        stars.forEach((s) => {
          s.y += s.speed * 0.7; // slower drift in daylight
          s.x += Math.sin(phase * 0.5 + s.id) * 0.12; // wobble in air currents

          if (s.y > height) {
            s.y = 0;
            s.x = Math.random() * width;
          }

          // Warm yellow-orange tint
          ctx.fillStyle = `rgba(242, 100, 25, ${s.opacity * 0.3})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 1.5, 0, Math.PI * 2); // slightly larger motes
          ctx.fill();
        });

      } else {
        // ----------------------------------------------------
        // NIGHT MODE: Falling Stars & Meterorites
        // ----------------------------------------------------
        
        // 1. Drifting background stars
        stars.forEach((s) => {
          s.y += s.speed;
          s.x += s.speed * 0.15; // slight diagonal drift

          if (s.y > height) {
            s.y = 0;
            s.x = Math.random() * width;
          }
          if (s.x > width) {
            s.x = 0;
          }

          ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // 2. Spawn shooting stars
        if (Math.random() < 0.012 && shootingStars.length < 4) {
          shootingStars.push({
            x: Math.random() * width,
            y: Math.random() * (height * 0.3),
            length: Math.random() * 60 + 40,
            speed: Math.random() * 5 + 3.5,
            angle: Math.PI / 4 + (Math.random() * 0.08 - 0.04), // ~45 deg
            opacity: 1,
          });
        }

        // 3. Draw shooting stars
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          const dx = Math.cos(s.angle) * s.length;
          const dy = Math.sin(s.angle) * s.length;

          const grad = ctx.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy);
          grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - dx, s.y - dy);
          ctx.stroke();

          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          s.opacity -= 0.015;

          if (s.x > width || s.y > height || s.opacity <= 0) {
            shootingStars.splice(i, 1);
          }
        }
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
    };
  }, [isDayMode]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}
