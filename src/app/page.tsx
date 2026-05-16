import Image from "next/image";
import React from "react";

const SPREE_API = process.env.NEXT_PUBLIC_SPREE_API_URL || "https://spree-production-3fb8.up.railway.app";

async function getProducts() {
  try {
    const res = await fetch(`${SPREE_API}/api/v2/storefront/products?include=images`, { 
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}

export default async function Home() {
  const spreeData = await getProducts();
  const spreeProducts = spreeData?.data || [];
  const included = spreeData?.included || [];

  const getProductImage = (product: any) => {
    const imageRelation = product.relationships?.images?.data?.[0];
    if (imageRelation) {
      const imageObj = included.find((inc: any) => inc.type === 'image' && inc.id === imageRelation.id);
      if (imageObj && imageObj.attributes?.original_url) {
        if (imageObj.attributes.original_url.startsWith('/')) {
           return SPREE_API + imageObj.attributes.original_url;
        }
        return imageObj.attributes.original_url;
      }
    }
    return "/hero-gold.png";
  };

  const getProductPrice = (product: any) => {
    return product.attributes?.display_price || "₹--";
  };

  // Mockup Data exactly matching the Aurora Gold design
  const carouselItems = [
    { name: "IRA JEWELS", icon: "✨", id: 1, isAction: false },
    { name: "DWARIKA JEWELLERS", icon: "💎", id: 2, isAction: false },
    { name: "JEWELLERY WORLD", icon: "👑", id: 3, isAction: false },
    { name: "NEW JEWELLERY WORLD", icon: "🌟", id: 4, isAction: false },
    { name: "JOIN AS VENDOR", icon: "🤝", id: 5, isAction: true },
    { name: "CHECK GOLD HUID", icon: "🔍", id: 6, isAction: true },
    { name: "LATEST NEWS", icon: "📰", id: 7, isAction: true },
    { name: "TODAY'S OFFERS", icon: "✨", id: 8, isAction: true },
  ];

  const mockupProducts = [
    {
      id: 1,
      title: "22K Lotus Necklace",
      vendor: "IRA JEWELS",
      price: "₹ 2,85,000",
      viewers: 148,
      timeLeft: "01:22:45",
      image: "/diamond_necklace_luxury.png",
    },
    {
      id: 2,
      title: "Solid 24K Bangle Set",
      vendor: "DWARIKA JEWELLERS",
      price: "₹ 5,60,000",
      viewers: 215,
      timeLeft: "",
      warning: "Only 2 Left!",
      image: "/gold_bangle_luxury.png",
    },
    {
      id: 3,
      title: "Diamond Gold Necklace",
      vendor: "JEWELLERY WORLD",
      price: "₹ 12,45,000",
      viewers: 95,
      timeLeft: "04:15:30",
      image: "/hero-gold.png",
    },
    {
      id: 4,
      title: "18K Vintage Choker",
      vendor: "NEW JEWELLERY WORLD",
      price: "₹ 3,50,000",
      viewers: 0,
      timeLeft: "",
      image: "/diamond_necklace_luxury.png",
    }
  ];

  const displayProducts = spreeProducts.length > 0 
    ? spreeProducts.map((p: any) => ({
        id: p.id,
        title: p.attributes?.name || "Gold Masterpiece",
        vendor: "SD Verified Vendor",
        price: getProductPrice(p),
        viewers: Math.floor(Math.random() * 200) + 10,
        timeLeft: "02:14:00",
        image: getProductImage(p),
      }))
    : mockupProducts;

  return (
    <main className="min-h-screen bg-[#060A14] flex justify-center items-start p-0 md:p-8 font-sans">
      
      {/* Background glow effects to match the dark luxury aesthetic */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/5 blur-[150px] rounded-full mix-blend-screen"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#d4af37]/5 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Main Container mirroring the Aurora Gold dashboard wrapper */}
      <div className="relative w-full max-w-[1200px] bg-[#0A1021] rounded-none md:rounded-2xl border-x-0 md:border-x-[3px] border-y-[1px] md:border-y-[3px] border-[#C5A059]/30 md:border-[#C5A059] shadow-[0_0_40px_rgba(197,160,89,0.15)] z-10">
        
        {/* Top Live Rates Bar */}
        <div className="bg-[#121A30] text-[#9BA3AF] text-[10px] md:text-xs py-2 px-4 md:px-6 flex overflow-x-auto no-scrollbar whitespace-nowrap justify-start md:justify-center items-center gap-4 md:gap-6 border-b border-[#2A344A] rounded-t-none md:rounded-t-xl">
          <span className="text-[#C5A059] font-bold tracking-widest uppercase shrink-0">Live Gold Rates</span>
          <span className="opacity-40 shrink-0">|</span>
          <span className="shrink-0">24K: ₹7,138.50/gm <span className="text-green-500">(▲0.8%)</span></span>
          <span className="opacity-40 shrink-0">|</span>
          <span className="shrink-0">22K: ₹6,985.20/gm <span className="text-green-500">(▲0.6%)</span></span>
          <span className="opacity-40 shrink-0">|</span>
          <span className="shrink-0">Updated: 14:32 IST</span>
        </div>

        {/* Header Section */}
        <header className="sticky top-0 z-50 bg-[#0A1021]/95 backdrop-blur-sm px-4 md:px-8 py-4 md:py-6 flex justify-between items-center">
          <div className="absolute bottom-0 inset-x-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#e6b34a] to-transparent shadow-[0_0_20px_rgba(230,179,74,0.8)] z-20"></div>
          <div className="flex items-center gap-4 md:gap-12">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="relative w-12 h-12 md:w-[72px] md:h-[72px]">
                <Image 
                  src="/sd_logo_final.png" 
                  alt="Shyam Dash Logo" 
                  fill 
                  className="object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]" 
                />
              </div>
              <div className="flex flex-col mt-1 md:mt-2">
                <h1 className="text-xl md:text-2xl font-serif text-[#C5A059] tracking-widest font-bold leading-none whitespace-nowrap">
                  Shyam Dash
                </h1>
                <span className="text-[7px] md:text-[10px] text-[#C5A059]/70 uppercase tracking-widest mt-1 whitespace-nowrap">India's Verified Gold Marketplace.</span>
              </div>
            </div>
            
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-[#141C33] border border-[#2A344A] text-white text-sm rounded-full py-2 px-10 w-64 focus:outline-none focus:border-[#C5A059] transition-colors"
              />
              <svg className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex md:hidden items-center gap-4 text-white">
            <button className="relative">
              <svg className="w-5 h-5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">3</span>
            </button>
            <button>
              <svg className="w-6 h-6 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <a href="#" className="hover:text-[#C5A059] transition-colors">Search</a>
            <a href="#" className="hover:text-[#C5A059] transition-colors flex items-center gap-1">Shop <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></a>
            <a href="#" className="hover:text-[#C5A059] transition-colors flex items-center gap-1">Auctions <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></a>
            <a href="#" className="hover:text-[#C5A059] transition-colors flex items-center gap-1">Accounts <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></a>
            
            <button className="flex items-center gap-2 text-white ml-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span>Cart</span>
              <span className="bg-[#C5A059] text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">3</span>
            </button>
          </nav>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8">
          
          {/* Vendor Carousel */}
          <div className="flex items-center gap-4 mb-10">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#141C33] border border-[#2A344A] text-white hover:border-[#C5A059] hover:text-[#C5A059] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            
            <div className="flex-1 flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {carouselItems.map((item, idx) => (
                <div 
                  key={item.id} 
                  className={`flex flex-col items-center justify-center min-w-[140px] px-2 h-20 rounded-lg border cursor-pointer transition-all ${idx === 0 ? 'border-[#C5A059] bg-[#1A223B] shadow-[0_0_15px_rgba(197,160,89,0.2)]' : item.isAction ? 'border-[#C5A059]/30 bg-[#141C33] hover:border-[#C5A059] hover:shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'border-[#2A344A] bg-[#0E1528] hover:border-[#C5A059]/50'}`}
                >
                  <span className={`text-xl mb-1 ${idx === 0 || item.isAction ? 'text-[#C5A059]' : 'text-gray-400'}`}>{item.icon}</span>
                  <span className={`text-[10px] text-center font-bold tracking-wider ${idx === 0 || item.isAction ? 'text-[#C5A059]' : 'text-gray-400'}`}>{item.name}</span>
                </div>
              ))}
            </div>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#141C33] border border-[#2A344A] text-white hover:border-[#C5A059] hover:text-[#C5A059] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>

          {/* Product Rows with Ads */}
          <div className="flex flex-col gap-16 mt-8">
            {[
              { title: "IRA Jewels Exclusive Collection", subtitle: "India", type: "products" },
              { title: "Dwarika Jewellers Highlights", subtitle: "India", type: "products" },
              { title: "Dehapa", tagline: "Healthcare Reimagined. World-class medical infrastructure.", type: "ad", logo: "🏥", link: "Explore Care", color: "from-emerald-900/40" },
              { title: "Jewellery World Masterpieces", subtitle: "India", type: "products" },
              { title: "New Jewellery World Signature Line", subtitle: "India", type: "products" },
              { title: "Bhulia", tagline: "The Weaver's Story. Authentic Sambalpuri Silk.", type: "ad", logo: "🥻", link: "Discover Heritage", color: "from-red-900/40" },
              { title: "Trendy Designs", subtitle: "Contemporary Styles", type: "products" },
              { title: "Luxury Necklaces", subtitle: "Statement Pieces", type: "products" },
              { title: "SD Digital", tagline: "Next-Gen IT Infrastructure & Cloud Hosting.", type: "ad", logo: "💻", link: "Upgrade Now", color: "from-blue-900/40" },
              { title: "Bangles & Ear Rings", subtitle: "Everyday Sparkle", type: "products" },
            ].map((row, rowIdx) => (
              <div key={rowIdx}>
                {row.type === "products" ? (
                  <>
                    <div className="flex justify-between items-end mb-6 border-b border-[#2A344A] pb-2">
                      <div>
                        <h2 className="text-xl font-serif text-[#C5A059] tracking-wider font-bold">{row.title}</h2>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{row.subtitle}</p>
                      </div>
                      <a href="#" className="text-xs text-[#C5A059] hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
                        View All <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </a>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[...displayProducts, ...displayProducts, ...displayProducts].slice(rowIdx % 4, (rowIdx % 4) + 4).map((product, i) => (
                        <div key={i} className="relative bg-[#0E1528] rounded-xl border border-[#2A344A] overflow-hidden group hover:border-[#C5A059] transition-colors shadow-lg">
                          <div className="absolute top-0 inset-x-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#e6b34a] to-transparent shadow-[0_0_15px_rgba(230,179,74,0.8)] z-20"></div>
                          <div className="absolute bottom-0 inset-x-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#e6b34a] to-transparent shadow-[0_0_15px_rgba(230,179,74,0.8)] z-20"></div>
                          
                          {/* Image & Tickets */}
                          <div className="relative aspect-[4/3] bg-black overflow-hidden flex items-center justify-center p-4">
                            <Image 
                              src={product.image} 
                              alt={product.title} 
                              fill 
                              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                            />
                            
                            {/* Heart Icon */}
                            <button className="absolute top-3 right-3 text-[#C5A059] hover:text-white transition-colors z-20">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </button>

                            {/* Viewer / Time Ticket */}
                            {(product.viewers > 0 || product.timeLeft) && (
                              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-[#C5A059]/30 rounded flex items-center text-[10px] text-[#C5A059] overflow-hidden z-20">
                                {product.viewers > 0 && (
                                  <div className="px-2 py-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                    <span>{product.viewers} Viewers</span>
                                  </div>
                                )}
                                {product.viewers > 0 && product.timeLeft && <div className="w-[1px] h-3 bg-[#C5A059]/30"></div>}
                                {product.timeLeft && (
                                  <div className="px-2 py-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span>{product.timeLeft}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="p-4">
                            <h3 className="text-white text-sm font-medium mb-1 truncate">{product.title}</h3>
                            <p className="text-gray-500 text-xs mb-3 truncate">{product.vendor}</p>
                            
                            <div className="flex justify-between items-end">
                              <p className="text-[#C5A059] text-lg font-bold">{product.price}</p>
                              {product.warning ? (
                                <p className="text-red-400 text-xs">{product.warning}</p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className={`w-full rounded-2xl border border-[#2A344A] bg-gradient-to-r ${row.color} to-[#0A1021] overflow-hidden relative flex items-center p-8 lg:p-12 shadow-lg`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl leading-none pointer-events-none">
                      {row.logo}
                    </div>
                    <div className="relative z-10">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">Advertisement</span>
                      <h3 className="text-3xl font-serif text-[#C5A059] mb-2">{row.title}</h3>
                      <p className="text-gray-300 max-w-md mb-6">{row.tagline}</p>
                      <button className="text-xs font-bold uppercase tracking-widest text-[#0A1021] bg-[#C5A059] px-6 py-3 rounded-full hover:bg-white transition-colors shadow-[0_0_15px_rgba(197,160,89,0.4)]">
                        {row.link}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <footer className="border-t border-[#2A344A] bg-[#0E1528] pt-16 pb-8 px-8 lg:px-16 rounded-b-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Image src="/sd_logo_final.png" alt="Logo" width={48} height={48} className="object-contain" />
                <div>
                  <h3 className="text-xl font-serif text-[#C5A059] font-bold leading-none whitespace-nowrap">Shyam Dash</h3>
                  <span className="text-[9px] text-[#C5A059]/70 uppercase tracking-widest whitespace-nowrap">India's Verified Gold Marketplace.</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                The premier luxury marketplace for authenticated, hallmarked jewelry. Partnering exclusively with the finest jewelers across India.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full bg-[#141C33] flex items-center justify-center text-gray-400 hover:text-[#C5A059] hover:bg-[#1A223B] transition-colors border border-[#2A344A]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#141C33] flex items-center justify-center text-gray-400 hover:text-[#C5A059] hover:bg-[#1A223B] transition-colors border border-[#2A344A]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Quick Links</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#C5A059] transition-colors">Our Vendor Network</a></li>
                <li><a href="#" className="hover:text-[#C5A059] transition-colors">Verify Gold HUID</a></li>
                <li><a href="#" className="hover:text-[#C5A059] transition-colors">Live Market Rates</a></li>
                <li><a href="#" className="hover:text-[#C5A059] transition-colors">SD Digital Services</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Customer Care</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#C5A059] transition-colors">Authentication Guide</a></li>
                <li><a href="#" className="hover:text-[#C5A059] transition-colors">Secure Shipping</a></li>
                <li><a href="#" className="hover:text-[#C5A059] transition-colors">Return Policy</a></li>
                <li><a href="#" className="hover:text-[#C5A059] transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Stay Updated</h4>
              <p className="text-sm text-gray-400 mb-4">Subscribe for daily live rates and exclusive new collections.</p>
              <div className="flex">
                <input type="email" placeholder="Email Address" className="bg-[#141C33] border border-[#2A344A] text-white text-sm rounded-l-md px-4 py-2 w-full focus:outline-none focus:border-[#C5A059] transition-colors" />
                <button className="bg-[#C5A059] text-black text-sm font-bold px-4 py-2 rounded-r-md hover:bg-white transition-colors">
                  JOIN
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#2A344A] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© 2026 Shyam Dash Creation. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-[#C5A059] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#C5A059] transition-colors">Terms of Service</a>
              <span className="flex items-center gap-1">Powered by <span className="text-[#C5A059] font-bold">SD Digital</span></span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
