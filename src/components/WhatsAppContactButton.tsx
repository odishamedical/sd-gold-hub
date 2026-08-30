'use client';

import React from 'react';
import { useCustomer } from '@/context/CustomerContext';
import { logInquiry } from '@/lib/firestore/inquiries';
import { Phone, MessageCircle } from 'lucide-react';

export default function WhatsAppContactButton({ shop, product, skuCode }: { shop: any, product: any, skuCode?: string }) {
  const { requireCompleteProfile, profile } = useCustomer();

  const handleWhatsApp = () => {
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

      const message = `Hello ${shop.name}, I am interested in purchasing the ${product.designName}${skuCode ? ` (Ref: ${skuCode})` : ''}. Can you confirm availability?`;
      const whatsappUrl = `https://wa.me/${shop.whatsappNumber || shop.phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  };

  const handleCall = () => {
    // Log asynchronously if logged in, but don't block the call
    if (profile) {
      logInquiry({
        shopId: shop.id,
        customerId: profile.id,
        customerName: profile.name,
        customerPhone: profile.whatsapp || profile.phone || '',
        customerCity: profile.block || '',
        productId: product.id,
        productName: product.title,
        source: 'phone_call'
      }).catch(console.error);
    }
    window.open(`tel:${shop.phone || shop.whatsappNumber}`, '_self');
  };

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
      <button 
        onClick={handleCall}
        className="w-full py-3 md:py-4 rounded-xl bg-[#0A1021] border border-[#C5A059]/50 text-[#C5A059] text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#0A1021] transition-all shadow-xl flex items-center justify-center gap-2"
      >
        <Phone className="w-4 h-4 md:w-5 md:h-5" /> Call Shop
      </button>
      
      <button 
        onClick={handleWhatsApp}
        className="w-full py-3 md:py-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] text-xs md:text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-4 h-4 md:w-5 md:h-5" /> WhatsApp
      </button>
    </div>
  );
}
