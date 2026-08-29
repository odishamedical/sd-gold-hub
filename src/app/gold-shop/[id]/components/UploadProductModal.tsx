import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import UploadProduct from '@/app/vendor/components/products/UploadProduct';
import { getShopSettings, ShopSettings } from '@/lib/firestore/shopSettings';

interface UploadProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: string;
  isAdmin: boolean;
  onSuccess: () => void;
  initialData?: any;
}

export default function UploadProductModal({ isOpen, onClose, shopId, isAdmin, onSuccess, initialData }: UploadProductModalProps) {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && shopId) {
      setLoading(true);
      getShopSettings(shopId)
        .then(setSettings)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, shopId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-[#060A14] border border-[#2A344A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Scrollable Body (Seamless) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          
          {/* Floating Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#C5A059]">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="font-mono text-sm tracking-widest uppercase">Loading Showroom Settings...</p>
            </div>
          ) : (
            <div className="upload-product-wrapper">
              <UploadProduct 
                settings={settings}
                shopId={shopId}
                onCancel={onClose}
                onSuccess={() => {
                  onSuccess();
                  onClose();
                }}
                isAdmin={isAdmin}
                initialData={initialData}
              />
            </div>
          )}
        </div>
      </div>

      {/* Scoped styles to force dark mode on the UploadProduct component since it might have been built for a white vendor dashboard */}
      <style dangerouslySetInnerHTML={{__html: `
        .upload-product-wrapper .bg-white { background-color: #0A1021 !important; border-color: #2A344A !important; }
        .upload-product-wrapper .text-gray-900 { color: #ffffff !important; }
        .upload-product-wrapper .text-gray-700 { color: #cbd5e1 !important; }
        .upload-product-wrapper .text-gray-500 { color: #94a3b8 !important; }
        .upload-product-wrapper .bg-gray-50 { background-color: #141C33 !important; }
        .upload-product-wrapper .border-gray-200 { border-color: #2A344A !important; }
        .upload-product-wrapper input, .upload-product-wrapper select, .upload-product-wrapper textarea { 
          background-color: #060A14 !important; 
          color: white !important;
          border-color: #2A344A !important;
        }
      `}} />
    </div>
  );
}
