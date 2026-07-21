import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Upload, Trash2, MapPin } from 'lucide-react';
import { getGlobalAds, addGlobalAd, deleteGlobalAd, GlobalAd } from '@/lib/firestore/ads';

export default function GlobalAdEngine() {
  const [ads, setAds] = useState<GlobalAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [region, setRegion] = useState("All Odisha");

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      setLoading(true);
      const data = await getGlobalAds();
      setAds(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const newAd = {
        name,
        region,
        imageUrl: `https://placehold.co/1200x300/e2e8f0/64748b?text=${name.split(' ').join('+')}`,
        status: 'active' as const
      };
      const id = await addGlobalAd(newAd);
      setAds([...ads, { ...newAd, id, clicks: 0, createdAt: new Date() }]);
      setShowAddModal(false);
      setName("");
      setRegion("All Odisha");
    } catch (e) {
      console.error(e);
      alert("Failed to create campaign");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign?")) return;
    try {
      await deleteGlobalAd(id);
      setAds(ads.filter(a => a.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete campaign");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-orange-500" /> Global Ad Engine
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage promotional banners across regional directory pages.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ads.map(ad => (
          <div key={ad.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{ad.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4" /> Targeted: {ad.region}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${ad.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {ad.status}
              </span>
            </div>
            
            <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center border border-gray-200 text-gray-400 font-bold uppercase tracking-widest overflow-hidden">
               <img src={ad.imageUrl} alt="Ad Preview" className="w-full h-full object-cover" />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="text-sm">
                <span className="font-bold text-gray-900">{ad.clicks.toLocaleString()}</span> <span className="text-gray-500">Clicks</span>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded text-sm font-bold transition-colors">Edit</button>
                <button onClick={() => handleDelete(ad.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Create New Campaign</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Campaign Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Navratri Special" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Target Region (Directory Page)</label>
                <select 
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option>All Odisha</option>
                  <option>Bhubaneswar</option>
                  <option>Cuttack</option>
                  <option>Puri</option>
                  <option>Rourkela</option>
                </select>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-700">Upload Banner Image</p>
                <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x300px</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-200">Cancel</button>
              <button 
                onClick={handleLaunch} 
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-md disabled:opacity-50"
              >
                {saving ? 'Launching...' : 'Launch Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
