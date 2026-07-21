"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { addProduct } from '@/lib/db-hooks';
import DashboardLayout, { NavItem } from '@/components/DashboardLayout';

const VENDOR_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", category: "Dashboard & Reports" },
  { id: "products", label: "My Products", category: "Catalog & Inventory" },
  { id: "orders", label: "Customer Orders", category: "Orders & Logistics" },
  { id: "profile", label: "Store Profile", category: "Platform & System" }
];

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [userName, setUserName] = useState("Shop Vendor");
  const [userRole, setUserRole] = useState("vendor");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("sd_current_user_name");
      const storedRole = localStorage.getItem("sd_current_user_role");
      if (storedName) setUserName(storedName);
      if (storedRole) setUserRole(storedRole);
    }
  }, []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vendorGoldRate22K, setVendorGoldRate22K] = useState(6950);
  
  // Product Form State for Dynamic Calculation
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [weight, setWeight] = useState("");
  const [makingChargeType, setMakingChargeType] = useState("flat"); // "flat", "per_gram", "percentage"
  const [makingCharges, setMakingCharges] = useState("");
  
  // Gemstone / Diamond State
  const [gemstones, setGemstones] = useState<{name: string, price: number}[]>([]);
  const [newGemstoneName, setNewGemstoneName] = useState("");
  const [newGemstonePrice, setNewGemstonePrice] = useState("");
  const [isAddingGemstone, setIsAddingGemstone] = useState(false);

  // Category State
  const [primaryMaterial, setPrimaryMaterial] = useState("Gold");
  const [jewelryType, setJewelryType] = useState("");

  // AI Image State
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiEnhanced, setAiEnhanced] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setAiEnhanced(false); // reset AI flag if new custom image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  // Description State
  const [description, setDescription] = useState("");
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  // Inventory State
  const [productList, setProductList] = useState([
    {
      id: 1,
      title: "22K Lotus Necklace",
      sku: "IRA-NK-001",
      weight: "41.0 g",
      price: "₹ 2,98,400",
      status: "Active",
      stock: 4,
      image: "/diamond_necklace_luxury.png",
    },
    {
      id: 2,
      title: "Gold Lotus Earrings",
      sku: "IRA-ER-002",
      weight: "15.5 g",
      price: "₹ 1,18,500",
      status: "Out of Stock",
      stock: 0,
      image: "/hero-gold.png",
    }
  ]);

  // Calculate dynamic price based on Indian Market standard
  const calculateEstimatedPrice = () => {
    const w = parseFloat(weight) || 0;
    const mcValue = parseFloat(makingCharges) || 0;
    const goldValue = w * vendorGoldRate22K;
    
    // Calculate Stones
    const totalStonesValue = gemstones.reduce((sum, stone) => sum + stone.price, 0);
    
    let totalMakingCharge = 0;
    if (makingChargeType === "flat") {
      totalMakingCharge = mcValue;
    } else if (makingChargeType === "per_gram") {
      totalMakingCharge = mcValue * w;
    } else if (makingChargeType === "percentage") {
      totalMakingCharge = goldValue * (mcValue / 100);
    }

    const subtotal = goldValue + totalStonesValue + totalMakingCharge;
    const gst = subtotal * 0.03; // 3% GST standard in India
    
    return {
      goldValue: goldValue,
      stonesValue: totalStonesValue,
      makingCharge: totalMakingCharge,
      gst: gst,
      finalPrice: subtotal + gst
    };
  };

  const priceDetails = calculateEstimatedPrice();

  const handleAddGemstone = () => {
    if (newGemstoneName && newGemstonePrice) {
      setGemstones([...gemstones, { name: newGemstoneName, price: parseFloat(newGemstonePrice) }]);
      setNewGemstoneName("");
      setNewGemstonePrice("");
      setIsAddingGemstone(false);
    }
  };

  const simulateAiEnhancement = () => {
    setIsEnhancing(true);
    setTimeout(() => {
      setIsEnhancing(false);
      setAiEnhanced(true);
    }, 2000);
  };

  const simulateAiDescription = () => {
    setIsGeneratingDesc(true);
    setTimeout(() => {
      const stoneText = gemstones.length > 0 ? ` Adorned with exquisite ${gemstones.map(g => g.name).join(' and ')}, this masterpiece radiates elegance.` : "";
      const catText = jewelryType === "other" ? "custom jewelry piece" : jewelryType;
      const prodTitle = title || `${primaryMaterial} Masterpiece`;
      
      setDescription(`Experience the pinnacle of traditional craftsmanship with this exquisite ${weight ? weight + 'g ' : ''}${prodTitle} (${catText}).${stoneText} Meticulously handcrafted by our master artisans, this piece perfectly balances timeless heritage with modern luxury, making it an essential addition to your bridal or festive collection.`);
      setIsGeneratingDesc(false);
    }, 1500);
  };

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncProduct = async () => {
    if (!title) {
      alert("Please enter a Jewelry Name before syncing.");
      return;
    }

    setIsSyncing(true);
    
    const generatedSku = sku || `IRA-${primaryMaterial.toUpperCase().slice(0,2)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Prepare the payload to send to our Next.js API Bridge
    const productPayload = {
      title: title,
      sku: generatedSku,
      weight: weight,
      primaryMaterial: primaryMaterial,
      jewelryType: jewelryType,
      description: description,
      priceDetails: priceDetails,
      gemstones: gemstones,
      image: uploadedImage || (aiEnhanced ? "/diamond_necklace_luxury.png" : "/hero-gold.png")
    };

    try {
      await addProduct({
        ...productPayload,
        price: priceDetails.finalPrice.toString(),
        status: "approved",
        sellerId: "VENDOR_MOCK_ID",
      });

      // Add to live table state
      const newProductEntry = {
        id: Date.now(),
        title: title,
        sku: generatedSku,
        weight: `${weight || 0} g`,
        price: `₹ ${priceDetails.finalPrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}`,
        status: "Active",
        stock: 5,
        image: uploadedImage || (aiEnhanced ? "/diamond_necklace_luxury.png" : "/hero-gold.png"),
      };

      setProductList([newProductEntry, ...productList]);
      alert("Product Successfully Uploaded to Gold Hub Directory!");
      
      // Reset form
      setTitle("");
      setSku("");
      setWeight("");
      setMakingCharges("");
      setGemstones([]);
      setDescription("");
      setUploadedImage(null);
      setAiEnhanced(false);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Error uploading product.");
    } finally {
      setIsSyncing(false);
    }
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') return <div className="text-gray-600 text-center py-20">Dashboard Overview Coming Soon</div>;
    if (activeTab === 'orders') return <div className="text-gray-600 text-center py-20">Customer Orders Module Coming Soon</div>;
    if (activeTab === 'profile') return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Store Profile</h2>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-600 uppercase tracking-widest mb-2">Store Name</label>
            <input type="text" defaultValue={typeof window !== "undefined" ? localStorage.getItem("sd_current_user_name") || "" : ""} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#C5A059] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 uppercase tracking-widest mb-2">Store Description</label>
            <textarea rows={4} placeholder="Describe your shop's heritage and specialties..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#C5A059] outline-none"></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 uppercase tracking-widest mb-2">Contact Number</label>
            <input type="text" placeholder="Public Phone Number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#C5A059] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 uppercase tracking-widest mb-2">Banner Image</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <span className="text-gray-600">Click to upload store banner</span>
            </div>
          </div>
          <button className="bg-[#C5A059] text-[#0A1021] font-bold px-8 py-3 rounded-xl hover:bg-white transition-colors uppercase tracking-widest text-sm">
            Save Profile
          </button>
        </div>
      </div>
    );
    
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative max-w-7xl mx-auto w-full p-4 md:p-8">
      {/* Top Bar: Live Gold Rate Setting */}
      <div className="bg-gray-50 border border-[#C5A059]/50 rounded-xl p-4 mb-8 flex justify-between items-center shadow-[0_0_20px_rgba(197,160,89,0.15)]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/30">
            <svg className="w-5 h-5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">My Store's Live Gold Rate</h3>
            <p className="text-[10px] text-gray-600">All product prices will dynamically update based on this rate.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">22K:</span>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
              <input 
                type="number" 
                value={vendorGoldRate22K} 
                onChange={(e) => setVendorGoldRate22K(Number(e.target.value))}
                className="bg-[#0A1021] border border-gray-200 text-gray-900 text-sm rounded-lg pl-7 pr-3 py-2 w-32 focus:outline-none focus:border-[#C5A059] transition-colors font-bold"
              />
              <span className="absolute right-3 top-2.5 text-gray-500 text-[10px] uppercase">/gm</span>
            </div>
          </div>
          <button className="bg-[#C5A059] text-[#0A1021] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-white transition-colors">
            Update Rate
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#C5A059] tracking-wider mb-2">Jewelry Vault</h1>
          <p className="text-sm text-gray-600 uppercase tracking-widest">Manage your live products on the Shyam Dash Gold Hub.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#996515] to-[#C5A059] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-[#0A1021] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Add New Product
        </button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">💎</div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Live Products</p>
          <p className="text-3xl font-bold text-gray-900">{productList.length}</p>
          <p className="text-xs text-green-500 mt-2">+1 just now</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">🛍️</div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Sales</p>
          <p className="text-3xl font-bold text-gray-900">₹ 45.2L</p>
          <p className="text-xs text-green-500 mt-2">+12% from last month</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">⭐</div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Store Rating</p>
          <p className="text-3xl font-bold text-gray-900">4.9 / 5.0</p>
          <p className="text-xs text-gray-600 mt-2">Based on 128 reviews</p>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-[#0A1021]">
          <h2 className="text-lg font-bold text-gray-900 tracking-wider">Your Product Inventory</h2>
          <div className="flex gap-4">
             <input 
               type="text" 
               placeholder="Search by SKU or Name..." 
               className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg py-2 px-4 w-64 focus:outline-none focus:border-[#C5A059] transition-colors"
             />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">SKU</th>
                <th className="px-6 py-4 font-medium">Weight</th>
                <th className="px-6 py-4 font-medium">Auto Price (INR)</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A344A]">
              {productList.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-black overflow-hidden relative border border-gray-200">
                        <Image src={product.image} alt={product.title} fill className="object-cover" />
                      </div>
                      <span className="font-medium text-gray-900">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-600">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.weight}</td>
                  <td className="px-6 py-4 font-bold text-[#C5A059]">{product.price}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{product.stock} Units</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-600 hover:text-[#C5A059] transition-colors p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button className="text-gray-600 hover:text-red-500 transition-colors p-2 ml-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal Overlay */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0A1021] border border-[#C5A059]/30 rounded-2xl shadow-[0_0_50px_rgba(197,160,89,0.15)] w-full max-w-5xl overflow-hidden flex flex-col max-h-[95vh]">
            
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-xl font-serif text-[#C5A059] tracking-wider">Upload New Product</h3>
                <p className="text-xs text-gray-600 uppercase tracking-widest mt-1">Multi-Category & AI Enhancement Enabled</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-red-500/20 hover:border-red-500/50 border border-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Column: Image Upload & AI */}
                <div className="lg:col-span-5">
                  <div className="flex justify-between items-end mb-3">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-600">Product Images</label>
                    {aiEnhanced ? (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-green-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        AI Optimized
                      </span>
                    ) : (
                      <button 
                        onClick={simulateAiEnhancement}
                        disabled={isEnhancing}
                        className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 px-3 py-1 rounded-full border transition-all ${isEnhancing ? 'bg-gray-50 border-gray-200 text-[#C5A059] animate-pulse' : 'bg-[#C5A059]/10 border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/20'}`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        {isEnhancing ? 'Optimizing Background...' : '✨ AI Enhance'}
                      </button>
                    )}
                  </div>

                  <label htmlFor="jewelry-image-upload" className={`w-full aspect-[4/3] rounded-xl border-2 border-dashed ${aiEnhanced ? 'border-green-500/50 bg-green-500/5' : 'border-[#C5A059]/30 bg-gray-50/50'} flex flex-col items-center justify-center cursor-pointer hover:border-[#C5A059] hover:bg-gray-50 transition-colors group mb-4 relative overflow-hidden block`}>
                    <input type="file" id="jewelry-image-upload" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    {isEnhancing && (
                       <div className="absolute inset-0 bg-[#0A1021]/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                          <div className="w-10 h-10 border-4 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin mb-3"></div>
                          <span className="text-[10px] text-[#C5A059] uppercase tracking-widest font-bold">Removing Background & Correcting Lighting...</span>
                       </div>
                    )}
                    {uploadedImage ? (
                       <Image src={uploadedImage} alt="Uploaded preview" fill className="object-cover z-10" />
                    ) : (
                       <>
                         <div className="flex gap-2 mb-4">
                           <div className="w-12 h-12 rounded-full bg-[#0A1021] border border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg z-10">
                             <svg className="w-5 h-5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                           </div>
                         </div>
                         <span className="text-sm font-bold text-gray-900 mb-1">Click to Upload Photos</span>
                         <span className="text-[10px] text-gray-500 uppercase tracking-widest">Main Angle, Side Angle, Zoom-in</span>
                       </>
                    )}
                  </label>
                  
                  <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-4">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-2 flex justify-between">

                       <span>Dynamic Price Breakdown</span>
                       <span className="text-gray-900">₹ {priceDetails.finalPrice.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                     </h4>
                     <div className="space-y-2 text-xs text-gray-600 mt-3">
                        <div className="flex justify-between">
                           <span>Metal Value ({weight || "0"}g × ₹{vendorGoldRate22K})</span>
                           <span>₹ {priceDetails.goldValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                        </div>
                        {gemstones.map((stone, idx) => (
                          <div key={idx} className="flex justify-between text-[#C5A059]">
                             <span>+ {stone.name}</span>
                             <span>₹ {stone.price.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                           <span>Making Charges</span>
                           <span>₹ {priceDetails.makingCharge.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                           <span>Subtotal</span>
                           <span>₹ {(priceDetails.goldValue + priceDetails.stonesValue + priceDetails.makingCharge).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                        </div>
                        <div className="flex justify-between">
                           <span>GST (3%)</span>
                           <span>₹ {priceDetails.gst.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Right Column: Dynamic Form Details & Categories */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Tiered Categorization */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                      Storefront Categorization
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">1. Primary Material</label>
                        <select 
                          value={primaryMaterial}
                          onChange={(e) => setPrimaryMaterial(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C5A059] transition-colors appearance-none"
                        >
                          <option>Gold</option>
                          <option>Silver</option>
                          <option>Diamond</option>
                          <option>Platinum</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">2. Jewelry Type</label>
                        <select 
                          value={jewelryType}
                          onChange={(e) => setJewelryType(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C5A059] transition-colors appearance-none"
                        >
                          <option value="">Select Category...</option>
                          <option>Necklace - Short</option>
                          <option>Necklace - Bridal Long</option>
                          <option>Necklace - Choker</option>
                          <option>Bangles / Kangan</option>
                          <option>Earrings / Jhumka</option>
                          <option>Rings</option>
                          <option>Pendant Sets</option>
                          <option value="other">Other (Specify Custom...)</option>
                        </select>
                        {jewelryType === "other" && (
                          <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <input 
                              type="text" 
                              placeholder="e.g. Bridal Kamarband" 
                              className="w-full bg-[#0A1021] border border-[#C5A059]/50 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.1)]" 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Jewelry Name *</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. 22K Bridal Antique Necklace" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#C5A059] transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">SKU / Item Code (Optional)</label>
                      <input 
                        type="text" 
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="e.g. IRA-NK-108 (Auto-generated if empty)" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#C5A059] transition-colors font-mono text-xs" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Base Metal Weight</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="10.500" 
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#C5A059] transition-colors" 
                        />
                        <span className="absolute right-4 top-3 text-gray-500 text-xs">Grams</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Making Charges</label>
                      <div className="flex gap-2">
                        <select 
                          value={makingChargeType} 
                          onChange={(e) => setMakingChargeType(e.target.value)}
                          className="w-[90px] bg-gray-50 border border-gray-200 rounded-lg px-2 py-3 text-[10px] font-bold uppercase text-[#C5A059] focus:outline-none focus:border-[#C5A059] appearance-none"
                        >
                          <option value="flat">Flat ₹</option>
                          <option value="per_gram">Per gm</option>
                          <option value="percentage">% Val</option>
                        </select>
                        <div className="relative flex-1">
                          <input 
                            type="number" 
                            value={makingCharges}
                            onChange={(e) => setMakingCharges(e.target.value)}
                            placeholder="8500" 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#C5A059]" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gemstone / Diamond Pricing Addition */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-[#0A1021]">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600">Gemstones / Diamonds</label>
                      {!isAddingGemstone && (
                        <button onClick={() => setIsAddingGemstone(true)} className="text-[10px] text-[#C5A059] hover:text-gray-900 font-bold uppercase tracking-widest flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                          Add Stone
                        </button>
                      )}
                    </div>
                    
                    {gemstones.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {gemstones.map((stone, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                            <span className="text-xs text-gray-900 flex items-center gap-2"><span className="text-lg leading-none">💎</span> {stone.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-[#C5A059]">₹ {stone.price.toLocaleString('en-IN')}</span>
                              <button onClick={() => setGemstones(gemstones.filter((_, i) => i !== idx))} className="text-gray-500 hover:text-red-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {isAddingGemstone && (
                      <div className="flex gap-2 items-start mt-2">
                        <input 
                          type="text" 
                          placeholder="e.g. VVS Diamonds (0.5 CT)" 
                          value={newGemstoneName}
                          onChange={(e) => setNewGemstoneName(e.target.value)}
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C5A059]" 
                        />
                        <div className="relative w-32">
                           <span className="absolute left-2 top-2 text-gray-500 text-xs">₹</span>
                           <input 
                             type="number" 
                             placeholder="45000" 
                             value={newGemstonePrice}
                             onChange={(e) => setNewGemstonePrice(e.target.value)}
                             className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-6 pr-2 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C5A059]" 
                           />
                        </div>
                        <button onClick={handleAddGemstone} className="bg-[#C5A059] text-[#0A1021] rounded-lg px-3 py-2 text-xs font-bold hover:bg-white transition-colors">
                          Add
                        </button>
                      </div>
                    )}
                    {gemstones.length === 0 && !isAddingGemstone && (
                      <p className="text-[10px] text-gray-600 italic">No additional stones added. Price will be pure metal weight.</p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600">Design Description</label>
                      <button 
                        onClick={simulateAiDescription}
                        disabled={isGeneratingDesc}
                        className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 px-3 py-1 rounded-full border transition-all ${isGeneratingDesc ? 'bg-gray-50 border-gray-200 text-[#C5A059] animate-pulse' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'}`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        {isGeneratingDesc ? 'Writing copy...' : '✨ Auto-Generate'}
                      </button>
                    </div>
                    <textarea 
                      rows={4} 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add specific details about the craftsmanship, temple design, etc..." 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#C5A059] transition-colors resize-none"
                    ></textarea>
                  </div>

                </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-[#0A1021] flex justify-end gap-4">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-3 rounded-xl border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSyncProduct}
                disabled={isSyncing}
                className={`px-6 py-3 rounded-xl bg-gradient-to-r from-[#996515] to-[#C5A059] text-xs font-bold uppercase tracking-widest text-[#0A1021] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)] flex items-center gap-2 ${isSyncing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSyncing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0A1021]/30 border-t-[#0A1021] rounded-full animate-spin"></div>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    Sync Product
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
      </div>
    );
  };

  return (
    <DashboardLayout
      userName={userName}
      userRole={userRole}
      navItems={VENDOR_NAV_ITEMS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
