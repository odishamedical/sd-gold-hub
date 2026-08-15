"use client";

import React from "react";
import Image from "next/image";

interface ConstrainedHeroProps {
  titleStart: React.ReactNode;
  highlight?: React.ReactNode;
  titleEnd?: React.ReactNode;
  subtitle: React.ReactNode;
  brandTag?: React.ReactNode;
  desktopBgImage: string;
  mobileBgImage: string;
  children?: React.ReactNode;
  align?: "left" | "center" | "right";
}

export default function ConstrainedHero({
  titleStart,
  highlight,
  titleEnd,
  subtitle,
  brandTag,
  desktopBgImage,
  mobileBgImage,
  children,
  align = "right"
}: ConstrainedHeroProps) {
  
  // Alignment classes for text wrapping container
  let alignClasses = "items-end md:text-right";
  if (align === "left") alignClasses = "items-start md:text-left";
  else if (align === "center") alignClasses = "items-center md:text-center";

  // Position classes for the content box inside the flex parent
  let horizontalAlignClasses = "md:items-end";
  if (align === "left") horizontalAlignClasses = "md:items-start";
  else if (align === "center") horizontalAlignClasses = "md:items-center";

  return (
    <section className="relative z-10 w-full px-4 md:px-8 pt-32 pb-12 flex justify-center min-h-[55vh] md:min-h-0 bg-[#060A14]">
      {/* The Constrained Widescreen Hero Container (21:9 PC) & Auto-height Content (Mobile) */}
      <div className={`relative w-full max-w-[1600px] aspect-auto md:aspect-[21/9] rounded-[40px] shadow-[0_20px_50px_-10px_rgba(212,175,55,0.15)] border border-white/10 flex flex-col md:justify-center ${horizontalAlignClasses} bg-black/40 md:bg-transparent overflow-hidden`}>
        
        {/* Mobile Inline Image (Visible ONLY on mobile, sits at the top of the card) */}
        <div className="w-full relative aspect-[4/3] block md:hidden shrink-0">
          <Image 
            src={mobileBgImage}
            alt="Hero Background Mobile"
            fill
            priority
            quality={90}
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-black/40 to-transparent"></div>
        </div>

        {/* PC Background Layer (Visible ONLY on PC) */}
        <div className="absolute inset-0 z-0 hidden md:block">
          <div className="absolute inset-0 z-0">
            <Image 
              src={desktopBgImage}
              alt="Hero Background"
              fill
              priority
              quality={90}
              className="object-cover object-center"
            />
          </div>
          {/* Subtle gradient to ensure text readability while preserving the luxury aesthetic */}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        </div>

        {/* Text & Search Content */}
        <div className={`relative z-10 flex flex-col w-full ${align === "center" ? "md:w-full" : "md:w-[60%] lg:w-[50%]"} p-6 md:p-12 lg:p-16 custom-scrollbar ${alignClasses}`}>
          <div className={`flex flex-col mb-8 ${alignClasses}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#DDA7A5] via-[#E5C158] to-[#D4AF37] font-bold tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-3 leading-tight">
              {titleStart} <span className="text-white">{highlight}</span> {titleEnd}
            </h1>
            <h2 className="text-lg md:text-xl text-white/90 font-light tracking-[0.2em] uppercase mb-2 drop-shadow-md">
              {subtitle}
            </h2>
            {brandTag && (
              <p className="text-sm md:text-base text-gray-400 font-light tracking-widest">
                {brandTag}
              </p>
            )}
          </div>
          
          <div className="w-full max-w-xl">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
