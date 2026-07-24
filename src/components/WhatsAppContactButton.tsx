'use client';

import React from 'react';
import { useCustomer } from '@/context/CustomerContext';
import { logInquiry } from '@/lib/firestore/inquiries';

export default function WhatsAppContactButton({ shop, product }: { shop: any, product: any }) {
  const { requireCompleteProfile, profile } = useCustomer();

  const handleContact = () => {
    requireCompleteProfile(async () => {
      // Log the inquiry
      if (profile) {
        await logInquiry({
          shopId: shop.id,
          customerId: profile.id,
          customerName: profile.name,
          customerPhone: profile.whatsapp || profile.phone || '',
          customerCity: profile.block || '',
          productId: product.id,
          productName: product.title,
          source: 'whatsapp'
        });
      }

      const message = `Hello ${shop.name}, I am interested in purchasing the ${product.designName} (HUID: ${product.huid || 'Not specified'}). Can you confirm availability?`;
      const whatsappUrl = `https://wa.me/${shop.whatsappNumber || shop.phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  };

  return (
    <button 
      onClick={handleContact}
      className="w-full py-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl flex items-center justify-center gap-2"
    >
      Contact on WhatsApp
    </button>
  );
}
