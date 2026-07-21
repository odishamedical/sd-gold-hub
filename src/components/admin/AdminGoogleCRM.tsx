"use client";

import React, { useState, useMemo } from "react";
import { useStores } from "@/lib/db-hooks";
import { db } from "@/lib/firebase";
import { deleteDoc, doc, setDoc } from "firebase/firestore";

export default function AdminGoogleCRM() {
  const { stores, loading } = useStores(500);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Crawler State
  const [showCrawler, setShowCrawler] = useState(false);
  const [googleQuery, setGoogleQuery] = useState("");
  const [googleResults, setGoogleResults] = useState<any[]>([]);
  const [isCrawling, setIsCrawling] = useState(false);

  const handleCrawl = async () => {
    if (!googleQuery) return;
    setIsCrawling(true);
    try {
      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: googleQuery })
      });
      const data = await res.json();
      if (data.places) {
        setGoogleResults(data.places);
      } else {
        alert("No results found or error occurred.");
      }
    } catch (e) {
      console.error(e);
      alert("Crawler error");
    } finally {
      setIsCrawling(false);
    }
  };

  const importPlace = async (place: any) => {
    try {
      const newDoc = {
        title: place.displayName?.text || "Unknown",
        address: place.formattedAddress || "",
        phoneNumber: place.nationalPhoneNumber || "",
        website: place.websiteUri || "",
        rating: place.rating || 0,
        source: "google_places",
        role: "shop",
        status: "unclaimed",
        createdAt: new Date().toISOString()
      };
      const newRef = doc(db, "stores", place.id || Date.now().toString());
      await setDoc(newRef, newDoc);
      alert(`${newDoc.title} imported successfully!`);
      // Update local state is handled automatically by useStores hook snapshot listener
    } catch (e) {
      alert("Error importing lead");
    }
  };

  const crmLeads = useMemo(() => {
    return stores.filter(s => s.source === "google_places").map(s => ({
      id: s.id,
      name: s.title,
      role: s.role || "shop", // standardizing on 'shop' role for Gold Hub
      phone: s.phoneNumber || "N/A",
      state: String(s.address || "").split(",")?.[2]?.split("-")?.[0]?.trim() || s.state || "N/A",
      district: String(s.address || "").split(",")?.[1]?.trim() || s.district || "N/A",
      address: s.address,
      status: s.status || "approved",
      website: s.website || "N/A",
      rating: s.rating || "N/A",
    }));
  }, [stores]);

  const filteredLeads = useMemo(() => {
    return crmLeads.filter(lead => {
      const matchesSearch = !searchTerm || String(lead.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || String(lead.phone || "").includes(searchTerm);
      const matchesState = stateFilter === "all" || String(lead.state || "").toLowerCase() === stateFilter.toLowerCase();
      const matchesDistrict = districtFilter === "all" || String(lead.district || "").toLowerCase() === districtFilter.toLowerCase();
      const matchesRole = roleFilter === "all" || lead.role === roleFilter;

      return matchesSearch && matchesState && matchesDistrict && matchesRole;
    });
  }, [crmLeads, searchTerm, stateFilter, districtFilter, roleFilter]);

  const allStates = Array.from(new Set(crmLeads.map(l => l.state))).sort();
  const allDistricts = Array.from(new Set(crmLeads.map(l => l.district))).sort();

  const handleDelete = async (role: string, id: string) => {
    if (confirm("Delete this lead permanently?")) {
      try {
        await deleteDoc(doc(db, "stores", id));
        alert("Lead deleted.");
      } catch (e) {
        alert("Error deleting lead.");
      }
    }
  };

  const handleCall = (phone: string) => {
    if (phone === "N/A") return alert("No phone number available");
    window.open(`tel:${phone}`);
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Loading CRM Data...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <div className="bg-gradient-to-tr from-[#C5A059] to-[#b08d4f] p-2 rounded-xl text-[#060A14] shadow-md">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          Google Data CRM
        </h1>
        <p className="text-gray-400 mt-2 font-medium text-sm">Manage and track Gold Shops imported from Google Places.</p>
        <button 
          onClick={() => setShowCrawler(!showCrawler)}
          className="mt-4 bg-[#C5A059] text-[#0A1021] text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg hover:bg-white transition-colors"
        >
          {showCrawler ? "Close Crawler" : "Open Google Maps Crawler"}
        </button>
      </header>

      {showCrawler && (
        <div className="bg-[#141C33] p-6 rounded-2xl border border-[#C5A059]/30 mb-8 shadow-lg">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            Crawl Google Places
          </h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="e.g. Gold Shops in Bhubaneswar" 
              value={googleQuery}
              onChange={(e) => setGoogleQuery(e.target.value)}
              className="flex-1 pl-4 pr-4 py-3 bg-[#0E1528] text-white border-2 border-[#2A344A] rounded-xl text-sm focus:border-[#C5A059] outline-none font-medium"
            />
            <button 
              onClick={handleCrawl}
              disabled={isCrawling}
              className="bg-[#C5A059] text-[#0A1021] text-sm font-bold px-6 py-3 rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCrawling ? "Crawling..." : "Search"}
            </button>
          </div>
          
          {googleResults.length > 0 && (
            <div className="mt-6 grid gap-4">
              {googleResults.map((place, idx) => (
                <div key={idx} className="bg-[#0E1528] p-4 rounded-xl border border-[#2A344A] flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-bold text-sm">{place.displayName?.text}</h3>
                    <p className="text-gray-400 text-xs mt-1">{place.formattedAddress}</p>
                    <p className="text-[#C5A059] text-xs mt-1 font-mono">{place.nationalPhoneNumber || "No Phone"}</p>
                  </div>
                  <button 
                    onClick={() => importPlace(place)}
                    className="bg-transparent border border-[#C5A059] text-[#C5A059] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-[#C5A059] hover:text-[#0A1021] transition-colors"
                  >
                    Import Lead
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Search shops by name or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#0E1528] text-white border-2 border-[#2A344A] rounded-xl text-sm focus:border-[#C5A059] outline-none font-medium"
          />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-[#0E1528] text-white border-2 border-[#2A344A] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#C5A059]">
          <option value="all">All Shop Types</option>
          <option value="shop">Retail Jewelers</option>
          <option value="showroom">Premium Showrooms</option>
          <option value="boutique">Designer Boutiques</option>
        </select>
        <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="bg-[#0E1528] text-white border-2 border-[#2A344A] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#C5A059]">
          <option value="all">All States</option>
          {allStates.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={districtFilter} onChange={e => setDistrictFilter(e.target.value)} className="bg-[#0E1528] text-white border-2 border-[#2A344A] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#C5A059]">
          <option value="all">All Districts</option>
          {allDistricts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="bg-[#0E1528] rounded-2xl shadow-sm border border-[#2A344A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#141C33] text-gray-400 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="py-4 px-6 border-b border-[#2A344A]">Shop Name</th>
                <th className="py-4 px-6 border-b border-[#2A344A]">Category</th>
                <th className="py-4 px-6 border-b border-[#2A344A]">Location</th>
                <th className="py-4 px-6 border-b border-[#2A344A]">Contact</th>
                <th className="py-4 px-6 border-b border-[#2A344A] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A344A]">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#141C33] transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white">{lead.name}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{lead.address}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30">
                      {lead.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-300 font-medium">
                    {lead.district}, {lead.state}
                  </td>
                  <td className="py-4 px-6">
                    {lead.phone !== "N/A" ? (
                      <button onClick={() => handleCall(lead.phone)} className="text-[#C5A059] font-bold hover:underline flex items-center gap-1">
                        📞 {lead.phone}
                      </button>
                    ) : (
                      <span className="text-gray-500">No Phone</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button onClick={() => handleDelete(lead.role, lead.id)} className="text-red-400 font-bold hover:text-red-300 text-xs uppercase tracking-wider">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                    No Google Data CRM leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
