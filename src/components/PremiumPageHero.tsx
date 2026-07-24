import React, { ReactNode } from 'react';
import Image from 'next/image';

interface PremiumPageHeroProps {
  title: string;
  subtitle?: string;
  imagePath: string;
  className?: string;
  children?: ReactNode;
  rightContent?: ReactNode;
}

export default function PremiumPageHero({
  title,
  subtitle,
  imagePath,
  className = '',
  children,
  rightContent
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

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className={`flex flex-col items-center md:items-start text-center md:text-left ${rightContent ? 'w-full md:w-2/3' : 'w-full'}`}>
          {/* Title Block with Glow */}
          <div className="relative">
            <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/30 via-transparent to-transparent blur-xl rounded-full" />
            
            <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-wider uppercase mb-6" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              {title}
            </h1>
          </div>

          {(subtitle || children) && (
            <div className={`text-gray-300 font-light tracking-wide bg-white/5 backdrop-blur-md border border-white/10 p-6 md:px-8 md:py-6 rounded-2xl shadow-xl flex flex-col gap-4 ${!rightContent && !children ? 'max-w-3xl mx-auto md:mx-0' : 'w-full max-w-3xl'}`}>
              {subtitle && <p className="text-lg md:text-xl">{subtitle}</p>}
              {children && <div>{children}</div>}
            </div>
          )}
        </div>

        {rightContent && (
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            {rightContent}
          </div>
        )}
        
      </div>
    </div>
  );
}
