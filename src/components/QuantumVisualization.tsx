import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

const QuantumVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      phase: number;
      frequency: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        phase: Math.random() * Math.PI * 2,
        frequency: Math.random() * 0.02 + 0.01,
      });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(11, 15, 25, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.phase += particle.frequency;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Quantum wave effect
        const wave = Math.sin(particle.phase) * 0.5 + 0.5;
        const alpha = wave * 0.8 + 0.2;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 221, 255, ${alpha})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const lineAlpha = (1 - distance / 100) * 0.3 * alpha;
            ctx.strokeStyle = `rgba(138, 43, 226, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <Card className="p-6 bg-gradient-space border-border overflow-hidden relative">
      <div className="mb-4 relative z-10">
        <h3 className="text-lg font-semibold text-foreground">Quantum State Visualization</h3>
        <p className="text-sm text-muted-foreground">Real-time probability field distribution</p>
      </div>
      
      <canvas 
        ref={canvasRef} 
        className="w-full h-64 rounded-lg"
        style={{ background: "rgba(11, 15, 25, 0.8)" }}
      />

      <div className="mt-4 grid grid-cols-3 gap-4 relative z-10">
        <div className="text-center">
          <div className="text-xl font-bold text-primary">Ψ(t)</div>
          <div className="text-xs text-muted-foreground">Wave Function</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-secondary">|Ψ|²</div>
          <div className="text-xs text-muted-foreground">Probability Density</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-accent">ΔE·Δt</div>
          <div className="text-xs text-muted-foreground">Uncertainty</div>
        </div>
      </div>
    </Card>
  );
};

export default QuantumVisualization;
