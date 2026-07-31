import React, { useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import { Download, X, Share2 } from 'lucide-react';
import { Product } from '@/types/gold-hub';

interface SocialMediaPostGeneratorProps {
  product: Product;
  shopName: string;
  shopId: string; // Used for vanity URL
  indicativePrice: number;
  onClose: () => void;
}

export default function SocialMediaPostGenerator({ product, shopName, shopId, indicativePrice, onClose }: SocialMediaPostGeneratorProps) {
  const postRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!postRef.current) return;
    setIsGenerating(true);
    
    try {
      const dataUrl = await htmlToImage.toPng(postRef.current, {
        quality: 1.0,
        pixelRatio: 2 // High resolution for social media
      });
      
      const link = document.createElement('a');
      link.download = `${shopName}-product-${product.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Oops, something went wrong!', err);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900/50">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#D4AF37]" /> Social Media Kit
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center">
          <p className="text-gray-400 text-sm text-center mb-6">Preview of your post. Click download to save the high-resolution image for Instagram or WhatsApp.</p>
          
          {/* The Actual Post Template to be rendered to Image */}
          {/* We scale it down visually for the modal, but it captures at actual size */}
          <div className="w-full max-w-[350px] shadow-2xl relative bg-black rounded-xl overflow-hidden group">
            
            <div 
              ref={postRef}
              className="w-[1080px] h-[1080px] origin-top-left flex flex-col bg-gradient-to-br from-black via-gray-900 to-[#1a1405] relative overflow-hidden"
              style={{ transform: 'scale(0.324)', marginBottom: '-730px' }} // Scale down for preview
            >
              {/* Background Decorative Elements */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/3"></div>

              {/* Header Branding */}
              <div className="pt-16 px-16 flex justify-between items-start z-10">
                <div>
                  <h2 className="text-[#D4AF37] font-serif text-5xl font-bold tracking-wider uppercase drop-shadow-md">
                    {shopName}
                  </h2>
                  <p className="text-white/60 text-2xl font-mono mt-2 tracking-widest uppercase">Premium Jewellery</p>
                </div>
                <div className="w-24 h-24 rounded-full border-2 border-[#D4AF37]/50 flex items-center justify-center bg-black/50 backdrop-blur-md">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] rounded-full"></div>
                </div>
              </div>

              {/* Product Showcase */}
              <div className="flex-1 flex flex-col items-center justify-center z-10 px-16">
                <div className="w-full h-[550px] rounded-[40px] overflow-hidden border-4 border-[#D4AF37]/20 shadow-[0_0_50px_rgba(212,175,55,0.15)] relative bg-gray-900">
                  <img 
                    src={product.images?.[0] || 'https://placehold.co/1080x1080?text=Jewellery'} 
                    alt={product.title}
                    className="w-full h-full object-cover object-center"
                    crossOrigin="anonymous" // Important for html2canvas
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                     <div>
                       <p className="text-[#D4AF37] font-bold text-2xl tracking-widest uppercase mb-1">
                         {product.metalPurityId || '22K'} Gold
                       </p>
                       <h3 className="text-white text-4xl font-bold max-w-[500px] truncate leading-tight">
                         {product.title}
                       </h3>
                     </div>
                     <div className="bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 px-6 py-4 rounded-2xl text-right">
                       <p className="text-white/70 text-xl font-medium uppercase tracking-wider mb-1">Live Price</p>
                       <p className="text-[#D4AF37] text-4xl font-bold">₹{indicativePrice > 0 ? indicativePrice.toLocaleString() : "Contact Us"}</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Footer CTA & Platform Branding */}
              <div className="pb-16 px-16 flex justify-between items-end z-10 mt-12">
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-8 py-5 rounded-2xl backdrop-blur-md">
                  <p className="text-white/90 text-2xl font-medium mb-1">View collection & live rates at:</p>
                  <p className="text-[#D4AF37] text-3xl font-bold tracking-wide">golddunia.com/shop/{shopId}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-xl font-medium uppercase tracking-widest mb-2">Powered By</p>
                  <p className="text-white font-bold text-3xl tracking-wider flex items-center justify-end gap-3">
                    <span className="text-[#D4AF37] text-4xl">GD</span> GOLD DUNIA
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900/80 backdrop-blur-md flex justify-end">
          <button 
            onClick={handleDownload}
            disabled={isGenerating}
            className="bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:from-[#E5C158] hover:to-[#C08A27] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            {isGenerating ? 'Generating...' : <><Download className="w-5 h-5" /> Download Post</>}
          </button>
        </div>
      </div>
    </div>
  );
}
