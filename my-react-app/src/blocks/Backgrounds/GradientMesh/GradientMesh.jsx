import { useRef, useEffect } from "react";

export default function GradientMesh({
  colors = ["#0ea5e9", "#2563eb", "#4f46e5", "#7c3aed"],
  speed = 0.002,
  blur = 120
}) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const pointsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPoints();
    };

    const initPoints = () => {
      pointsRef.current = [];
      for (let i = 0; i < colors.length; i++) {
        pointsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed * 1000,
          vy: (Math.random() - 0.5) * speed * 1000,
          color: colors[i]
        });
      }
    };

    const draw = (time) => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      
      // Clear canvas with very subtle background
      ctx.fillStyle = "rgba(0, 0, 0, 0.99)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update points
      pointsRef.current.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off edges
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
      });

      // Draw gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );

      pointsRef.current.forEach((point, i) => {
        gradient.addColorStop(i / (pointsRef.current.length - 1), point.color);
      });

      ctx.filter = `blur(${blur}px)`;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';

      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [colors, speed, blur]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 0.5
      }}
    />
  );
} 