import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function Hero3DPhoto({
  src = '/images/hero_banner.jpg',
  alt = 'Citizens, students and engineers collaborating for civic development',
  className = ''
}) {
  const containerRef = useRef(null);
  const [coords, setCoords] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const requestRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    // Calculate normalized offsets (-1 to 1)
    const normX = (x / width - 0.5) * 2;
    const normY = (y / height - 0.5) * 2;

    // Tilt limits in degrees
    const maxTilt = 13;
    const targetRotateY = normX * maxTilt;
    const targetRotateX = -normY * maxTilt;

    // Glare coordinates in percentages
    const glareX = (x / width) * 100;
    const glareY = (y / height) * 100;

    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(() => {
      setCoords({
        rotateX: Number(targetRotateX.toFixed(2)),
        rotateY: Number(targetRotateY.toFixed(2)),
        glareX: Number(glareX.toFixed(1)),
        glareY: Number(glareY.toFixed(1))
      });
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(() => {
      setCoords({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
    });
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Compute dynamic 3D shadow shifting counter to tilt
  const shadowX = isHovered ? -coords.rotateY * 2.4 : 0;
  const shadowY = isHovered ? coords.rotateX * 2.4 + 20 : 12;
  const shadowBlur = isHovered ? 40 : 24;
  const shadowSpread = isHovered ? -4 : -6;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none ${className}`}
      style={{
        perspective: '1200px',
      }}
    >
      {/* 3D Transform Card Container */}
      <div
        className="relative rounded-xl overflow-hidden transition-all ease-out cursor-pointer"
        style={{
          transform: isHovered
            ? `rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg) scale3d(1.025, 1.025, 1.025)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
          transitionDuration: isHovered ? '120ms' : '600ms',
          boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px rgba(18, 59, 103, 0.28), 0 10px 22px -6px rgba(0, 0, 0, 0.12)`,
          border: '1px solid rgba(217, 228, 237, 0.85)',
          background: '#FFFFFF'
        }}
      >
        {/* Base Hero Photo */}
        <img
          src={src}
          alt={alt}
          className="w-full h-[260px] sm:h-[340px] lg:h-[370px] object-cover object-center block"
          style={{
            transform: 'translateZ(0px)',
          }}
        />

        {/* Soft edge tint overlay to harmonize with portal palette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#123B67]/25 via-transparent to-transparent pointer-events-none"></div>

        {/* Dynamic Specular 3D Glare Sheen that follows mouse coordinates */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.85 : 0,
            background: `radial-gradient(circle 380px at ${coords.glareX}% ${coords.glareY}%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 80%)`,
            mixBlendMode: 'overlay',
            transform: 'translateZ(15px)',
          }}
        />

        {/* Floating 3D Badge 1 (Pops out in 3D Space) */}
        <div
          className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 pointer-events-none transition-transform duration-200"
          style={{
            transform: isHovered ? 'translateZ(38px)' : 'translateZ(10px)',
          }}
        >
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#D9E4ED] shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
            <span className="text-[11px] sm:text-xs font-semibold text-[#123B67] tracking-tight flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#2F6FA8]" />
              SIH 2026 • AI Problem Solving
            </span>
          </div>
        </div>

        {/* Floating 3D Badge 2 (Top-right pill on hover) */}
        <div
          className="hidden sm:flex absolute top-3 left-3 z-20 pointer-events-none transition-all duration-300"
          style={{
            transform: isHovered ? 'translateZ(30px)' : 'translateZ(5px)',
            opacity: isHovered ? 1 : 0.85
          }}
        >
          <div className="flex items-center gap-1.5 bg-[#123B67]/90 text-white backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-medium shadow-sm">
            <Sparkles size={12} className="text-[#F58220]" />
            <span>Interactive 3D View</span>
          </div>
        </div>

        {/* Subtle 3D Glass Perimeter Rim */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/40"
          style={{
            transform: 'translateZ(20px)',
          }}
        />
      </div>
    </div>
  );
}
