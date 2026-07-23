"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AdCampaign } from "@/types/cms";
import ImageUploader from "@/components/ImageUploader";

export default function AdsPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);

  const getAdGuidelines = (placement: string, layoutSize: string) => {
    if (placement.includes("sidebar")) {
      return {
        title: "Sidebar Banner Guidelines",
        dimensions: "300 x 250 px (Medium) or 300 x 600 px (Half Page)",
        ratio: "1:1 or 1:2 Ratio",
        description: "Best for sidebars. Will stretch to fill the width of the container while maintaining aspect ratio."
      };
    }
    if (placement.includes("interstitial") || placement.includes("content_top") || placement.includes("content_bottom")) {
       return {
        title: "Content Break Guidelines",
        dimensions: "1200 x 300 px (Recommended)",
        ratio: "4:1 Ratio (Horizontal)",
        description: "Used to natively break up product grids and text content."
      };
    }
    if (layoutSize === "full") {
      return {
        title: "Full Width Hero Guidelines",
        dimensions: "1920 x 480 px (Widescreen)",
        ratio: "4:1 to 5:1 (Ultra Widescreen)",
        description: "Will span the entire width of the page container. Ensure text is centered."
      };
    } else if (layoutSize === "half") {
      return {
        title: "Half Width Guidelines",
        dimensions: "800 x 400 px",
        ratio: "2:1 Ratio (Landscape)",
        description: "Will take up 50% of the row on desktop, stacking full width on mobile."
      };
    } else if (layoutSize === "third") {
      return {
        title: "One-Third Width Guidelines",
        dimensions: "800 x 800 px",
        ratio: "1:1 Ratio (Square)",
        description: "Perfect for 3-column grids. Square images perform best here."
      };
    } else {
      return {
        title: "Quarter Width Guidelines",
        dimensions: "600 x 800 px",
        ratio: "3:4 Ratio (Portrait)",
        description: "Tall and narrow, typically used in 4-column product grids."
      };
    }
  };

  const getAspectRatio = (placement: string, layoutSize: string): "portrait" | "landscape" | "square" => {
    if (placement.includes("sidebar")) {
      if (layoutSize === "quarter" || layoutSize === "third") return "square";
      if (layoutSize === "half") return "landscape";
      return "portrait"; // full
    }
    if (layoutSize === "quarter" || layoutSize === "third") return "square";
    return "landscape";
  };

  // Form State

  const [title, setTitle] = useState("");
  const [type, setType] = useState<AdCampaign["type"]>("image");
  const [placement, setPlacement] = useState<AdCampaign["placement"]>("homepage_middle");
  const [targetAudience, setTargetAudience] = useState<AdCampaign["targetAudience"]>("global");
  const [targetSpecificIdsStr, setTargetSpecificIdsStr] = useState("all");
  const [targetCategory, setTargetCategory] = useState("all");
  const [targetMaterial, setTargetMaterial] = useState("all");
  const [targetDesign, setTargetDesign] = useState("all");
  const [targetCountry, setTargetCountry] = useState("all");
  const [targetState, setTargetState] = useState("all");
  const [targetDistrict, setTargetDistrict] = useState("all");
  const [targetCity, setTargetCity] = useState("all");
  const [linkUrl, setLinkUrl] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [layoutSize, setLayoutSize] = useState<AdCampaign["layoutSize"]>("full");
  const [impressionLimitStr, setImpressionLimitStr] = useState("");
  const [shopsList, setShopsList] = useState<{id:string, name:string, slug:string, country?:string, state?:string, district?:string, city?:string}[]>([]);
  const [dbCountries, setDbCountries] = useState<string[]>([]);
  const [dbStates, setDbStates] = useState<string[]>([]);
  const [dbDistricts, setDbDistricts] = useState<string[]>([]);
  const [dbCities, setDbCities] = useState<string[]>([]);

  useEffect(() => {
    fetchCampaigns();
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {

      const sSnap = await getDocs(collection(db, "shops"));
      const sData: any[] = [];
      const co = new Set<string>();
      const st = new Set<string>();
      const dt = new Set<string>();
      const ct = new Set<string>();

      sSnap.forEach(d => {
        const dd = d.data();
        sData.push({ 
          id: d.id, 
          name: dd.title || dd.name, 
          slug: dd.slug || d.id,
          country: dd.location?.country,
          state: dd.location?.state,
          district: dd.location?.district,
          city: dd.location?.city
        });
        if (dd.location) {
          if (dd.location.country) co.add(dd.location.country);
          if (dd.location.state) st.add(dd.location.state);
          if (dd.location.district) dt.add(dd.location.district);
          if (dd.location.city) ct.add(dd.location.city);
        }
      });
      setShopsList(sData);
      setDbCountries(Array.from(co).sort());
      setDbStates(Array.from(st).sort());
      setDbDistricts(Array.from(dt).sort());
      setDbCities(Array.from(ct).sort());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const snap = await getDocs(collection(db, "ad_campaigns"));
      const data: AdCampaign[] = [];
      snap.forEach(d => {
        data.push({ id: d.id, ...d.data() } as AdCampaign);
      });
      setCampaigns(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "paused" : "active";
      await updateDoc(doc(db, "ad_campaigns", id), { status: newStatus });
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus as any } : c));
    } catch (e) {
      console.error(e);
      alert("Error toggling status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await deleteDoc(doc(db, "ad_campaigns", id));
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
      alert("Error deleting campaign.");
    }
  };

  const handleEdit = (campaign: AdCampaign) => {
    setEditingCampaignId(campaign.id || null);
    setTitle(campaign.title);
    setType(campaign.type);
    setPlacement(campaign.placement);
    setTargetAudience(campaign.targetAudience);
    setTargetSpecificIdsStr(campaign.targetSpecificIds.join(", "));
    setTargetCategory(campaign.targetCategory || "all");
    setTargetMaterial(campaign.targetMaterial || "all");
    setTargetDesign(campaign.targetDesign || "all");
    setTargetCountry(campaign.targetCountry || "all");
    setTargetState(campaign.targetState || "all");
    setTargetDistrict(campaign.targetDistrict || "all");
    setTargetCity(campaign.targetCity || "all");
    setLinkUrl(campaign.linkUrl || "");
    setHtmlCode(campaign.type === "adsense" ? campaign.content : "");
    setImageUrl(campaign.type === "image" ? campaign.content : "");
    setYoutubeUrl(campaign.type === "youtube" ? campaign.content : "");
    setLayoutSize(campaign.layoutSize || "full");
    setImpressionLimitStr(campaign.impressionLimit ? campaign.impressionLimit.toString() : "");
    setIsModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let contentValue = "";

      if (type === "image") {
        if (!imageUrl) {
          alert("Please upload an image.");
          setIsUploading(false);
          return;
        }
        contentValue = imageUrl;
      } else if (type === "youtube") {
        if (!youtubeUrl) {
          alert("Please provide a YouTube URL.");
          setIsUploading(false);
          return;
        }
        contentValue = youtubeUrl;
      } else if (type === "product_injection") {
        contentValue = htmlCode || "{}"; // Use htmlCode state to hold JSON config if any
      } else {
        contentValue = htmlCode;
        if (!contentValue) {
          alert("Please provide AdSense or HTML code.");
          setIsUploading(false);
          return;
        }
      }

      const idsArray = targetSpecificIdsStr.split(",").map(id => id.trim()).filter(id => id);

      if (editingCampaignId) {
        const campaignUpdate = {
          title,
          type,
          content: contentValue,
          linkUrl: type === "image" ? linkUrl : "",
          placement,
          layoutSize,
          targetAudience,
          targetSpecificIds: idsArray.length > 0 ? idsArray : ["all"],
          targetCategory: targetAudience === "products" ? targetCategory : "all",
          targetMaterial: targetAudience === "products" ? targetMaterial : "all",
          targetDesign: targetAudience === "products" ? targetDesign : "all",
          targetCountry,
          targetState,
          targetDistrict,
          targetCity,
          impressionLimit: impressionLimitStr ? parseInt(impressionLimitStr) : null,
        };
        await updateDoc(doc(db, "ad_campaigns", editingCampaignId), campaignUpdate);
        setCampaigns(prev => prev.map(c => c.id === editingCampaignId ? { ...c, ...campaignUpdate } as AdCampaign : c));
      } else {
        const newId = doc(collection(db, "ad_campaigns")).id;
        const campaign: AdCampaign = {
          title,
          type,
          content: contentValue,
          linkUrl: type === "image" ? linkUrl : "",
          placement,
          layoutSize,
          targetAudience,
          targetSpecificIds: idsArray.length > 0 ? idsArray : ["all"],
          targetCategory: targetAudience === "products" ? targetCategory : "all",
          targetMaterial: targetAudience === "products" ? targetMaterial : "all",
          targetDesign: targetAudience === "products" ? targetDesign : "all",
          targetCountry,
          targetState,
          targetDistrict,
          targetCity,
          status: "active",
          impressions: 0,
          impressionLimit: impressionLimitStr ? parseInt(impressionLimitStr) : null,
          clicks: 0,
          createdAt: serverTimestamp(),
        };

        await setDoc(doc(db, "ad_campaigns", newId), campaign);
        setCampaigns([{ id: newId, ...campaign }, ...campaigns]);
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      alert(editingCampaignId ? "Error updating campaign." : "Error creating campaign.");
    }
    
    setIsUploading(false);
  };

  const resetForm = () => {
    setEditingCampaignId(null);
    setTitle("");
    setType("image");
    setPlacement("homepage_middle");
    setTargetAudience("global");
    setTargetSpecificIdsStr("all");
    setTargetCategory("all");
    setTargetMaterial("all");
    setTargetDesign("all");
    setTargetCountry("all");
    setTargetState("all");
    setTargetDistrict("all");
    setTargetCity("all");
    setLinkUrl("");
    setHtmlCode("");
    setImageUrl("");
    setYoutubeUrl("");
    setLayoutSize("full");
    setImpressionLimitStr("");
  };

  const filteredShops = shopsList.filter(shop => {
    if (targetCountry !== "all" && shop.country !== targetCountry) return false;
    if (targetState !== "all" && shop.state !== targetState) return false;
    if (targetDistrict !== "all" && shop.district !== targetDistrict) return false;
    if (targetCity !== "all" && shop.city !== targetCity) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Banner Ads Manager</h1>
          <p className="text-gray-800 mt-2 font-semibold">Control promotional banners across all customer-facing apps globally.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Create New Campaign
        </button>
      </header>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Active Campaigns</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="py-4 px-4 font-bold rounded-tl-xl">Campaign Title</th>
                <th className="py-4 px-4 font-bold">Placement</th>
                <th className="py-4 px-4 font-bold">Targeting</th>
                <th className="py-4 px-4 font-bold">Status</th>
                <th className="py-4 px-4 font-bold text-right">Impressions</th>
                <th className="py-4 px-4 font-bold text-right">Clicks (CTR)</th>
                <th className="py-4 px-4 font-bold text-right rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="py-16 text-center text-gray-500 font-medium">Loading campaigns...</td></tr>
              ) : campaigns.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-gray-500 font-medium">No banner ads found. Create one above.</td></tr>
              ) : (
                campaigns.map(banner => {
                  const ctr = banner.impressions > 0 ? ((banner.clicks / banner.impressions) * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={banner.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900">{banner.title}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-1">{banner.type.toUpperCase()}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 font-medium">{banner.placement}</td>
                      <td className="py-4 px-4">
                        <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block">
                          {banner.targetAudience}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1 truncate max-w-[150px]" title={banner.targetSpecificIds.join(", ")}>
                          {banner.targetSpecificIds.join(", ")}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => handleToggle(banner.id as string, banner.status)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                          banner.status === 'active' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}>
                          {banner.status}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-gray-600">{banner.impressions.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right font-mono">
                        <span className="text-gray-900 font-bold">{banner.clicks.toLocaleString()}</span>
                        <span className="text-gray-400 text-xs ml-1">({ctr}%)</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button onClick={() => handleEdit(banner)} className="text-blue-500 hover:text-blue-700 font-bold text-xs p-2 mr-2">Edit</button>
                        <button onClick={() => handleDelete(banner.id as string)} className="text-red-500 hover:text-red-700 font-bold text-xs p-2">Delete</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur">
              <h2 className="text-xl font-bold text-gray-900">{editingCampaignId ? "Edit Campaign" : "Create New Campaign"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest border-b pb-2">1. Campaign Details</h3>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Campaign Title</label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm" placeholder="e.g. Diwali Silk Promo" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Ad Type</label>
                    <select value={type} onChange={e => setType(e.target.value as any)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm">
                      <option value="image">Image Banner</option>
                      <option value="youtube">YouTube Video</option>
                      <option value="adsense">AdSense / Custom HTML</option>
                      <option value="product_injection">Dynamic Product Injection</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Placement Slot</label>
                    <select value={placement} onChange={e => setPlacement(e.target.value as any)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm">
                      <option value="homepage_top">Homepage Top</option>
                      <option value="homepage_middle">Homepage Middle</option>
                      <option value="sidebar">Global Sidebar</option>
                      <option value="content_top">Content Top (Above grids)</option>
                      <option value="content_bottom">Content Bottom</option>
                      <option disabled>--- Shop Profiles ---</option>
                      <option value="shop_sidebar_top">Shop Sidebar Top</option>
                      <option value="shop_sidebar_middle">Shop Sidebar Middle</option>
                      <option value="shop_sidebar_bottom">Shop Sidebar Bottom</option>
                      <option value="shop_grid_interstitial">Shop Grid Interstitial</option>
                      <option value="shop_empty_state">Shop Empty State (Fallback)</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Banner Layout Size</label>
                    <select value={layoutSize} onChange={e => setLayoutSize(e.target.value as any)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm">
                      <option value="full">Full Width (100%)</option>
                      <option value="half">Half Width (50%)</option>
                      <option value="third">One Third (33%)</option>
                      <option value="quarter">Quarter Width (25%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Impression Limit (Optional)</label>
                    <input type="number" value={impressionLimitStr} onChange={e => setImpressionLimitStr(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm" placeholder="e.g. 10000" />
                    <p className="text-[10px] text-gray-500 mt-1">Campaign auto-pauses when views hit this limit. Leave empty for unlimited.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest border-b pb-2">2. Targeting Rules</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Target Audience</label>
                    <select value={targetAudience} onChange={e => setTargetAudience(e.target.value as any)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm">
                      <option value="global">Global (Everywhere)</option>
                      <option value="shops">Shop Profiles</option>
                      <option value="products">Product Pages</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Specific Target IDs (Comma separated)</label>
                    {targetAudience === "shops" ? (
                      <select value={targetSpecificIdsStr} onChange={e => setTargetSpecificIdsStr(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm">
                        <option value="all">All Shops</option>
                        {filteredShops.map(t => (
                          <option key={t.slug} value={t.slug}>{t.name} ({t.slug})</option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" value={targetSpecificIdsStr} onChange={e => setTargetSpecificIdsStr(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm font-mono" placeholder="e.g. all, prod-123" />
                    )}
                    <p className="text-[10px] text-gray-500 mt-1">Use "all" to target everything in the audience category, or provide slugs/IDs.</p>
                  </div>
                </div>

                {targetAudience === "products" && (
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                      <select value={targetCategory} onChange={e => setTargetCategory(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm">
                        <option value="all">All Categories</option>
                        <option value="Necklaces">Necklaces</option>
                        <option value="Rings">Rings</option>
                        <option value="Earrings">Earrings</option>
                        <option value="Bracelets">Bracelets</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Material</label>
                      <select value={targetMaterial} onChange={e => setTargetMaterial(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm">
                        <option value="all">All Materials</option>
                        <option value="Pure Silk">Pure Silk</option>
                        <option value="Pure Cotton">Pure Cotton</option>
                        <option value="Silk Cotton Blend">Silk Cotton Blend</option>
                        <option value="Tussar Silk">Tussar Silk</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Design</label>
                      <select value={targetDesign} onChange={e => setTargetDesign(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm">
                        <option value="all">All Designs</option>
                        <option value="Ikat">Ikat</option>
                        <option value="Bandha">Bandha</option>
                        <option value="Phuta">Phuta</option>
                        <option value="Temple">Temple Border</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Target Country</label>
                    <select value={targetCountry} onChange={e => setTargetCountry(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm">
                      <option value="all">All Countries</option>
                      {dbCountries.map(co => <option key={co} value={co}>{co}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Target State</label>
                    <select value={targetState} onChange={e => setTargetState(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm">
                      <option value="all">All States</option>
                      {dbStates.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Target District</label>
                    <select value={targetDistrict} onChange={e => setTargetDistrict(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm">
                      <option value="all">All Districts</option>
                      {dbDistricts.map(dt => <option key={dt} value={dt}>{dt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Target City</label>
                    <select value={targetCity} onChange={e => setTargetCity(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm">
                      <option value="all">All Cities</option>
                      {dbCities.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                    </select>
                  </div>
                </div>

              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest border-b pb-2">3. Ad Content</h3>
                
                {type === "image" ? (
                  <>
                    <div className="bg-gray-50 p-4 border border-gray-200 rounded-xl">
                      {(() => {
                        const guide = getAdGuidelines(placement, layoutSize);
                        return (
                          <div className="mb-4 p-4 bg-amber-50/50 border border-amber-200 rounded-lg">
                            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                              <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              {guide.title}
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-2 rounded border border-amber-100">
                                <span className="block text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-0.5">Exact Dimensions</span>
                                <span className="text-xs font-mono font-bold text-gray-800">{guide.dimensions}</span>
                              </div>
                              <div className="bg-white p-2 rounded border border-amber-100">
                                <span className="block text-[10px] text-amber-600 font-bold uppercase tracking-wider mb-0.5">Aspect Ratio</span>
                                <span className="text-xs font-mono font-bold text-gray-800">{guide.ratio}</span>
                              </div>
                            </div>
                            <p className="text-xs text-amber-700/80 mt-3 italic">
                              * {guide.description}
                            </p>
                          </div>
                        );
                      })()}
                      <ImageUploader 
                        value={imageUrl} 
                        onChange={(url) => setImageUrl(url)} 
                        label={`Upload Banner Image`} 
                        aspectRatio={getAspectRatio(placement, layoutSize)} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Click Destination URL</label>
                      <input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm" placeholder="https://..." />
                    </div>
                  </>
                ) : type === "youtube" ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">YouTube Video Link</label>
                    <input type="url" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm" placeholder="e.g. https://www.youtube.com/watch?v=..." required />
                    <p className="text-[10px] text-gray-500 mt-1">Paste a standard YouTube link or Shorts link. It will automatically be transformed into an embedded ad player.</p>
                  </div>
                ) : type === "product_injection" ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">JSON Configuration (Optional)</label>
                    <textarea value={htmlCode} onChange={e => setHtmlCode(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm font-mono h-32" placeholder='{"limit": 4}' />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">HTML / AdSense Code</label>
                    <textarea value={htmlCode} onChange={e => setHtmlCode(e.target.value)} className="w-full px-4 py-2 bg-white border-2 border-gray-300 shadow-sm font-medium focus:ring-4 focus:ring-[#0070F3]/15 rounded-lg text-sm font-mono h-32" placeholder="<script async src='...'></script>..." />
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold text-sm hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={isUploading} className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 disabled:opacity-50">
                  {isUploading ? (editingCampaignId ? "Updating..." : "Creating...") : (editingCampaignId ? "Update Campaign" : "Launch Campaign")}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
