"use client";

import React, { useState, useEffect } from "react";
import { getPageLayout, savePageLayout } from "@/lib/firestore/layouts";
import { PageLayout, PageSection } from "@/types/gold-hub";
import { Save, Plus, GripVertical, Trash2, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminLayoutBuilder() {
  const [activePage, setActivePage] = useState<"HOME" | "DIRECTORY" | "JEWELLERY">("HOME");
  const [layout, setLayout] = useState<PageLayout | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);

  const [shopsList, setShopsList] = useState<{id: string, name: string}[]>([]);
  const [productsList, setProductsList] = useState<{id: string, name: string}[]>([]);
  const [jobsList, setJobsList] = useState<{id: string, title: string}[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [layoutData, shopsSnap, productsSnap, jobsSnap] = await Promise.all([
          getPageLayout(activePage).catch(() => null),
          getDocs(collection(db, "shops")).catch(() => ({ docs: [] })),
          getDocs(collection(db, "products")).catch(() => ({ docs: [] })),
          getDocs(collection(db, "jobs")).catch(() => ({ docs: [] }))
        ]);
        
        if (layoutData) {
          setLayout(layoutData);
        } else {
          setLayout({ pageId: activePage, sections: [], updatedAt: Date.now() });
        }

        setShopsList(shopsSnap.docs.map(d => ({ id: d.id, name: d.data().name || 'Unnamed Shop' })));
        setProductsList(productsSnap.docs.map(d => ({ id: d.id, name: d.data().name || 'Unnamed Product' })));
        setJobsList(jobsSnap.docs.map(d => ({ id: d.id, title: d.data().title || 'Untitled Job' })));

      } catch (err) {
        console.error("Failed to load layout data:", err);
      }
      setLoading(false);
    }
    loadData();
  }, [activePage]);

  const handleAddSection = () => {
    if (!layout) return;
    const newSection: PageSection = {
      id: `section_${Date.now()}`,
      type: 'PRODUCTS_GRID',
      title: 'New Section',
      subtitle: '',
      sortBy: 'LATEST',
      filterVerifiedOnly: false,
      limit: 4,
      order: layout.sections.length
    };
    setLayout({ ...layout, sections: [...layout.sections, newSection] });
  };

  const handleRemoveSection = (id: string) => {
    if (!layout) return;
    setLayout({ ...layout, sections: layout.sections.filter(s => s.id !== id) });
  };

  const handleUpdateSection = (id: string, updates: Partial<PageSection>) => {
    if (!layout) return;
    setLayout({
      ...layout,
      sections: layout.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!layout) return;
    const newSections = [...layout.sections];
    if (direction === 'up' && index > 0) {
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    } else if (direction === 'down' && index < newSections.length - 1) {
      [newSections[index + 1], newSections[index]] = [newSections[index], newSections[index + 1]];
    }
    setLayout({ ...layout, sections: newSections });
  };

  const handleSave = async () => {
    if (!layout) return;
    setSaving(true);
    setMessage(null);
    const success = await savePageLayout(layout);
    if (success) {
      setMessage({ text: "Layout saved successfully!", type: "success" });
    } else {
      setMessage({ text: "Failed to save layout.", type: "error" });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 min-h-[600px] shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Page Layout Builder</h2>
          <p className="text-gray-500 mt-1">Dynamically construct the rows and grids for your main pages.</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <select 
            value={activePage}
            onChange={(e) => setActivePage(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-gray-50 outline-none focus:border-[#C5A059]"
          >
            <option value="HOME">Home Page</option>
            <option value="DIRECTORY">Directory Page</option>
            <option value="JEWELLERY">Gold Jewellery Page</option>
          </select>
          <button 
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Layout"}
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-gray-500">Loading Configuration...</div>
      ) : (
        <div className="space-y-6">
          {layout?.sections.length === 0 && (
            <div className="text-center py-16 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
              <p className="text-gray-500 mb-4">No sections configured for this page yet.</p>
              <button 
                onClick={handleAddSection}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add First Section
              </button>
            </div>
          )}

          {layout?.sections.map((section, index) => (
            <div key={section.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden group">
              <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1 cursor-ns-resize text-gray-400 hover:text-gray-900">
                    <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="disabled:opacity-20">▲</button>
                    <button onClick={() => moveSection(index, 'down')} disabled={index === layout.sections.length - 1} className="disabled:opacity-20">▼</button>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Row {index + 1}: {section.title || "Untitled Section"}</h3>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">{section.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveSection(section.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Display Type</label>
                  <select 
                    value={section.type} 
                    onChange={e => handleUpdateSection(section.id, { type: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none"
                  >
                    <option value="PRODUCTS_GRID">Products Grid</option>
                    <option value="SHOPS_GRID">Shops Directory Grid</option>
                    <option value="JOBS_GRID">Jobs Grid</option>
                    <option value="AD_INJECT">Advertisement Banner</option>
                    <option value="PRODUCTS">Legacy Products Grid</option>
                    <option value="SHOPS">Legacy Shops Grid</option>
                  </select>
                </div>

                {section.type !== 'AD_INJECT' && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Title</label>
                    <input 
                      type="text" 
                      value={section.title} 
                      onChange={e => handleUpdateSection(section.id, { title: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none"
                      placeholder="e.g. Authentic Bargarh Designs"
                    />
                  </div>
                )}

                {section.type === 'AD_INJECT' ? (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Placement ID</label>
                    <input 
                      type="text" 
                      value={section.placementId || ""} 
                      onChange={e => handleUpdateSection(section.id, { placementId: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none"
                      placeholder="e.g. home_middle_banner"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Subtitle (Optional)</label>
                    <input 
                      type="text" 
                      value={section.subtitle || ""} 
                      onChange={e => handleUpdateSection(section.id, { subtitle: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none"
                      placeholder="e.g. Discover regional masterpieces"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Sort By</label>
                  <select 
                    value={section.sortBy} 
                    onChange={e => handleUpdateSection(section.id, { sortBy: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none"
                  >
                    <option value="LATEST">Latest Added</option>
                    <option value="PRICE_HIGH_TO_LOW">Price: High to Low (Products only)</option>
                    <option value="PRICE_LOW_TO_HIGH">Price: Low to High (Products only)</option>
                    <option value="RANDOM">Random / Shuffle</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Category Filter (Products Only)</label>
                  <input 
                    type="text" 
                    value={section.filterCategory || ""} 
                    onChange={e => handleUpdateSection(section.id, { filterCategory: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none"
                    placeholder="e.g. Neck Jewellery"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">State Filter</label>
                  <input 
                    type="text" 
                    value={section.filterState || ""} 
                    onChange={e => handleUpdateSection(section.id, { filterState: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none"
                    placeholder="e.g. Odisha"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">District Filter</label>
                  <input 
                    type="text" 
                    value={section.filterDistrict || ""} 
                    onChange={e => handleUpdateSection(section.id, { filterDistrict: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none"
                    placeholder="e.g. Sambalpur"
                  />
                </div>

                <div className="space-y-1 col-span-1 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600">Specific Items Override (Dropdown Picker)</label>
                  <select 
                    value=""
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const currentIds = section.specificItemIds || [];
                      if (!currentIds.includes(e.target.value)) {
                         handleUpdateSection(section.id, { specificItemIds: [...currentIds, e.target.value] });
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">-- Add a specific {section.type.includes('SHOP') ? 'Shop' : section.type.includes('PRODUCT') ? 'Product' : section.type.includes('JOB') ? 'Job' : 'Item'} --</option>
                    {section.type.includes('SHOP') && shopsList.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                    {section.type.includes('PRODUCT') && productsList.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                    {section.type.includes('JOB') && jobsList.map(j => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>
                  
                  {section.specificItemIds && section.specificItemIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {section.specificItemIds.map(itemId => {
                         let itemName = itemId;
                         if (section.type.includes('SHOP')) itemName = shopsList.find(s => s.id === itemId)?.name || itemId;
                         if (section.type.includes('PRODUCT')) itemName = productsList.find(p => p.id === itemId)?.name || itemId;
                         if (section.type.includes('JOB')) itemName = jobsList.find(j => j.id === itemId)?.title || itemId;
                         
                         return (
                           <div key={itemId} className="flex items-center gap-1 bg-[#D4AF37]/10 text-[#B08D57] font-semibold text-xs px-2 py-1 rounded border border-[#D4AF37]/30">
                             <span className="truncate max-w-[200px]">{itemName}</span>
                             <button 
                               onClick={() => {
                                 handleUpdateSection(section.id, { 
                                   specificItemIds: section.specificItemIds!.filter(id => id !== itemId) 
                                 });
                               }}
                               className="text-red-400 hover:text-red-600 font-bold ml-1 text-sm leading-none flex items-center justify-center"
                             >×</button>
                           </div>
                         );
                      })}
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1">Items selected here will override the District/State filters above.</p>
                </div>

                <div className="flex gap-4">
                  <div className="space-y-1 flex-1">
                    <label className="text-xs font-semibold text-gray-600">Max Items</label>
                    <input 
                      type="number" 
                      value={section.limit} 
                      onChange={e => handleUpdateSection(section.id, { limit: parseInt(e.target.value) || 4 })}
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none"
                      min="1"
                      max="20"
                    />
                  </div>
                  <div className="space-y-1 flex-1 flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer pb-2">
                      <input 
                        type="checkbox" 
                        checked={section.filterVerifiedOnly}
                        onChange={e => handleUpdateSection(section.id, { filterVerifiedOnly: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-xs font-semibold text-gray-600">Verified Only</span>
                    </label>
                  </div>
                </div>

              </div>
            </div>
          ))}

          {layout && layout.sections.length > 0 && (
            <button 
              onClick={handleAddSection}
              className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all"
            >
              <Plus className="w-5 h-5" /> Add Another Row
            </button>
          )}

        </div>
      )}
    </div>
  );
}
