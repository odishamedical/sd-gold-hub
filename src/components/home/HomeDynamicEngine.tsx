import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import GlobalBannerSlot from "@/components/GlobalBannerSlot";

export default function HomeDynamicEngine({ layout, products, shops, jobs }: any) {
  if (!layout || !layout.sections || layout.sections.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500 font-light">
        No layout configured. Please configure the home layout in the admin panel.
      </div>
    );
  }

  return (
    <>
      {layout.sections.map((section: any, idx: number) => {
        const bgClass = idx % 2 === 0 ? 'bg-gradient-to-b from-[#060A14] to-[#0A1021]' : 'bg-[#0A1021]';
        
        if (section.type === 'AD_INJECT') {
          return (
            <section key={idx} className={`relative z-10 py-8 ${bgClass}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <GlobalBannerSlot placementId={section.placementId || "home_middle_banner"} context={{ audience: "global" }} />
              </div>
            </section>
          );
        }

        return (
          <section key={idx} className={`relative z-10 py-16 ${bgClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-[#DDA7A5]/20 pb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-display)] text-white mb-2 tracking-widest uppercase">
                    {section.title}
                  </h2>
                  {section.subtitle && <p className="text-[#9CA3AF] font-light text-sm">{section.subtitle}</p>}
                </div>
                {section.type === 'PRODUCTS_GRID' && (
                  <Link href="/gold-jewellery" className="text-[#DDA7A5] text-sm hover:text-white transition-colors flex items-center gap-1 mt-4 md:mt-0 font-light">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
                {section.type === 'SHOPS_GRID' && (
                  <Link href="/directory" className="text-[#DDA7A5] text-sm hover:text-white transition-colors flex items-center gap-1 mt-4 md:mt-0 font-light">
                    View Directory <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
                {section.type === 'JOBS_GRID' && (
                  <Link href="/jobs" className="text-[#DDA7A5] text-sm hover:text-white transition-colors flex items-center gap-1 mt-4 md:mt-0 font-light">
                    View All Jobs <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
              
              {section.type === 'PRODUCTS_GRID' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(() => {
                    let filteredProducts = [...products];
                    if (section.specificItemIds && section.specificItemIds.length > 0) {
                      filteredProducts = filteredProducts.filter((p: any) => section.specificItemIds!.includes(p.id));
                      filteredProducts.sort((a: any, b: any) => section.specificItemIds!.indexOf(a.id) - section.specificItemIds!.indexOf(b.id));
                    } else {
                      if (section.filterCategory) {
                        filteredProducts = filteredProducts.filter((p: any) => p.category?.toLowerCase() === section.filterCategory!.toLowerCase());
                      }
                      if (section.filterState) {
                        filteredProducts = filteredProducts.filter((p: any) => p.location?.state?.toLowerCase().includes(section.filterState!.toLowerCase()));
                      }
                      if (section.filterDistrict) {
                        filteredProducts = filteredProducts.filter((p: any) => p.location?.district?.toLowerCase().includes(section.filterDistrict!.toLowerCase()));
                      }

                      if (section.sortBy === 'PRICE_HIGH_TO_LOW') {
                        filteredProducts.sort((a: any, b: any) => b.price - a.price);
                      } else if (section.sortBy === 'PRICE_LOW_TO_HIGH') {
                        filteredProducts.sort((a: any, b: any) => a.price - b.price);
                      } else if (section.sortBy === 'RANDOM') {
                        filteredProducts.sort(() => Math.random() - 0.5);
                      }
                    }
                    
                    const finalProducts = filteredProducts.slice(0, section.limit || 4);
                    
                    if (finalProducts.length === 0) {
                      return <div className="col-span-full py-12 text-center text-gray-500 font-light">No products available.</div>;
                    }

                    return finalProducts.map((product: any) => (
                      <div key={product.id} className="h-full">
                        <ProductCard product={product} />
                      </div>
                    ));
                  })()}
                </div>
              )}

              {section.type === 'SHOPS_GRID' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {(() => {
                    let filteredShops = [...shops];
                    
                    if (section.filterVerifiedOnly) {
                      filteredShops = filteredShops.filter((s: any) => s.isVerified);
                    }
                    if (section.specificItemIds && section.specificItemIds.length > 0) {
                      filteredShops = filteredShops.filter((s: any) => section.specificItemIds!.includes(s.id));
                      filteredShops.sort((a: any, b: any) => section.specificItemIds!.indexOf(a.id) - section.specificItemIds!.indexOf(b.id));
                    } else {
                      if (section.filterState) {
                        filteredShops = filteredShops.filter((s: any) => s.location?.state?.toLowerCase().includes(section.filterState!.toLowerCase()));
                      }
                      if (section.filterDistrict) {
                        filteredShops = filteredShops.filter((s: any) => s.location?.district?.toLowerCase().includes(section.filterDistrict!.toLowerCase()));
                      }
                      if (section.sortBy === 'RANDOM') {
                        filteredShops.sort(() => Math.random() - 0.5);
                      }
                    }

                    const finalShops = filteredShops.slice(0, section.limit || 4);
                    
                    if (finalShops.length === 0) {
                      return <div className="col-span-full py-12 text-center text-gray-500 font-light">No shops available.</div>;
                    }

                    return finalShops.map((shop: any) => (
                      <Link href={`/gold-shop/${shop.id}`} key={shop.id} className="bg-white/5 backdrop-blur-xl rounded-xl overflow-hidden group relative border border-[#D4AF37]/20 hover:border-[#DDA7A5]/60 transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                        {shop.subscriptionTier === 'ELITE' && (
                          <div className="absolute top-0 right-0 w-[100px] h-[100px] overflow-hidden z-30">
                            <div className="absolute top-[20px] -right-[28px] w-[140px] transform rotate-45 bg-gradient-to-r from-[#D4AF37] via-[#FDE047] to-[#D4AF37] text-black text-center py-1.5 shadow-[0_4px_15px_rgba(212,175,55,0.6)]">
                              <span className="text-[10px] font-bold uppercase tracking-widest leading-none drop-shadow-sm">Elite</span>
                            </div>
                          </div>
                        )}
                        <div className="p-5 pt-6 flex flex-col h-full">
                          <h3 className="text-xl font-[family-name:var(--font-display)] text-white group-hover:text-[#DDA7A5] transition-colors mb-1 truncate">
                            {shop.name}
                          </h3>
                          <div className="flex items-center text-[10px] text-gray-400 mb-4 tracking-widest uppercase">
                            <MapPin className="w-3 h-3 mr-1 text-[#D4AF37]" />
                            {shop.location?.district || "India"}, {shop.location?.state || ""}
                          </div>
                          <div className="flex gap-4 mt-auto">
                            <div className="w-[80px] h-[80px] flex-shrink-0 rounded-lg overflow-hidden border border-white/10 relative shadow-inner">
                              <Image src={shop.coverImages?.[0] || "/images/showrooms.png"} alt={shop.name} fill sizes="80px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center items-center text-center">
                              <button className="px-4 py-1.5 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 text-xs font-light text-white group-hover:border-[#DDA7A5] transition-all w-full">Visit Store</button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ));
                  })()}
                </div>
              )}

              {section.type === 'JOBS_GRID' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(() => {
                    let filteredJobs = [...jobs];
                    if (section.specificItemIds && section.specificItemIds.length > 0) {
                      filteredJobs = filteredJobs.filter((j: any) => section.specificItemIds!.includes(j.id));
                      filteredJobs.sort((a: any, b: any) => section.specificItemIds!.indexOf(a.id) - section.specificItemIds!.indexOf(b.id));
                    } else {
                      if (section.filterDistrict) {
                        filteredJobs = filteredJobs.filter((j: any) => j.location?.toLowerCase().includes(section.filterDistrict!.toLowerCase()));
                      }
                      if (section.sortBy === 'RANDOM') {
                        filteredJobs.sort(() => Math.random() - 0.5);
                      }
                    }
                    const finalJobs = filteredJobs.slice(0, section.limit || 4);
                    
                    if (finalJobs.length === 0) {
                      return <div className="col-span-full py-12 text-center text-gray-500 font-light">No jobs available.</div>;
                    }

                    return finalJobs.map((job: any) => (
                      <Link href={`/jobs/${job.id}`} key={job.id} className="block group bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#C5A059]/50 transition-all shadow-lg h-full flex flex-col">
                        <h3 className="text-lg font-serif text-white mb-2 group-hover:text-[#C5A059] transition-colors truncate">{job.title}</h3>
                        <p className="text-sm text-slate-400 font-light mb-4 truncate">{job.companyName}</p>
                        <div className="flex items-center text-xs text-slate-500 font-light mb-4">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location}
                        </div>
                        <div className="mt-auto pt-4 border-t border-white/5 text-[#C5A059] text-xs font-bold uppercase tracking-widest flex items-center">
                          View Details <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    ));
                  })()}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
