import React from 'react';

interface AdBannerProps {
  className?: string;
  adSlot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
}

export default function AdBanner({ className = '', adSlot = '1234567890', format = 'auto' }: AdBannerProps) {
  return (
    <div className={`w-full overflow-hidden flex justify-center items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl relative group ${className}`}>
      {/* 
        This is a placeholder for Google AdSense. 
        In production, replace the div below with the actual <ins> tag provided by Google AdSense 
        and ensure the AdSense script is loaded in your layout.tsx or _document.tsx
      */}
      
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#DDA7A5]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
      
      <div className="py-6 text-center text-[#DDA7A5]/60 text-xs font-light tracking-[0.2em] uppercase">
        <span className="block mb-1">Advertisement</span>
        {/* Placeholder Ad Block */}
        <div className="w-[320px] md:w-[728px] h-[50px] md:h-[90px] mx-auto bg-black/20 rounded border border-[#DDA7A5]/20 flex items-center justify-center">
          <span className="opacity-50 text-[10px]">Ad Space ({adSlot})</span>
        </div>
      </div>
      
      {/* 
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"></ins>
      */}
    </div>
  );
}
