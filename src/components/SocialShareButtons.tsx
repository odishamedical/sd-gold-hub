"use client";

import React, { useState, useEffect } from "react";

interface SocialShareButtonsProps {
  productName: string;
  className?: string;
}

export default function SocialShareButtons({ productName, className = "" }: SocialShareButtonsProps) {
  const [userUid, setUserUid] = useState<string>("sd_super_admin_custom_uid");

  useEffect(() => {
    const uid = localStorage.getItem("sd_current_user_uid") || "sd_super_admin_custom_uid";
    setUserUid(uid);
  }, []);

  const handleShare = (platform: "whatsapp" | "facebook", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/product?ref=${userUid}&item=${encodeURIComponent(productName.toLowerCase().replace(/\s+/g, "-"))}`;
    const message = `Explore the magnificent 22K/24K hallmarked ${productName} directly from verified flagship jewelers on Shyam Dash Gold Hub! ${shareUrl}`;

    if (platform === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
    }
  };

  return (
    <div className={`flex items-center gap-2 mt-3 z-30 ${className}`}>
      {/* WhatsApp Share Button - Vibrant Emerald Green */}
      <button 
        onClick={(e) => handleShare("whatsapp", e)}
        title="Share to WhatsApp (Affiliate Tracked)"
        className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#128C7E] to-[#25D366] text-white px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_15px_rgba(37,211,102,0.3)] border border-[#25D366]/40 cursor-pointer"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.245 3.481 5.231 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.859c1.619.96 3.46 1.468 5.352 1.468 5.435-.002 9.851-4.418 9.853-9.853.001-2.635-1.023-5.114-2.885-6.976-1.862-1.863-4.341-2.888-6.977-2.887-5.435.002-9.851 4.418-9.853 9.853-.001 1.932.508 3.81 1.472 5.441l-1.002 3.659 3.754-.985zm9.588-6.353c-.524-.262-3.098-1.53-3.578-1.705-.48-.175-.83-.262-1.18.262-.35.524-1.355 1.705-1.66 2.055-.306.35-.612.394-1.136.131-.524-.262-2.213-.816-4.215-2.603-1.558-1.39-2.609-3.109-2.915-3.633-.306-.524-.033-.808.23-.107.235.262.524.524.787.787.262.262.35.524.525.875.175.35.087.656-.044.919-.131.262-1.18 2.844-1.617 3.894-.426.102-.853.088-1.18-.175-.382-.306-.382-.787-.382-.787v-.001c0-1.662 1.348-3.01 3.01-3.01h.001c1.237 0 2.308.75 2.771 1.832.22-.163.454-.316.702-.456.623-.35 1.312-.533 2.02-.533 2.321 0 4.209 1.888 4.209 4.209 0 .445-.07.88-.204 1.295-.401 1.248-1.576 2.148-2.956 2.148-.225 0-.447-.024-.664-.071z"/>
        </svg>
        <span>WhatsApp</span>
      </button>

      {/* Facebook Share Button - Vibrant Royal Blue */}
      <button 
        onClick={(e) => handleShare("facebook", e)}
        title="Share to Facebook (Affiliate Tracked)"
        className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#1877F2] to-[#0C58C6] text-white px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_15px_rgba(24,119,242,0.3)] border border-[#1877F2]/40 cursor-pointer"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        <span>Facebook</span>
      </button>
    </div>
  );
}
