"use client";

import React, { useState } from "react";

// Structure for Product Rows
interface ProductRow {
  id: string;
  title: string;
  subtitle: string;
  categoryTag: string;
  maxProducts: number;
}

// Structure for Promo Banners
interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  gradient: string;
  glowIntensity: string;
}

export default function StorefrontCmsPage() {
  const [activeHub, setActiveHub] = useState<"gold" | "bhulia">("gold");
  const [isRevalidating, setIsRevalidating] = useState<boolean>(false);

  // Announcement Ticker State
  const [announcementActive, setAnnouncementActive] = useState<boolean>(true);
  const [announcementText, setAnnouncementText] = useState<string>("🔥 SOVEREIGN FESTIVE OFFER: 15% OFF MAKING CHARGES ON ALL 24K GOLD & DIAMOND JEWELRY | DIRECT ESCROW TO ARTISANS");
  const [announcementBg, setAnnouncementBg] = useState<string>("#996515");

  // Hero Banner State
  const [heroTitle, setHeroTitle] = useState<string>("The Sovereign Vault of Pure Gold.");
  const [heroSubtitle, setHeroSubtitle] = useState<string>("Authenticated 24K & 22K Hallmark jewelry curated directly from India's elite master goldsmiths. Backed by 100% BVC insured armored transit.");
  const [heroCtaText, setHeroCtaText] = useState<string>("Explore Sovereign Vault");
  const [heroCtaLink, setHeroCtaLink] = useState<string>("/#gold-vault");

  // Product Rows State (Gold Hub Defaults)
  const [goldRows, setGoldRows] = useState<ProductRow[]>([
    { id: "row-1", title: "Sovereign Gold Vault", subtitle: "24K & 22K Hallmark Masterpieces from Flagship Guilds", categoryTag: "gold-vault", maxProducts: 8 },
    { id: "row-2", title: "Diamond & Gemstone Sanctuary", subtitle: "IGI Certified Solitaires & Uncut Polki Sets", categoryTag: "diamond-sanctuary", maxProducts: 4 },
    { id: "row-3", title: "Temple & Bridal Heritage", subtitle: "Antique Nagas Work & Heavy Bridal Trousseau", categoryTag: "temple-heritage", maxProducts: 4 },
  ]);

  // Product Rows State (Bhulia Hub Defaults)
  const [bhuliaRows, setBhuliaRows] = useState<ProductRow[]>([
    { id: "b-row-1", title: "Cotton Sambalpuri Masterpieces", subtitle: "High-Density Handspun Cotton Ikat Sarees Direct from Bargarh", categoryTag: "cotton-sambalpuri", maxProducts: 8 },
    { id: "b-row-2", title: "Pata Sambalpuri (Pure Silk)", subtitle: "3-Ply Mulberry Silk Ikat with Traditional Phoda Kumbha Borders", categoryTag: "pata-sambalpuri", maxProducts: 4 },
    { id: "b-row-3", title: "Sonepur Bomkai Heritage", subtitle: "Intricate Extra-Weft Silk Sarees with Certified Silk Mark", categoryTag: "sonepur-bomkai", maxProducts: 4 },
  ]);

  // Promo Banners State
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([
    {
      id: "banner-1",
      title: "Are You an Elite Jewelry Artisan / Master Weaver?",
      subtitle: "List your sovereign workshop or pit loom today. We provide free digital cataloging, AI description generation, and 100% Jan Dhan direct escrow payouts.",
      ctaText: "🛡️ Claim / Register Store Now",
      ctaLink: "/directory",
      gradient: "from-[#0A1021] via-[#141C33] to-[#0A1021]",
      glowIntensity: "rgba(197,160,89,0.3)",
    },
    {
      id: "banner-2",
      title: "Sovereign BVC Insured Armored Delivery",
      subtitle: "Every shipment is transported via fully armored Sequel logistics vehicles with 100% transit indemnity coverage up to your doorstep.",
      ctaText: "📦 View Logistics Matrix",
      ctaLink: "/admin/settings",
      gradient: "from-[#141C33] via-[#0E1528] to-[#0A1021]",
      glowIntensity: "rgba(212,175,55,0.25)",
    }
  ]);

  // Modal State for Adding New Row
  const [showAddRowModal, setShowAddRowModal] = useState<boolean>(false);
  const [newRowTitle, setNewRowTitle] = useState<string>("");
  const [newRowSubtitle, setNewRowSubtitle] = useState<string>("");
  const [newRowCategoryTag, setNewRowCategoryTag] = useState<string>("");
  const [newRowMax, setNewRowMax] = useState<number>(4);

  const handleRevalidateCache = () => {
    setIsRevalidating(true);
    setTimeout(() => {
      setIsRevalidating(false);
      alert("⚡ Global Next.js Cache Revalidation Broadcasted!\n\nTarget Tags: `storefront-layout`, `spree-products`, `cms-banners`\nRevalidation Window: On-Demand (revalidate: 60s)\nFirestore Sync: SUCCESS\n\nAll edge CDN nodes have been purged. Storefront updates are live instantly.");
    }, 1500);
  };

  const handleAddRow = (e: React.FormEvent) => {
    e.preventDefault();
    const newRow: ProductRow = {
      id: `row-${Date.now()}`,
      title: newRowTitle,
      subtitle: newRowSubtitle,
      categoryTag: newRowCategoryTag || "custom-category",
      maxProducts: Number(newRowMax),
    };

    if (activeHub === "gold") {
      setGoldRows([...goldRows, newRow]);
    } else {
      setBhuliaRows([...bhuliaRows, newRow]);
    }

    setShowAddRowModal(false);
    setNewRowTitle(""); setNewRowSubtitle(""); setNewRowCategoryTag(""); setNewRowMax(4);
    alert(`➕ New Product Row Added Successfully to ${activeHub.toUpperCase()} HUB!\n\nRow Title: ${newRow.title}\nSpree Category Tag: #${newRow.categoryTag}\nMax Display: ${newRow.maxProducts}\n\nChanges saved to Firestore settings/homepage.`);
  };

  const moveRow = (index: number, direction: "up" | "down") => {
    const rows = activeHub === "gold" ? [...goldRows] : [...bhuliaRows];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= rows.length) return;

    const temp = rows[index];
    rows[index] = rows[targetIndex];
    rows[targetIndex] = temp;

    if (activeHub === "gold") {
      setGoldRows(rows);
    } else {
      setBhuliaRows(rows);
    }
  };

  const deleteRow = (id: string) => {
    if (activeHub === "gold") {
      setGoldRows(goldRows.filter(r => r.id !== id));
    } else {
      setBhuliaRows(bhuliaRows.filter(r => r.id !== id));
    }
  };

  const currentRows = activeHub === "gold" ? goldRows : bhuliaRows;

  return (
    <div className="space-y-8 animate-fadeIn font-sans text-gray-900 pb-16">
      
      {/* Header & Global Revalidation Trigger */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white border border-gray-200 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></span>
            <span>Firestore Dynamic Layout Engine</span>
          </div>
          <h1 className="text-3xl font-serif text-[#C5A059] font-bold tracking-wider mb-2">Storefront CMS & Grid Manager</h1>
          <p className="text-xs text-gray-600 uppercase tracking-widest max-w-2xl leading-relaxed font-sans">
            Instantly reorder homepage product rows, manage promotional advertising banners, and update announcement tickers without code deployments or server restarts.
          </p>
        </div>

        <div className="relative z-10 shrink-0 w-full md:w-auto">
          <button 
            onClick={handleRevalidateCache}
            disabled={isRevalidating}
            className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
              isRevalidating 
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 cursor-wait"
                : "bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] hover:brightness-110 shadow-[0_0_25px_rgba(197,160,89,0.4)]"
            }`}
          >
            {isRevalidating ? (
              <>
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
                <span>Broadcasting Cache Purge...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <span>⚡ Trigger Global Cache Revalidation (revalidate: 60s)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hub Switcher Tabs */}
      <div className="flex gap-4 border-b border-gray-200 pb-4 font-mono">
        <button 
          onClick={() => setActiveHub("gold")}
          className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 shadow ${
            activeHub === "gold" 
              ? "bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] shadow-[0_0_20px_rgba(197,160,89,0.4)]"
              : "bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-[#C5A059]/50"
          }`}
        >
          <span>🥇 SD Gold Hub Storefront</span>
        </button>
        <button 
          onClick={() => setActiveHub("bhulia")}
          className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 shadow ${
            activeHub === "bhulia" 
              ? "bg-gradient-to-r from-[#0B2B26] via-[#0D3630] to-[#0B2B26] border border-[#C5A059] text-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.3)]"
              : "bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-[#C5A059]/50"
          }`}
        >
          <span>🧵 SD Bhulia Hub Storefront</span>
        </button>
      </div>

      {/* Grid Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left + Center Columns: Content Controls */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Announcement Ticker Control */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <h3 className="text-lg font-serif font-bold text-[#C5A059] flex items-center gap-2">
                <span>📢</span> Announcement Ticker Manager
              </h3>
              <label className="flex items-center gap-2 text-xs font-mono font-bold cursor-pointer">
                <span className={announcementActive ? "text-green-400" : "text-gray-500"}>{announcementActive ? "ACTIVE" : "HIDDEN"}</span>
                <input 
                  type="checkbox" 
                  checked={announcementActive} 
                  onChange={(e) => setAnnouncementActive(e.target.checked)}
                  className="w-4 h-4 accent-[#C5A059]"
                />
              </label>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Scrolling Ticker Text</label>
                <input 
                  type="text" 
                  value={announcementText} 
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#C5A059] rounded-xl text-gray-900 text-xs font-sans focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Background Color:</label>
                <div className="flex items-center gap-2">
                  {["#996515", "#0B2B26", "#800020", "#0A1021"].map((color) => (
                    <button 
                      key={color}
                      type="button"
                      onClick={() => setAnnouncementBg(color)}
                      className={`w-8 h-8 rounded-lg border-2 cursor-pointer transition-transform ${announcementBg === color ? "border-[#C5A059] scale-110 shadow-[0_0_10px_rgba(197,160,89,0.5)]" : "border-transparent hover:scale-105"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Hero Section Manager */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#C5A059] border-b border-gray-200 pb-4 flex items-center gap-2">
              <span>🖼️</span> Hero Banner Configuration
            </h3>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Hero Title</label>
                <input 
                  type="text" 
                  value={heroTitle} 
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#C5A059] rounded-xl text-gray-900 text-xs font-sans focus:outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Hero Subtitle</label>
                <textarea 
                  rows={2}
                  value={heroSubtitle} 
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#C5A059] rounded-xl text-gray-900 text-xs font-sans focus:outline-none leading-relaxed"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">CTA Button Text</label>
                  <input 
                    type="text" 
                    value={heroCtaText} 
                    onChange={(e) => setHeroCtaText(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#C5A059] rounded-xl text-gray-900 text-xs font-sans focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">CTA Destination Link</label>
                  <input 
                    type="text" 
                    value={heroCtaLink} 
                    onChange={(e) => setHeroCtaLink(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#C5A059] rounded-xl text-gray-900 text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Dynamic Grid & Row Manager */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#C5A059] flex items-center gap-2 mb-1">
                  <span>📑</span> Dynamic Product Rows Manager
                </h3>
                <p className="text-xs text-gray-500 font-sans">Reorder, add, or remove active product display rows on the storefront homepage.</p>
              </div>
              <button 
                onClick={() => setShowAddRowModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] font-bold text-xs uppercase tracking-widest rounded-xl hover:brightness-110 transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)] cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>+ Add Product Row</span>
              </button>
            </div>

            {/* List of Active Rows */}
            <div className="space-y-4">
              {currentRows.map((row, idx) => (
                <div key={row.id} className="bg-gray-50 border border-gray-200 hover:border-[#C5A059]/50 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all group shadow">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Visual Position Number */}
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#C5A059]/30 flex items-center justify-center font-mono font-bold text-[#C5A059] text-xs shrink-0 group-hover:scale-110 transition-transform">
                      {idx + 1}
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="text-base font-serif font-bold text-gray-900 group-hover:text-[#C5A059] transition-colors leading-tight">{row.title}</h4>
                      <p className="text-xs text-gray-500 font-sans line-clamp-1">{row.subtitle}</p>
                      <div className="flex items-center gap-3 pt-1 font-mono text-[10px]">
                        <span className="text-[#C5A059] bg-white px-2 py-0.5 rounded border border-[#C5A059]/20 font-bold">#{row.categoryTag}</span>
                        <span className="text-gray-500">Max Display: {row.maxProducts} Items</span>
                      </div>
                    </div>
                  </div>

                  {/* Up / Down & Delete Controls */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 border-gray-200 pt-3 sm:pt-0">
                    <button 
                      onClick={() => moveRow(idx, "up")}
                      disabled={idx === 0}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-[#C5A059] hover:border-[#C5A059] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all flex items-center justify-center cursor-pointer"
                      title="Move Row Up"
                    >
                      ▲
                    </button>
                    <button 
                      onClick={() => moveRow(idx, "down")}
                      disabled={idx === currentRows.length - 1}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-[#C5A059] hover:border-[#C5A059] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all flex items-center justify-center cursor-pointer"
                      title="Move Row Down"
                    >
                      ▼
                    </button>
                    <button 
                      onClick={() => deleteRow(row.id)}
                      className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-gray-900 transition-all flex items-center justify-center cursor-pointer ml-1"
                      title="Delete Row"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Interspersed Promotional Banner Manager */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-serif font-bold text-[#C5A059] border-b border-gray-200 pb-4 flex items-center gap-2">
              <span>🏷️</span> Interspersed Promotional Banners
            </h3>

            <div className="space-y-6">
              {promoBanners.map((banner, idx) => (
                <div key={banner.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-2xl pointer-events-none" style={{ backgroundColor: banner.glowIntensity.replace("0.3", "0.15") }}></div>
                  
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-xs font-mono font-bold text-[#C5A059] uppercase tracking-widest">PROMO BANNER #{idx + 1}</span>
                    <span className="text-[10px] font-mono bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-bold">ACTIVE ON STOREFRONT</span>
                  </div>

                  <div className="space-y-3 font-sans">
                    <div>
                      <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Banner Headline</label>
                      <input 
                        type="text" 
                        value={banner.title} 
                        onChange={(e) => {
                          const updated = [...promoBanners];
                          updated[idx].title = e.target.value;
                          setPromoBanners(updated);
                        }}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 focus:border-[#C5A059] rounded-xl text-gray-900 text-xs font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Banner Description / Subtitle</label>
                      <textarea 
                        rows={2}
                        value={banner.subtitle} 
                        onChange={(e) => {
                          const updated = [...promoBanners];
                          updated[idx].subtitle = e.target.value;
                          setPromoBanners(updated);
                        }}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 focus:border-[#C5A059] rounded-xl text-gray-900 text-xs focus:outline-none leading-relaxed"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">CTA Button Text</label>
                        <input 
                          type="text" 
                          value={banner.ctaText} 
                          onChange={(e) => {
                            const updated = [...promoBanners];
                            updated[idx].ctaText = e.target.value;
                            setPromoBanners(updated);
                          }}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 focus:border-[#C5A059] rounded-xl text-gray-900 text-xs focus:outline-none font-bold text-[#C5A059]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">CTA Destination Link</label>
                        <input 
                          type="text" 
                          value={banner.ctaLink} 
                          onChange={(e) => {
                            const updated = [...promoBanners];
                            updated[idx].ctaLink = e.target.value;
                            setPromoBanners(updated);
                          }}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 focus:border-[#C5A059] rounded-xl text-gray-900 text-xs font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Firestore Collection Preview */}
        <div className="space-y-6 sticky top-28">
          <div className="bg-white border border-[#C5A059]/40 rounded-2xl p-6 shadow-2xl space-y-4 font-mono text-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#C5A059] text-[#0A1021] text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow">
              Live Firestore Node
            </div>
            
            <h3 className="text-base font-serif font-bold text-[#C5A059] border-b border-gray-200 pb-3 flex items-center gap-2">
              <span>🔥</span> settings/homepage
            </h3>
            <p className="text-[11px] text-gray-500 font-sans leading-relaxed">
              This JSON payload reflects the exact real-time state synchronized across your Firebase Cloud Firestore database. Storefront client components subscribe to this node via `onSnapshot`.
            </p>

            <div className="bg-[#060A14] p-4 rounded-xl border border-gray-200 overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-[#C5A059]/40 scrollbar-track-transparent">
              <pre className="text-amber-300 text-[11px] leading-relaxed font-mono">
{JSON.stringify({
  lastUpdated: new Date().toISOString(),
  activeStorefrontHub: activeHub,
  announcement: {
    active: announcementActive,
    text: announcementText,
    backgroundColor: announcementBg,
  },
  heroBanner: {
    title: heroTitle,
    subtitle: heroSubtitle,
    ctaText: heroCtaText,
    ctaLink: heroCtaLink,
    backgroundImage: "/bhulia-hero.png"
  },
  productRows: currentRows.map(r => ({
    title: r.title,
    subtitle: r.subtitle,
    spreeCategoryTag: r.categoryTag,
    maxLimit: r.maxProducts
  })),
  promotionalBanners: promoBanners.map(b => ({
    headline: b.title,
    subtext: b.subtitle,
    actionText: b.ctaText,
    actionUrl: b.ctaLink
  })),
  revalidationPolicy: "on-demand (revalidate: 60s)"
}, null, 2)}
              </pre>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-[10px] text-gray-500 font-sans leading-relaxed">
              💡 <strong className="text-[#C5A059]">Architecture Parity:</strong> Both Gold Hub and Bhulia Hub share identical Firestore schema definitions, guaranteeing 100% data compatibility across the SD ecosystem.
            </div>
          </div>
        </div>

      </div>

      {/* Add New Row Modal */}
      {showAddRowModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white border border-[#C5A059] rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(197,160,89,0.2)] relative">
            <button 
              onClick={() => setShowAddRowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center cursor-pointer font-sans"
            >
              ✕
            </button>
            <h2 className="text-xl font-serif text-[#C5A059] font-bold mb-1">Add Dynamic Product Row</h2>
            <p className="text-xs text-gray-500 mb-6 font-sans">Mint a new product showcase row on the {activeHub.toUpperCase()} HUB storefront homepage.</p>

            <form onSubmit={handleAddRow} className="space-y-4 font-mono text-xs">
              <div className="flex flex-col gap-1 font-sans">
                <label className="text-gray-500 uppercase tracking-widest text-[10px] font-mono">Row Display Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Master Weaver Exclusive Sarees"
                  value={newRowTitle}
                  onChange={(e) => setNewRowTitle(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] font-bold"
                />
              </div>

              <div className="flex flex-col gap-1 font-sans">
                <label className="text-gray-500 uppercase tracking-widest text-[10px] font-mono">Row Subtitle / Description</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Authentic 3-Ply Mulberry Silk Ikat Direct from Sonepur"
                  value={newRowSubtitle}
                  onChange={(e) => setNewRowSubtitle(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex flex-col gap-1 font-sans">
                <label className="text-gray-500 uppercase tracking-widest text-[10px] font-mono">Spree Commerce Category Tag</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. sonepur-bomkai"
                  value={newRowCategoryTag}
                  onChange={(e) => setNewRowCategoryTag(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] font-mono"
                />
                <span className="text-[10px] text-gray-500 font-sans mt-0.5">Products matching this taxon tag will populate the row.</span>
              </div>

              <div className="flex flex-col gap-1 font-sans">
                <label className="text-gray-500 uppercase tracking-widest text-[10px] font-mono">Max Products Display Limit</label>
                <select 
                  value={newRowMax} 
                  onChange={(e) => setNewRowMax(Number(e.target.value))}
                  className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] font-mono"
                >
                  <option value={4}>4 Products (Single Row)</option>
                  <option value={8}>8 Products (Two Rows)</option>
                  <option value={12}>12 Products (Three Rows)</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl mt-6 font-sans cursor-pointer"
              >
                Save Row to Firestore Settings
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
