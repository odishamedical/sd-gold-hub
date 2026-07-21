'use client';

import React from 'react';
import { useCustomer } from '@/context/CustomerContext';

export default function FollowShopButton({ shopId }: { shopId: string }) {
  const { isShopFollowed, toggleFollowShop, profile, loginDemo } = useCustomer();
  const following = isShopFollowed(shopId);

  return (
    <button 
      onClick={() => {
        if (!profile) loginDemo();
        else toggleFollowShop(shopId);
      }}
      className={`px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-xs border transition-all ${
        following
          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
          : 'bg-transparent text-[#D4AF37] border-[#D4AF37] hover:bg-[#D4AF37]/10'
      }`}
    >
      {following ? 'Following' : '+ Follow Shop'}
    </button>
  );
}
