import React, { ReactNode } from 'react';
import ConstrainedHero from './ConstrainedHero';

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

  return (
    <div className={`w-full ${className}`}>
      <ConstrainedHero
        titleStart={
          <span className={`${uppercaseTitle ? 'uppercase' : 'capitalize'}`}>
            {title}
          </span>
        }
        subtitle={subtitle}
        desktopBgImage={imagePath}
        mobileBgImage={finalMobileImagePath}
        align={textAlignment}
      >
        <div className="flex flex-col gap-4">
          {children && (
            <div className="text-gray-300 font-light tracking-wide bg-white/5 backdrop-blur-md border border-white/10 p-6 md:px-8 md:py-6 rounded-2xl shadow-xl">
              {children}
            </div>
          )}
          {rightContent && (
            <div className="w-full mt-4">
              {rightContent}
            </div>
          )}
        </div>
      </ConstrainedHero>
    </div>
  );
}
