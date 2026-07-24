import React from 'react';
import Image from 'next/image';

interface PremiumPageHeroProps {
  title: string;
  subtitle?: string;
  imagePath: string;
  className?: string;
}

export default function PremiumPageHero({
  title,
  subtitle,
  imagePath,
  className = ''
}: PremiumPageHeroProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imagePath}
          alt={title}
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark / Tinted Overlay for readability and premium feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19]/90 via-[#0B0F19]/60 to-[#0B0F19]/90" />
      </div>

      {/* Content Container with Glassmorphism */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center justify-center text-center">
        
        {/* Title Block with Glow */}
        <div className="relative">
          <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/30 via-transparent to-transparent blur-xl rounded-full" />
          
          <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-wider uppercase mb-6" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
            {title}
          </h1>
        </div>

        {subtitle && (
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl font-light tracking-wide bg-white/5 backdrop-blur-md border border-white/10 px-8 py-4 rounded-2xl shadow-xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
