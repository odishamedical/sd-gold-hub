import React, { ReactNode } from 'react';
import Image from 'next/image';

interface PremiumPageHeroProps {
  title: string;
  subtitle?: string;
  imagePath: string;
  mobileImagePath?: string;
  className?: string;
  children?: ReactNode;
  rightContent?: ReactNode;
  imageAlignment?: 'left' | 'center' | 'right';
  textAlignment?: 'left' | 'center' | 'right';
  uppercaseTitle?: boolean;
  overlayStyle?: 'full' | 'text-side' | 'light' | 'none';
}

export default function PremiumPageHero({
  title,
  subtitle,
  imagePath,
  mobileImagePath,
  className = '',
  children,
  rightContent,
  imageAlignment = 'center',
  textAlignment = 'left',
  uppercaseTitle = false,
  overlayStyle = 'text-side'
}: PremiumPageHeroProps) {
  const finalMobileImagePath = mobileImagePath || imagePath;

  const getObjectPosition = () => {
    switch (imageAlignment) {
      case 'left': return 'object-left';
      case 'right': return 'object-right';
      default: return 'object-center';
    }
  };

  const getOverlayGradient = () => {
    switch (overlayStyle) {
      case 'full': return 'bg-gradient-to-r from-[#1A0B0C]/80 via-[#1A0B0C]/40 to-[#1A0B0C]/80';
      case 'text-side': return textAlignment === 'right' ? 'bg-gradient-to-l from-[#1A0B0C]/90 via-[#1A0B0C]/30 to-transparent' : 'bg-gradient-to-r from-[#1A0B0C]/90 via-[#1A0B0C]/30 to-transparent';
      case 'light': return 'bg-[#1A0B0C]/20';
      case 'none': return '';
      default: return 'bg-gradient-to-r from-[#1A0B0C]/80 via-[#1A0B0C]/40 to-[#1A0B0C]/80';
    }
  };

  const getTextAlignClass = () => {
    switch (textAlignment) {
      case 'center': return 'items-center text-center';
      case 'right': return 'items-end text-right';
      default: return 'items-start text-left';
    }
  };

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {/* Desktop Image */}
        <div className="hidden md:block relative w-full h-full">
          <Image
            src={imagePath}
            alt={title}
            fill
            className={`object-cover ${getObjectPosition()}`}
            priority
          />
        </div>
        {/* Mobile Image */}
        <div className="block md:hidden relative w-full h-full">
          <Image
            src={finalMobileImagePath}
            alt={title}
            fill
            className="object-cover object-top"
            priority
          />
        </div>
        {/* Overlay */}
        <div className={`absolute inset-0 ${getOverlayGradient()}`} />
      </div>

      {/* Content Container */}
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col md:flex-row ${textAlignment === 'center' ? 'justify-center' : 'justify-between'} gap-8`}>
        
        <div className={`flex flex-col ${getTextAlignClass()} ${rightContent ? 'w-full md:w-2/3' : 'w-full md:max-w-3xl'}`}>
          {/* Title Block with Glow */}
          <div className="relative">
            <div className={`absolute -inset-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/30 via-transparent to-transparent blur-xl rounded-full ${textAlignment === 'center' ? 'mx-auto' : ''}`} />
            
            <h1 className={`relative text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-wider ${uppercaseTitle ? 'uppercase' : 'capitalize'} mb-6`} style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              {title}
            </h1>
          </div>

          {(subtitle || children) && (
            <div className={`text-gray-300 font-light tracking-wide bg-white/5 backdrop-blur-md border border-white/10 p-6 md:px-8 md:py-6 rounded-2xl shadow-xl flex flex-col gap-4 w-full`}>
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
