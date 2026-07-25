import React, { useState, useEffect } from 'react';
import { Package, Upload, ArrowLeft, Gem, Tag, IndianRupee } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import { ShopSettings } from '@/lib/firestore/shopSettings';
import { addProduct } from '@/lib/firestore/products';
import { getShopById } from '@/lib/firestore/products'; // Actually, getShopById is in products.ts
import { Shop } from '@/types/gold-hub';

const CATEGORIES: Record<string, string[]> = {
  "Neck Jewellery": ["Necklace", "Short Necklace", "Long Necklace", "Choker", "Mangalsutra", "Locket", "Ranihaar", "Sita Haar", "Other"],
  "Hand Jewellery": ["Bangles", "Bracelets", "Kadas", "Armlet (Bajuband)", "Other"],
  "Ear Jewellery": ["Earrings", "Jhumkas", "Studs", "Hoops", "Drops", "Kan Chain", "Other"],
  "Head & Hair": ["Maang Tikka", "Matha Patti", "Hair Pin", "Other"],
  "Waist & Foot": ["Kamarbandh", "Anklets (Payal)", "Toe Rings", "Other"],
  "Rings": ["Engagement Ring", "Casual Ring", "Cocktail Ring", "Couple Bands", "Other"],
  "Coins & Bars": ["Gold Coin", "Silver Coin", "Gold Bar", "Silver Bar"],
  "Other": ["Other"]
};

interface UploadProductProps {
  settings: ShopSettings | null;
  shopId: string;
  onCancel: () => void;
  onSuccess: () => void;
  isAdmin?: boolean;
}

export default function UploadProduct({ settings, shopId, onCancel, onSuccess, isAdmin = false }: UploadProductProps) {
  const [uploading, setUploading] = useState(false);
  const [shop, setShop] = useState<Shop | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Neck Jewellery");
  const [subCategory, setSubCategory] = useState("Necklace");
  const [customName, setCustomName] = useState("");
  
  const [metalId, setMetalId] = useState(settings?.metals[0]?.id || "");
  const [chargeId, setChargeId] = useState(settings?.makingCharges[0]?.id || "");
  const [weight, setWeight] = useState("");
  
  const [hasStones, setHasStones] = useState(false);
  const [stoneType, setStoneType] = useState("");
  const [stoneWeight, setStoneWeight] = useState("");
  const [stonePrice, setStonePrice] = useState("");

  const [images, setImages] = useState<string[]>(['', '', '', '']);
  const [youtubeShortUrl, setYoutubeShortUrl] = useState("");

  // Dynamic Price Calc
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  useEffect(() => {
    if (!settings || !weight) {
      setEstimatedPrice(0);
      return;
    }
    const metal = settings.metals.find(m => m.id === metalId);
    const charge = settings.makingCharges.find(c => c.id === chargeId);
    
    if (metal && weight) {
      const w = parseFloat(weight);
      const baseValue = metal.rate * w;
      let makingValue = 0;
      if (charge?.type === 'percentage') makingValue = baseValue * (charge.value / 100);
      else if (charge?.type === 'per_gram') makingValue = w * charge.value;
      else if (charge?.type === 'flat') makingValue = charge.value;
      
      let stoneV = 0;
      if (hasStones && stonePrice) {
        stoneV = parseFloat(stonePrice);
      }

      const total = baseValue + makingValue + stoneV;
      const gst = total * ((settings.gstRate || 3) / 100);
      setEstimatedPrice(Math.round(total + gst));
    }
  }, [metalId, chargeId, weight, hasStones, stonePrice, settings]);

  useEffect(() => {
    if (shopId) {
      if (shopId === 'PLATFORM') {
        setShop({ 
          id: 'PLATFORM', 
          name: 'Gold Dunia Official', 
          autoApproveProducts: true, 
          location: { district: 'Headquarters', state: 'Odisha', country: 'India' } 
        } as any);
      } else {
        getShopById(shopId).then(setShop);
      }
    }
  }, [shopId]);

  const handleImageChange = (index: number, url: string) => {
    const newImgs = [...images];
    newImgs[index] = url;
    setImages(newImgs);
  };

  const handleUpload = async () => {
    const validImages = images.filter(img => img !== '');
    if (validImages.length < 4) {
      alert("Please upload at least 4 high-quality images of the product.");
      return;
    }
    if (!title || !weight || !metalId || !chargeId) {
      alert("Please fill all required fields.");
      return;
    }

    setUploading(true);
    try {
      const designName = subCategory === 'Other' ? customName : subCategory;
      const newProd = {
        shopId,
        categoryId: category,
        subcategoryId: subCategory,
        designName,
        customDesignName: customName,
        title,
        description,
        metalPurityId: metalId,
        makingChargeId: chargeId,
        images: validImages,
        youtubeShortUrl: youtubeShortUrl.trim() || undefined,
        price: estimatedPrice, // Saving base estimated price
        weightGrams: parseFloat(weight),
        stoneDetails: hasStones ? {
          hasStones,
          type: stoneType,
          price: parseFloat(stonePrice) || 0,
          weightGrams: parseFloat(stoneWeight) || 0
        } : { hasStones: false },
        status: (isAdmin || shop?.autoApproveProducts) ? 'active' as const : 'pending' as const,
        shopName: shop?.name,
        country: shop?.location?.country,
        state: shop?.location?.state,
        district: shop?.location?.district,
      };

      await addProduct(newProd);
      onSuccess();
    } catch (e) {
      console.error(e);
      alert("Failed to upload product.");
    } finally {
      setUploading(false);
    }
  };

  const handleNextStep = () => {
    if (!title || !weight || !metalId || !chargeId) {
      alert("Please fill all required fields before proceeding.");
      return;
    }
    setCurrentStep(2);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={currentStep === 2 ? () => setCurrentStep(1) : onCancel} className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-100 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Upload New Product</h2>
            <p className="text-gray-500 text-xs md:text-sm">Step {currentStep} of 2: {currentStep === 1 ? 'Product Details' : 'Media & Pricing'}</p>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="hidden sm:flex gap-2">
          <div className={`h-2 w-12 rounded-full ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`h-2 w-12 rounded-full ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        </div>
      </div>

      <div className="p-6 md:p-8">
        
        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Section 1: Basic Info */}
            <section className="space-y-4">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 border-b pb-2">
                <Package className="w-5 h-5 text-blue-600" /> 1. Product Identity
              </h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Gold Jewellery Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. 22K Antique Temple Choker Necklace"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Gold Jewellery Description</label>
                <textarea 
                  rows={3}
                  placeholder="Describe the craftsmanship, style, and occasions it suits..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Primary Category *</label>
                  <select 
                    value={category} 
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setSubCategory(CATEGORIES[e.target.value][0]);
                    }}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {Object.keys(CATEGORIES).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Sub Category / Design Name *</label>
                  <select 
                    value={subCategory} 
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {CATEGORIES[category].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {subCategory === "Other" && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Custom Design Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Pahanchi, Painri, etc."
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              )}
            </section>

            {/* Section 2: Pricing Mapping & Materials */}
            <section className="space-y-4">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 border-b pb-2">
                <Tag className="w-5 h-5 text-blue-600" /> 2. Material & Price Mapping
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Net Weight (Grams) *</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="0.000"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <span className="text-gray-500 font-bold bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">g</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Metal Purity *</label>
                  <select 
                    value={metalId} 
                    onChange={(e) => setMetalId(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {settings?.metals.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                    {settings?.metals.length === 0 && <option value="">No metals defined in Pricing Engine</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Making Charge Category *</label>
                  <select 
                    value={chargeId} 
                    onChange={(e) => setChargeId(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {settings?.makingCharges.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.type === 'percentage' ? c.value + '%' : c.type === 'per_gram' ? '₹' + c.value + '/g' : '₹' + c.value})</option>
                    ))}
                    {settings?.makingCharges.length === 0 && <option value="">No charges defined in Pricing Engine</option>}
                  </select>
                </div>
              </div>
            </section>

            {/* Section 3: Stones */}
            <section className="space-y-4">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 border-b pb-2">
                <Gem className="w-5 h-5 text-blue-600" /> 3. Stones & Kundan (Optional)
              </h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={hasStones}
                  onChange={e => setHasStones(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-700">This item contains precious stones, kundan, or polki.</span>
              </label>

              {hasStones && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Stone Type</label>
                    <input type="text" placeholder="e.g. Diamond, Kundan" value={stoneType} onChange={e => setStoneType(e.target.value)} className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Total Stone Price (₹)</label>
                    <input type="number" placeholder="Total Cost" value={stonePrice} onChange={e => setStonePrice(e.target.value)} className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Stone Weight (g)</label>
                    <input type="number" placeholder="Net Stone Wt" value={stoneWeight} onChange={e => setStoneWeight(e.target.value)} className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              )}
            </section>

            <div className="pt-6 border-t border-gray-200 flex justify-end">
              <button 
                onClick={handleNextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                Next Step: Media & Pricing <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" /> Upload Images
                </h3>
                {process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY && (
                  <button type="button" className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded border border-purple-200 flex items-center gap-1 hover:bg-purple-200 transition-colors">
                    ✨ AI BG Removal
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-6">Minimum 4 images required. High quality, well-lit photos increase sales.</p>
              
              <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2, 3].map(index => (
                  <div key={index} className={`bg-white rounded-xl border-2 border-dashed border-gray-300 relative group ${images[index] ? 'aspect-square overflow-hidden' : 'h-full min-h-[300px]'}`}>
                    {images[index] ? (
                      <>
                        <img src={images[index]} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => handleImageChange(index, '')}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-widest text-xs"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <div className="absolute inset-0">
                        <ImageUploader 
                          value=""
                          onChange={(url) => handleImageChange(index, url)}
                          aspectRatio="portrait"
                          label={`Image ${index + 1}`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-red-500 text-lg leading-none">▶</span> YouTube Shorts URL <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                </label>
                <input 
                  type="url" 
                  placeholder="https://youtube.com/shorts/..."
                  value={youtubeShortUrl}
                  onChange={e => setYoutubeShortUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 bg-white text-sm"
                />
              </div>
            </div>

            <div className="bg-[#001D4A] rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-4 font-serif text-[#C5A059]">Live Price Estimate</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-sm text-blue-100">
                  <div className="flex justify-between border-b border-blue-800/50 pb-2">
                    <span>Gold Value:</span>
                    <span>Depends on live MCX rate</span>
                  </div>
                  <div className="flex justify-between border-b border-blue-800/50 pb-2">
                    <span>Making Charges:</span>
                    <span>Auto-calculated</span>
                  </div>
                  {hasStones && (
                    <div className="flex justify-between border-b border-blue-800/50 pb-2">
                      <span>Stone Value:</span>
                      <span>₹{parseFloat(stonePrice || "0").toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between pb-2">
                    <span>GST (3%):</span>
                    <span>Auto-calculated</span>
                  </div>
                </div>
                <div className="bg-black/30 rounded-xl p-6 flex flex-col justify-center items-center text-center border border-blue-800">
                  <span className="text-sm text-gray-400 uppercase tracking-widest block mb-2">Estimated Total</span>
                  <span className="flex items-center justify-center text-[#C5A059] text-3xl font-bold font-mono">
                    <IndianRupee className="w-8 h-8 mr-1" />
                    {estimatedPrice > 0 ? estimatedPrice.toLocaleString() : "---"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col md:flex-row gap-4 justify-between">
              <button 
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-bold transition-colors"
              >
                Back to Details
              </button>
              
              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 max-w-md bg-[#C5A059] hover:bg-[#a6864a] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors disabled:opacity-50 text-lg tracking-wide"
              >
                {uploading ? "Publishing..." : "Publish Product"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
