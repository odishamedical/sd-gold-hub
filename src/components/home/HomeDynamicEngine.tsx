import React from "react";
import Link from "next/link";
import { getProxiedImageUrl } from "@/lib/image-proxy";
import Image from "next/image";
import { ChevronRight, MapPin, Briefcase, IndianRupee } from "lucide-react";
import { generateJobSlug } from "@/lib/jobs";
import { generateShopSlug } from "@/lib/utils/seo-routing";
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
                      <Link href={`/gold-shop/${generateShopSlug(shop)}`} key={shop.id} className="rounded-2xl overflow-hidden group relative border border-[#D4AF37]/50 shadow-[0_10px_30px_rgba(212,175,55,0.15)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.3)] hover:-translate-y-1 transition-all duration-500 flex flex-col bg-gradient-to-br from-[#D4AF37] via-[#C5A059] to-[#8B6914]">
                        {shop.subscriptionTier === 'ELITE' && (
                          <div className="absolute top-0 right-0 w-[100px] h-[100px] overflow-hidden z-30">
                            <div className="absolute top-[20px] -right-[28px] w-[140px] transform rotate-45 bg-black text-[#D4AF37] text-center py-1.5 shadow-xl">
                              <span className="text-[10px] font-bold uppercase tracking-widest leading-none drop-shadow-sm">Elite</span>
                            </div>
                          </div>
                        )}
                        <div className="relative w-full h-[180px] overflow-hidden bg-black">
                          <img src={getProxiedImageUrl(shop.coverImages?.[0], "/images/showrooms.png")} alt={shop.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-xl font-[family-name:var(--font-display)] text-black mb-1 truncate font-extrabold drop-shadow-sm">
                            {shop.name}
                          </h3>
                          <div className="flex items-center text-[10px] text-black/70 mb-4 tracking-widest uppercase font-bold">
                            <MapPin className="w-3 h-3 mr-1 text-black/80" />
                            {shop.location?.district || "India"}, {shop.location?.state || ""}
                          </div>
                          <div className="mt-auto pt-4 border-t border-black/10">
                            <button className="px-4 py-2.5 rounded-xl bg-black text-[#D4AF37] text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors shadow-lg w-full flex items-center justify-center gap-2">
                              Visit Store <ChevronRight className="w-4 h-4" />
                            </button>
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
                      <Link href={`/jobs/${generateJobSlug(job)}`} key={job.id} className="rounded-2xl overflow-hidden group relative border border-[#D4AF37]/50 shadow-[0_10px_30px_rgba(212,175,55,0.15)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.3)] hover:-translate-y-1 transition-all duration-500 flex flex-col bg-gradient-to-br from-[#D4AF37] via-[#C5A059] to-[#8B6914] h-full">
                        <div className="bg-black/10 p-5 pb-4 border-b border-black/10 flex items-start gap-4">
                          {job.companyLogo ? (
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 shadow-md border border-[#D4AF37]/40">
                              <img src={job.companyLogo} alt={job.companyName || job.shopName || "Company"} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 shadow-md border border-[#D4AF37]/40 flex items-center justify-center">
                              <Briefcase className="w-8 h-8 text-[#D4AF37]" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 pt-1">
                            <h3 className="text-xl font-serif text-black mb-1 group-hover:text-gray-900 transition-colors font-extrabold drop-shadow-sm line-clamp-2 leading-tight">{job.title}</h3>
                            <p className="text-xs text-black/80 font-bold truncate">{job.companyName || job.shopName || "Gold Dunia Direct"}</p>
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-black/5 rounded-lg p-2 border border-black/5">
                              <p className="text-[9px] text-black/60 uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1"><IndianRupee className="w-3 h-3" /> Salary</p>
                              <p className="text-xs text-black font-bold truncate">{job.salaryRange || 'Not disclosed'}</p>
                            </div>
                            <div className="bg-black/5 rounded-lg p-2 border border-black/5">
                              <p className="text-[9px] text-black/60 uppercase font-bold tracking-wider mb-0.5">Experience</p>
                              <p className="text-xs text-black font-bold truncate">{job.experience || 'Any'}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-[10px] text-black/70 mb-4 tracking-widest uppercase font-bold">
                            <MapPin className="w-3 h-3 mr-1 text-black/80 shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="mt-auto pt-4 border-t border-black/10 text-black text-xs font-bold uppercase tracking-widest flex items-center">
                            View Details <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
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
