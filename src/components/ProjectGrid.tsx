import { useEffect, useRef, useState } from 'react';

// Custom inline SVG icons
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);



const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

// ----------------------------------------------------
// Project 1: Multi-Modal RAG Canvas (Entity Graph with PDFs, Tables, Images)
// ----------------------------------------------------
function MultiModalRAGCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || 400;
    let height = canvas.height = 160;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = 160;
      }
    });
    resizeObserver.observe(canvas.parentElement!);

    interface GraphNode {
      id: number;
      label: string;
      type: 'doc' | 'image' | 'table' | 'vector' | 'llm';
      rx: number; // relative x (0 to 1)
      ry: number; // relative y (0 to 1)
      size: number;
      color: string;
    }

    const nodes: GraphNode[] = [
      // Left side: source elements
      { id: 1, label: 'Doc_Financials.pdf', type: 'doc', rx: 0.15, ry: 0.22, size: 14, color: '#2962FF' },
      { id: 2, label: 'Invoice_Scan.png', type: 'image', rx: 0.15, ry: 0.5, size: 14, color: '#F26419' },
      { id: 3, label: 'Metadata_Q4.csv', type: 'table', rx: 0.15, ry: 0.78, size: 14, color: '#FFD000' },
      // Middle: vector mapping db
      { id: 4, label: 'Vector DB (Index)', type: 'vector', rx: 0.5, ry: 0.5, size: 22, color: '#06D6A0' },
      // Right: generators
      { id: 5, label: 'LLM Generator', type: 'llm', rx: 0.85, ry: 0.35, size: 20, color: '#6A4CFF' },
      { id: 6, label: 'Response.md', type: 'doc', rx: 0.85, ry: 0.65, size: 14, color: '#ff5c5c' },
    ];

    const edges = [
      { s: 1, t: 4 },
      { s: 2, t: 4 },
      { s: 3, t: 4 },
      { s: 4, t: 5 },
      { s: 5, t: 6 },
    ];

    let time = 0;
    const particles: { x: number; y: number; progress: number; speed: number; edgeIdx: number }[] = [];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      time += 0.03;

      // Spawn particles periodically
      if (Math.random() < 0.03) {
        const edgeIdx = Math.floor(Math.random() * edges.length);
        particles.push({
          x: 0,
          y: 0,
          progress: 0,
          speed: 0.015 + Math.random() * 0.015,
          edgeIdx
        });
      }

      // Draw Edges
      edges.forEach((edge) => {
        const sNode = nodes.find(n => n.id === edge.s);
        const tNode = nodes.find(n => n.id === edge.t);
        if (sNode && tNode) {
          const sx = sNode.rx * width;
          const sy = sNode.ry * height;
          const tx = tNode.rx * width;
          const ty = tNode.ry * height;

          // Draw connection line
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(tx, ty);
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Draw dashes moving along lines
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(tx, ty);
          ctx.strokeStyle = '#6A4CFF';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([8, 12]);
          ctx.lineDashOffset = -time * 30;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Update and Draw particles (tokens flowing)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        const edge = edges[p.edgeIdx];
        const sNode = nodes.find(n => n.id === edge.s);
        const tNode = nodes.find(n => n.id === edge.t);
        if (sNode && tNode) {
          const sx = sNode.rx * width;
          const sy = sNode.ry * height;
          const tx = tNode.rx * width;
          const ty = tNode.ry * height;

          p.x = sx + (tx - sx) * p.progress;
          p.y = sy + (ty - sy) * p.progress;

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = sNode.color;
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Draw Nodes
      nodes.forEach(n => {
        const x = n.rx * width;
        const y = n.ry * height;

        ctx.save();
        ctx.translate(x, y);

        // Hover scale effect
        const scale = 1 + Math.sin(time * 3 + n.id) * 0.05;
        ctx.scale(scale, scale);

        ctx.fillStyle = n.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2.5;

        // Custom shape depending on type
        if (n.type === 'doc') {
          // Document shape
          ctx.beginPath();
          ctx.rect(-n.size, -n.size * 1.3, n.size * 2, n.size * 2.6);
          ctx.fill();
          ctx.stroke();

          // Lines on doc
          ctx.fillStyle = '#fff';
          ctx.beginPath(); ctx.rect(-n.size + 4, -n.size + 2, n.size * 2 - 8, 2.5); ctx.fill();
          ctx.beginPath(); ctx.rect(-n.size + 4, -n.size + 7, n.size * 2 - 12, 2.5); ctx.fill();
          ctx.beginPath(); ctx.rect(-n.size + 4, -n.size + 12, n.size * 2 - 8, 2.5); ctx.fill();
        } else if (n.type === 'image') {
          // Image polaroid frame
          ctx.beginPath();
          ctx.rect(-n.size, -n.size, n.size * 2, n.size * 2.2);
          ctx.fill();
          ctx.stroke();

          // Inner picture
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.rect(-n.size + 3, -n.size + 3, n.size * 2 - 6, n.size * 1.3);
          ctx.fill();
          ctx.stroke();

          // Mountain shape inside image
          ctx.fillStyle = '#2962FF';
          ctx.beginPath();
          ctx.moveTo(-n.size + 5, -n.size + 13);
          ctx.lineTo(-n.size + 9, -n.size + 6);
          ctx.lineTo(-n.size + 15, -n.size + 15);
          ctx.closePath();
          ctx.fill();
        } else if (n.type === 'table') {
          // Spreadsheet
          ctx.beginPath();
          ctx.rect(-n.size * 1.2, -n.size * 0.9, n.size * 2.4, n.size * 1.8);
          ctx.fill();
          ctx.stroke();

          // Grid lines
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-n.size * 1.2, 0); ctx.lineTo(n.size * 1.2, 0);
          ctx.moveTo(0, -n.size * 0.9); ctx.lineTo(0, n.size * 0.9);
          ctx.stroke();
        } else if (n.type === 'vector') {
          // Stacked Cylinder Database
          for (let i = 2; i >= 0; i--) {
            ctx.fillStyle = i === 0 ? n.color : '#e0e0e0';
            ctx.beginPath();
            ctx.ellipse(0, -i * 7, n.size, n.size * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.rect(-n.size, -i * 7, n.size * 2, 7);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.ellipse(0, -i * 7 + 7, n.size, n.size * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        } else if (n.type === 'llm') {
          // Brain or processor hexagon
          ctx.beginPath();
          for (let s = 0; s < 6; s++) {
            const angle = (s * Math.PI) / 3;
            const px = Math.cos(angle) * n.size;
            const py = Math.sin(angle) * n.size;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Core circle
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();

        // Node label
        ctx.fillStyle = '#000';
        ctx.font = 'bold 8.5px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, x, y + n.size + 14);
      });

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block bg-white/40 border-2 border-black rounded-lg" />;
}

// ----------------------------------------------------
// Project 2: Portfolio Website Canvas (Mirror grid mockup)
// ----------------------------------------------------
function PortfolioCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || 400;
    let height = canvas.height = 160;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = 160;
      }
    });
    resizeObserver.observe(canvas.parentElement!);

    const drawBentoGrid = (x: number, y: number, w: number, h: number, depth: number) => {
      if (depth > 3) return; // Limit recursion

      ctx.save();
      ctx.translate(x, y);

      // Browser container
      ctx.fillStyle = '#FBFAF5';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = depth === 1 ? 3 : 1.5;
      
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, depth === 1 ? 10 : 4);
      ctx.fill();
      ctx.stroke();

      // Top bar for mockup
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.roundRect(0, 0, w, depth === 1 ? 22 : 9, depth === 1 ? [10, 10, 0, 0] : [4, 4, 0, 0]);
      ctx.fill();

      // Control dots (red, yellow, green)
      if (w > 50) {
        const dotY = depth === 1 ? 11 : 4.5;
        const dotSize = depth === 1 ? 3.5 : 1.2;
        const dotSpacing = depth === 1 ? 7 : 2.5;
        ctx.fillStyle = '#ff5c5c';
        ctx.beginPath(); ctx.arc(10, dotY, dotSize, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFD000';
        ctx.beginPath(); ctx.arc(10 + dotSpacing, dotY, dotSize, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#06D6A0';
        ctx.beginPath(); ctx.arc(10 + dotSpacing * 2, dotY, dotSize, 0, Math.PI * 2); ctx.fill();
      }

      // Title bar text
      if (depth === 1) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('GARVIK_JAIN_PORTFOLIO.EXE', 36, 14);
      }

      // Layout measurements inside container
      const topBarH = depth === 1 ? 22 : 9;
      const innerW = w - 16;
      const innerH = h - topBarH - 8;
      const pad = depth === 1 ? 5 : 1.5;

      ctx.translate(8, topBarH + 4);

      // 1. Hero card (top half, left 60%)
      const card1W = innerW * 0.58;
      const card1H = innerH * 0.44;
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = depth === 1 ? 2 : 1;
      ctx.beginPath();
      ctx.roundRect(0, 0, card1W, card1H, depth === 1 ? 6 : 2);
      ctx.fill(); ctx.stroke();

      if (card1W > 40) {
        ctx.fillStyle = '#000';
        ctx.font = `bold ${depth === 1 ? 8.5 : 4}px monospace`;
        ctx.fillText('Garvik Jain', pad + 2, card1H * 0.4);
        ctx.fillStyle = '#6A4CFF';
        ctx.font = `bold ${depth === 1 ? 6.5 : 3.5}px monospace`;
        ctx.fillText('AI & ML Engineering', pad + 2, card1H * 0.75);
      }

      // 2. Terminal Card (top half, right 40%)
      const card2X = card1W + pad * 1.5;
      const card2W = innerW - card2X;
      const card2H = card1H;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.roundRect(card2X, 0, card2W, card2H, depth === 1 ? 6 : 2);
      ctx.fill(); ctx.stroke();

      if (card2W > 35) {
        ctx.fillStyle = '#06D6A0';
        ctx.font = `bold ${depth === 1 ? 6.5 : 3}px monospace`;
        ctx.fillText('C:/> whoami', card2X + pad, card2H * 0.35);
        ctx.fillText('Garvik_Jain', card2X + pad, card2H * 0.7);
      }

      // 3. DevStack Explorer (bottom half, left 45%)
      const card3Y = card1H + pad * 1.5;
      const card3W = innerW * 0.44;
      const card3H = innerH - card3Y;
      ctx.fillStyle = '#06D6A0';
      ctx.beginPath();
      ctx.roundRect(0, card3Y, card3W, card3H, depth === 1 ? 6 : 2);
      ctx.fill(); ctx.stroke();

      if (card3W > 35) {
        ctx.fillStyle = '#000';
        ctx.font = `bold ${depth === 1 ? 6.5 : 3}px monospace`;
        ctx.fillText('📁 DevStack', pad, card3Y + card3H * 0.5);
      }

      // 4. Projects card (bottom half, right 55% -> This contains recursion!)
      const card4X = card3W + pad * 1.5;
      const card4W = innerW - card4X;
      const card4H = card3H;
      const card4Y = card3Y;

      // Draw the Projects Card border/background
      ctx.fillStyle = '#FFD000';
      ctx.beginPath();
      ctx.roundRect(card4X, card4Y, card4W, card4H, depth === 1 ? 6 : 2);
      ctx.fill(); ctx.stroke();

      // RECURSION: Draw a miniature bento grid inside the projects card!
      const nestedPad = depth === 1 ? 10 : 3;
      const nestedW = card4W - nestedPad * 2;
      const nestedH = card4H - nestedPad * 2;
      if (nestedW > 18 && nestedH > 14) {
        drawBentoGrid(card4X + nestedPad, card4Y + nestedPad, nestedW, nestedH, depth + 1);
      }

      ctx.restore();
    };

    let cursorT = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }

      // Draw the primary portfolio screen filling the canvas (minus padding)
      drawBentoGrid(12, 12, width - 24, height - 24, 1);

      // Animate simulated cursor clicking around
      cursorT += 0.02;
      const xTarget = width / 2 + Math.sin(cursorT) * (width * 0.35);
      const yTarget = height / 2 + Math.cos(cursorT * 0.8) * (height * 0.25);

      // Draw mouse cursor arrow
      ctx.save();
      ctx.translate(xTarget, yTarget);
      ctx.fillStyle = '#000';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(9, 7);
      ctx.lineTo(4.5, 8);
      ctx.lineTo(7, 13);
      ctx.lineTo(5.5, 14);
      ctx.lineTo(2.5, 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block bg-white/40 border-2 border-black rounded-lg" />;
}

// ----------------------------------------------------
// Project 3: VIT Chennai Outing Planner Canvas (Campus Map Pathfinder)
// ----------------------------------------------------
function OutingPlannerCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || 400;
    let height = canvas.height = 160;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = 160;
      }
    });
    resizeObserver.observe(canvas.parentElement!);

    interface MapNode {
      id: number;
      name: string;
      rx: number; // relative coordinates (0 to 1)
      ry: number;
      color: string;
      icon: string;
    }

    const nodes: MapNode[] = [
      { id: 1, name: 'VIT Chennai', rx: 0.12, ry: 0.5, color: '#FFD000', icon: '🏫' },
      { id: 2, name: 'Vandalur Zoo', rx: 0.38, ry: 0.22, color: '#06D6A0', icon: '🦁' },
      { id: 3, name: 'Marina Mall', rx: 0.42, ry: 0.78, color: '#ff5c5c', icon: '🛍️' },
      { id: 4, name: 'Kovalam Beach', rx: 0.72, ry: 0.45, color: '#2962FF', icon: '🏄' },
      { id: 5, name: 'Mahabalipuram', rx: 0.9, ry: 0.75, color: '#F26419', icon: '🛕' },
    ];

    const edges = [
      { s: 1, t: 2, label: '8 km (20m)' },
      { s: 1, t: 3, label: '10 km (22m)' },
      { s: 2, t: 4, label: '22 km (40m)' },
      { s: 3, t: 4, label: '12 km (20m)' },
      { s: 4, t: 5, label: '32 km (45m)' },
    ];

    // Travel routes to highlight
    const path = [1, 3, 4, 5];
    let pulseTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }

      pulseTime += 0.015;

      // Draw Connections (Edges)
      edges.forEach(edge => {
        const s = nodes.find(n => n.id === edge.s);
        const t = nodes.find(n => n.id === edge.t);
        if (s && t) {
          const sx = s.rx * width;
          const sy = s.ry * height;
          const tx = t.rx * width;
          const ty = t.ry * height;

          // Base line
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(tx, ty);
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Distance labels
          ctx.fillStyle = '#444';
          ctx.font = 'bold 7px monospace';
          const midX = (sx + tx) / 2;
          const midY = (sy + ty) / 2 - 4;
          ctx.save();
          ctx.translate(midX, midY);
          const angle = Math.atan2(ty - sy, tx - sx);
          ctx.rotate(Math.abs(angle) > Math.PI / 2 ? angle + Math.PI : angle);
          ctx.textAlign = 'center';
          ctx.fillText(edge.label, 0, 0);
          ctx.restore();
        }
      });

      // Draw Path Travel Indicator (A* Simulation)
      for (let i = 0; i < path.length - 1; i++) {
        const sNode = nodes.find(n => n.id === path[i]);
        const tNode = nodes.find(n => n.id === path[i+1]);
        if (sNode && tNode) {
          const sx = sNode.rx * width;
          const sy = sNode.ry * height;
          const tx = tNode.rx * width;
          const ty = tNode.ry * height;

          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(tx, ty);
          ctx.strokeStyle = '#FFD000';
          ctx.lineWidth = 4;
          ctx.setLineDash([8, 12]);
          ctx.lineDashOffset = -pulseTime * 40;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw Traveler Pulse Dot
      const currentSegment = Math.floor(pulseTime) % (path.length - 1);
      const segmentProgress = pulseTime % 1;
      const activeSNode = nodes.find(n => n.id === path[currentSegment]);
      const activeTNode = nodes.find(n => n.id === path[currentSegment + 1]);
      if (activeSNode && activeTNode) {
        const sx = activeSNode.rx * width;
        const sy = activeSNode.ry * height;
        const tx = activeTNode.rx * width;
        const ty = activeTNode.ry * height;

        const travelerX = sx + (tx - sx) * segmentProgress;
        const travelerY = sy + (ty - sy) * segmentProgress;

        ctx.beginPath();
        ctx.arc(travelerX, travelerY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD000';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(travelerX, travelerY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      }

      // Draw Nodes
      nodes.forEach(n => {
        const x = n.rx * width;
        const y = n.ry * height;

        ctx.save();
        ctx.translate(x, y);

        // Node block border
        ctx.fillStyle = n.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-16, -16, 32, 32, 6);
        ctx.fill();
        ctx.stroke();

        // Node emoji icon
        ctx.font = '12px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.icon, 0, 0);

        ctx.restore();

        // Node labels
        ctx.font = 'bold 8.5px monospace';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(n.name, x, y + 25);
      });

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block bg-white/40 border-2 border-black rounded-lg" />;
}

// ----------------------------------------------------
// Project 4: ATS Resume Parser Canvas (Metrics/score comparison)
// ----------------------------------------------------
function ResumeParserCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || 400;
    let height = canvas.height = 160;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = 160;
      }
    });
    resizeObserver.observe(canvas.parentElement!);

    let scanY = 15;
    let scanDir = 1;
    let logIndex = 0;
    const logs = [
      'Reading PDF sections...',
      'Running Spacy OCR...',
      'Matching JD tags: Python',
      'Matching JD tags: PyTorch',
      'Validating certifications...',
      'Scoring match embeddings...',
      'Parsing complete.'
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }

      // Column partitions layout
      const col1W = width * 0.32;
      const col2W = width * 0.32;
      const col3W = width - col1W - col2W - 12;

      // Draw Column 1: JD Target Window
      ctx.save();
      ctx.translate(6, 6);
      ctx.fillStyle = '#FBFAF5';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(0, 0, col1W - 6, height - 12, 6); ctx.fill(); ctx.stroke();

      // Top bar for Col 1
      ctx.fillStyle = '#2962FF';
      ctx.beginPath(); ctx.roundRect(0, 0, col1W - 6, 16, [6, 6, 0, 0]); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 7px monospace';
      ctx.fillText('JD_REQUIREMENTS.TXT', 6, 11);

      // Content inside Col 1
      ctx.fillStyle = '#000';
      ctx.font = 'bold 7px monospace';
      const jdTags = ['- Python / R / C++', '- ML / Deep Learning', '- LLMs & RAG pipelines', '- Vector DBs (Redis)', '- Cloud Deployment'];
      jdTags.forEach((tag, i) => {
        ctx.fillText(tag, 6, 32 + i * 16);
      });
      ctx.restore();

      // Draw Column 2: Document Scanning Laser Simulation
      ctx.save();
      ctx.translate(col1W + 6, 6);
      ctx.fillStyle = '#FBFAF5';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(0, 0, col2W - 6, height - 12, 6); ctx.fill(); ctx.stroke();

      // Draw document shape inside Scanner
      const docW = col2W - 30;
      const docH = height - 45;
      const docX = 12;
      const docY = 10;
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.rect(docX, docY, docW, docH); ctx.fill(); ctx.stroke();

      // Sim lines of resume text
      ctx.fillStyle = '#ddd';
      for (let i = 0; i < 6; i++) {
        ctx.beginPath(); ctx.rect(docX + 4, docY + 4 + i * 8, docW - 8, 2); ctx.fill();
      }

      // Scanner laser line moving up & down
      scanY += scanDir * 0.8;
      if (scanY > docH + 6 || scanY < docY + 2) {
        scanDir *= -1;
        logIndex = (logIndex + 1) % logs.length;
      }
      ctx.strokeStyle = '#06D6A0';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#06D6A0';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(docX - 2, scanY);
      ctx.lineTo(docX + docW + 2, scanY);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      // Realtime scanning log text
      ctx.fillStyle = '#06D6A0';
      ctx.fillRect(4, height - 32, col2W - 14, 12);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.strokeRect(4, height - 32, col2W - 14, 12);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 6px monospace';
      ctx.fillText(`> ${logs[logIndex]}`, 8, height - 24);
      ctx.restore();

      // Draw Column 3: Scores & Suggestions Dashboard
      ctx.save();
      ctx.translate(col1W + col2W + 6, 6);
      ctx.fillStyle = '#FBFAF5';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(0, 0, col3W - 6, height - 12, 6); ctx.fill(); ctx.stroke();

      // Header top bar
      ctx.fillStyle = '#06D6A0';
      ctx.beginPath(); ctx.roundRect(0, 0, col3W - 6, 16, [6, 6, 0, 0]); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 7px monospace';
      ctx.fillText('SCOREBOARD.EXE', 6, 11);

      // Score Comparison List
      const candidates = [
        { name: 'Garvik Jain', score: 0.98, color: '#06D6A0' },
        { name: 'Candidate_B', score: 0.72, color: '#FFD000' },
        { name: 'Candidate_C', score: 0.45, color: '#ff5c5c' }
      ];

      candidates.forEach((c, idx) => {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 6.5px monospace';
        ctx.fillText(`${c.name} (${Math.round(c.score * 100)}%)`, 6, 28 + idx * 22);

        // Bar container
        ctx.fillStyle = '#e0e0e0';
        ctx.beginPath(); ctx.rect(6, 31 + idx * 22, col3W - 20, 4); ctx.fill();
        // Bar progress
        ctx.fillStyle = c.color;
        ctx.beginPath(); ctx.rect(6, 31 + idx * 22, (col3W - 20) * c.score, 4); ctx.fill();
        ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
        ctx.strokeRect(6, 31 + idx * 22, col3W - 20, 4);
      });

      // Bottom Tips ticker
      ctx.fillStyle = '#FFD000';
      ctx.fillRect(4, height - 32, col3W - 14, 12);
      ctx.strokeRect(4, height - 32, col3W - 14, 12);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 5.5px monospace';
      ctx.fillText('💡 Tip: Add "Docker" for 100%', 8, height - 24);
      ctx.restore();

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block bg-white/40 border-2 border-black rounded-lg" />;
}

// ----------------------------------------------------
// Project 5: Mind-bodyHub Canvas (Active Wellness Dashboard)
// ----------------------------------------------------
function MindBodyHubCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || 400;
    let height = canvas.height = 160;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = 160;
      }
    });
    resizeObserver.observe(canvas.parentElement!);

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }

      phase += 0.04;

      // 6-panel grid layout calculations
      const padding = 6;
      const colW = (width - padding * 4) / 3;
      const rowH = (height - padding * 3) / 2;

      const drawPanel = (colIdx: number, rowIdx: number, title: string, renderContent: (cx: number, cy: number, cw: number, ch: number) => void) => {
        const x = padding + colIdx * (colW + padding);
        const y = padding + rowIdx * (rowH + padding);

        ctx.save();
        ctx.fillStyle = '#FBFAF5';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, y, colW, rowH, 6);
        ctx.fill();
        ctx.stroke();

        // Panel header
        ctx.fillStyle = '#000';
        ctx.font = 'bold 7px monospace';
        ctx.fillText(title, x + 6, y + 10);

        renderContent(x, y, colW, rowH);
        ctx.restore();
      };

      // 1. Panel 1: Heart Rate & HRV
      drawPanel(0, 0, '❤️ HEART RATE', (x, y, w, h) => {
        ctx.strokeStyle = '#ff5c5c';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const startX = x + 6;
        const endX = x + w - 6;
        const centerY = y + h * 0.65;
        
        for (let px = startX; px < endX; px++) {
          const localTime = phase * 12;
          const pos = (px - startX + localTime) % 50;
          let py = centerY;
          if (pos > 10 && pos < 15) {
            py -= Math.sin(((pos - 10) / 5) * Math.PI) * 16;
          } else if (pos >= 15 && pos < 20) {
            py += Math.sin(((pos - 15) / 5) * Math.PI) * 8;
          }
          if (px === startX) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.font = 'bold 6.5px monospace';
        ctx.fillText('72 BPM | HRV 64ms', x + 6, y + h - 6);
      });

      // 2. Panel 2: Activity Rings
      drawPanel(1, 0, '🏃 ACTIVITY', (x, y, w, h) => {
        const cx = x + w / 2;
        const cy = y + h * 0.55;
        const rBase = 12;

        ctx.lineWidth = 2.5;

        // Outer step progress ring (teal)
        ctx.strokeStyle = '#e0e0e0';
        ctx.beginPath(); ctx.arc(cx, cy, rBase, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = '#06D6A0';
        ctx.beginPath(); ctx.arc(cx, cy, rBase, -Math.PI/2, -Math.PI/2 + Math.PI * 2 * 0.84); ctx.stroke();

        // Inner calorie ring (orange)
        ctx.strokeStyle = '#e0e0e0';
        ctx.beginPath(); ctx.arc(cx, cy, rBase - 4, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = '#F26419';
        ctx.beginPath(); ctx.arc(cx, cy, rBase - 4, -Math.PI/2, -Math.PI/2 + Math.PI * 2 * 0.65); ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.font = 'bold 5.5px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('8,421 / 10k', cx, y + h - 4);
        ctx.textAlign = 'left';
      });

      // 3. Panel 3: Sleep Tracker
      drawPanel(2, 0, '💤 SLEEP CYCLE', (x, y, w, h) => {
        ctx.strokeStyle = '#6A4CFF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const startX = x + 6;
        const endX = x + w - 6;
        const centerY = y + h * 0.6;

        for (let px = startX; px < endX; px++) {
          const ratio = (px - startX) / (endX - startX);
          const py = centerY + Math.sin(ratio * Math.PI * 3 + phase * 0.5) * (h * 0.2);
          if (px === startX) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.font = 'bold 6.5px monospace';
        ctx.fillText('Score: 88% (Deep)', x + 6, y + h - 6);
      });

      // 4. Panel 4: Hydration Intake
      drawPanel(0, 1, '💧 HYDRATION', (x, y, w, h) => {
        const cupW = w * 0.35;
        const cupH = h * 0.5;
        const cupX = x + w * 0.1;
        const cupY = y + 14;

        ctx.fillStyle = 'rgba(41, 98, 255, 0.15)';
        ctx.beginPath(); ctx.rect(cupX, cupY, cupW, cupH); ctx.fill();
        ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
        ctx.strokeRect(cupX, cupY, cupW, cupH);

        // Water level wave
        ctx.fillStyle = '#2962FF';
        ctx.beginPath();
        ctx.moveTo(cupX, cupY + cupH);
        for (let wx = cupX; wx <= cupX + cupW; wx++) {
          const relativeX = (wx - cupX) / cupW;
          const levelY = cupY + cupH * 0.4 + Math.sin(relativeX * Math.PI * 2 + phase * 2) * 2;
          ctx.lineTo(wx, levelY);
        }
        ctx.lineTo(cupX + cupW, cupY + cupH);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.font = 'bold 6.5px monospace';
        ctx.fillText('5/8 Cups', x + w * 0.52, y + 25);
        ctx.fillText('1.8L / 3L', x + w * 0.52, y + 37);
      });

      // 5. Panel 5: Calories & Macros Split
      drawPanel(1, 1, '🍎 NUTRITION', (x, y, w, _h) => {
        const barX = x + 6;
        const barY = y + 18;
        const barW = w - 12;
        const barH = 5;

        // Calories bar
        ctx.fillStyle = '#e0e0e0';
        ctx.beginPath(); ctx.rect(barX, barY, barW, barH); ctx.fill();
        ctx.fillStyle = '#FFD000';
        ctx.beginPath(); ctx.rect(barX, barY, barW * 0.74, barH); ctx.fill();
        ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);

        // Macros segment display
        ctx.fillStyle = '#ff5c5c'; // protein
        ctx.fillRect(barX, barY + 10, barW * 0.3, 3);
        ctx.fillStyle = '#06D6A0'; // carbs
        ctx.fillRect(barX + barW * 0.3, barY + 10, barW * 0.5, 3);
        ctx.fillStyle = '#2962FF'; // fat
        ctx.fillRect(barX + barW * 0.8, barY + 10, barW * 0.2, 3);

        ctx.fillStyle = '#000';
        ctx.font = 'bold 6.5px monospace';
        ctx.fillText('1,840 / 2,400 kcal', barX, barY + 24);
      });

      // 6. Panel 6: Stress & Deep Breathing
      drawPanel(2, 1, '🧘 STRESS LEVEL', (x, y, w, h) => {
        const breathRadius = 10 + Math.sin(phase * 1.5) * 4;
        const cx = x + w * 0.25;
        const cy = y + h * 0.55;

        ctx.fillStyle = 'rgba(6, 214, 160, 0.25)';
        ctx.beginPath(); ctx.arc(cx, cy, breathRadius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#06D6A0';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cx, cy, breathRadius, 0, Math.PI * 2); ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.font = 'bold 6.5px monospace';
        ctx.fillText('Index: 22', x + w * 0.5, y + 22);
        ctx.font = 'bold 5.5px monospace';
        ctx.fillStyle = '#444';
        ctx.fillText(Math.sin(phase * 1.5) > 0 ? 'Breathe In' : 'Breathe Out', x + w * 0.5, y + 34);
      });

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block bg-white/40 border-2 border-black rounded-lg" />;
}

// ----------------------------------------------------
// Main Component rendering all 5 bento projects
// ----------------------------------------------------
export default function ProjectGrid() {
  const [querySimulation, setQuerySimulation] = useState<string | null>(null);

  const simulateProjectAction = (title: string) => {
    setQuerySimulation(`System: ${title} simulation triggered successfully.`);
    setTimeout(() => setQuerySimulation(null), 3000);
  };

  const projectList = [
    {
      id: 'multimodal-rag',
      title: 'Multi-Modal RAG System',
      tag: 'AI ARCHITECTURE',
      tagColor: 'bg-[#6A4CFF]', // purple
      desc: 'A powerful, multimodal Graph-Augmented Retrieval-Augmented Generation (RAG) system. This application parses complex documents (including images and tables), builds an interactive knowledge graph, and uses a Vision-Language Model (Groq / local MLX VLM) to provide highly accurate, visually-cited answers.',
      canvas: <MultiModalRAGCanvas />,
      github: 'https://github.com/GarvikJain/Mutli-Modal-Context-Aware-RAG',
    },
    {
      id: 'portfolio-website',
      title: 'Portfolio Website',
      tag: 'FULL STACK DEV',
      tagColor: 'bg-[#06D6A0] text-black', // teal
      desc: 'Neo-Brutalist Y2K Bento Grid portfolio built in React 19, TypeScript, Tailwind CSS v4, and custom Canvas visualizers.',
      canvas: <PortfolioCanvas />,
      github: 'https://github.com/GarvikJain',
    },
    {
      id: 'outing-planner',
      title: 'VIT Chennai Outing Planner',
      tag: 'GRAPH THEORY & PATHFINDING',
      tagColor: 'bg-[#FFD000] text-black', // yellow
      desc: 'Interactive web app for finding shortest paths from VIT Chennai to destinations using A* search, with a path tree and graph map view.',
      canvas: <OutingPlannerCanvas />,
      github: 'https://github.com/GarvikJain/VIT-Chennai-Outing-Planner',
    },
    {
      id: 'ats-resume-parser',
      title: 'ATS Resume Parser',
      tag: 'NATURAL LANGUAGE PROCESSING',
      tagColor: 'bg-[#2962FF]', // blue
      desc: 'AI-powered document intelligence extractor structured with parsing nodes to read resumes and match qualifications against job requirements.',
      canvas: <ResumeParserCanvas />,
      github: 'https://github.com/GarvikJain/AI_Resume_Parser',
    },
    {
      id: 'mind-body-hub',
      title: 'Mind-bodyHub',
      tag: 'FRONTEND DESIGN',
      tagColor: 'bg-[#ff5c5c]', // coral
      desc: 'Responsive fitness analytics dashboard displaying body metrics and health indexes, built with modular layout components.',
      canvas: <MindBodyHubCanvas />,
      github: 'https://github.com/GarvikJain/mindbody-hub',
    },
  ];

  return (
    <div className="space-y-6 w-full relative">
      {/* Toast Alert Box */}
      {querySimulation && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-[#FBFAF5] text-black border-[3px] border-black rounded-xl shadow-neo-lg font-body overflow-hidden animate-scale-in">
          <div className="bg-[#000080] text-white px-3 py-1 font-mono font-bold text-xs flex justify-between items-center">
            <span>System Alert</span>
            <button onClick={() => setQuerySimulation(null)} className="font-bold">✕</button>
          </div>
          <div className="p-4 flex items-start space-x-3">
            <div className="w-7 h-7 rounded-full bg-[#06D6A0] flex items-center justify-center shrink-0 border border-black text-white font-mono font-black text-xs">✓</div>
            <p className="text-xs font-mono font-bold leading-relaxed">{querySimulation}</p>
          </div>
        </div>
      )}

      {/* Render Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {projectList.map((project) => (
          <div 
            key={project.id}
            className="w-full bg-[#FBFAF5] text-black rounded-xl border-[3px] border-black shadow-neo overflow-hidden flex flex-col font-body"
          >
            {/* Header bar */}
            <div className="bg-black text-white px-4 py-2 border-b-[3px] border-black flex items-center justify-between font-mono font-bold select-none text-sm">
              <span className="truncate">📁 {project.title.toUpperCase().replace(/[\s-]/g, '_')}.EXE</span>
              <span className="text-[10px] text-neutral-400 font-bold hidden sm:inline">AI WORKFLOW CONNECTED</span>
            </div>

            {/* Content Body */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Text & Actions */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className={`inline-block px-3 py-1 text-white font-mono text-xs font-bold border-2 border-black shadow-neo-sm mb-3 -rotate-1 ${project.tagColor}`}>
                    {project.tag}
                  </div>
                  <h3 className="text-2xl font-display font-black leading-tight tracking-tight mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-neutral-700 leading-relaxed font-semibold">
                    {project.desc}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-1.5 bg-black hover:bg-neutral-800 text-white border-2 border-black font-mono font-bold text-xs rounded-lg shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <GithubIcon className="w-3.5 h-3.5 mr-2" /> GitHub
                  </a>
                  <button
                    onClick={() => simulateProjectAction(`${project.title} CaseStudy.txt`)}
                    className="flex items-center px-4 py-1.5 bg-white hover:bg-neutral-100 border-2 border-black text-black font-mono font-bold text-xs rounded-lg shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <FileTextIcon className="w-3.5 h-3.5 mr-2" /> Details
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Canvas Visualizer */}
              <div className="lg:col-span-7 flex flex-col justify-between relative min-h-[160px]">
                {project.canvas}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
