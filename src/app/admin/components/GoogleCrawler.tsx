import React, { useState } from 'react';
import { saveShop } from '@/lib/firestore/shops';
import { INDIAN_STATES, ODISHA_DISTRICTS, ODISHA_DISTRICT_BLOCKS } from '@/lib/locations';
import { X } from 'lucide-react';

export default function GoogleCrawler() {
  const [query, setQuery] = useState('Jewelers in Pune');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);

  // Editing State
  const [editedPlaces, setEditedPlaces] = useState<Record<string, any>>({});
  const [inspectPlaceId, setInspectPlaceId] = useState<string | null>(null);

  // Geo-Taxonomy State
  const [country, setCountry] = useState('India');
  const [customCountry, setCustomCountry] = useState('');
  const [state, setState] = useState('Odisha');
  const [customState, setCustomState] = useState('');
  const [district, setDistrict] = useState('Khordha');
  const [customDistrict, setCustomDistrict] = useState('');
  const [block, setBlock] = useState('Bhubaneswar');
  const [customBlock, setCustomBlock] = useState('');
  const [pincode, setPincode] = useState('');
  const [searchDesc, setSearchDesc] = useState('');

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      if (data.places) {
        setResults(data.places);
        
        // Initialize edited state
        const initialEdits: Record<string, any> = {};
        data.places.forEach((p: any) => {
          initialEdits[p.id] = {
            name: p.displayName?.text || '',
            address: p.formattedAddress || '',
            phone: p.nationalPhoneNumber || '',
            website: p.websiteUri || '',
            rating: p.rating || 0,
            logoUrl: '' // Empty by default unless they select one
          };
        });
        setEditedPlaces(initialEdits);
      } else {
        setResults([]);
        alert(data.error || 'No places found');
      }
    } catch (e) {
      console.error(e);
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkImport = async () => {
    if (selectedIds.size === 0) return;
    setImporting(true);
    try {
      const selectedPlaces = results.filter(r => selectedIds.has(r.id));
      
      const finalCountry = country === 'Other' ? customCountry : country;
      const finalState = country === 'India' ? state : customState;
      const finalDistrict = (country === 'India' && state === 'Odisha') ? district : customDistrict;
      const finalBlock = (country === 'India' && state === 'Odisha') ? block : customBlock;

      for (const place of selectedPlaces) {
        const edits = editedPlaces[place.id] || {};
        await saveShop({
          googlePlaceId: place.id,
          name: edits.name || place.displayName?.text || 'Unknown Shop',
          address: edits.address || place.formattedAddress || '',
          location: {
            country: finalCountry,
            state: finalState,
            district: finalDistrict,
            block: finalBlock,
            pincode: pincode,
            lat: place.location?.latitude,
            lng: place.location?.longitude
          },
          phone: edits.phone || '',
          website: edits.website || '',
          coverImages: place.photoUrls || [],
          logoUrl: edits.logoUrl || null,
          rating: edits.rating || place.rating,
          description: searchDesc // Save the custom search description
        });
      }
      alert(`Successfully imported ${selectedPlaces.length} shops!`);
      setSelectedIds(new Set()); // clear selection
    } catch (e) {
      console.error(e);
      alert('Import failed');
    } finally {
      setImporting(false);
    }
  };

  const updateEdit = (id: string, field: string, value: any) => {
    setEditedPlaces(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const inspectedPlace = results.find(p => p.id === inspectPlaceId);
  const currentEdits = inspectedPlace ? editedPlaces[inspectPlaceId as string] : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Google Data Crawler</h2>
          <p className="text-gray-500">Search, preview, and bulk import jewelers from Google Maps into the database.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <input 
          type="text" 
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
          placeholder="e.g. Jewelers in Mumbai"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search Places'}
        </button>
      </div>

      {/* Global Geo-Taxonomy Mapping Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Bulk Import Geo-Taxonomy Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select 
              value={country} 
              onChange={e => setCountry(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
            >
              <option value="India">India</option>
              <option value="Other">Other</option>
            </select>
            {country === 'Other' && (
              <input 
                type="text" placeholder="Enter Country" value={customCountry} onChange={e => setCustomCountry(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black mt-2"
              />
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            {country === 'India' ? (
              <select value={state} onChange={e => { setState(e.target.value); setDistrict(''); setBlock(''); }} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black">
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <input type="text" placeholder="Enter State" value={customState} onChange={e => setCustomState(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black" />
            )}
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            {(country === 'India' && state === 'Odisha') ? (
              <select value={district} onChange={e => { setDistrict(e.target.value); setBlock(''); }} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black">
                <option value="">Select District</option>
                {ODISHA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            ) : (
              <input type="text" placeholder="Enter District" value={customDistrict} onChange={e => setCustomDistrict(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black" />
            )}
          </div>

          {/* Block */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Block / Region</label>
            {(country === 'India' && state === 'Odisha' && district) ? (
              <select value={block} onChange={e => setBlock(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black">
                <option value="">Select Block</option>
                {(ODISHA_DISTRICT_BLOCKS[district] || []).map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            ) : (
              <input type="text" placeholder="Enter Block/Region" value={customBlock} onChange={e => setCustomBlock(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black" />
            )}
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
            <input type="text" placeholder="Optional" value={pincode} onChange={e => setPincode(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black" />
          </div>

          {/* Search Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Context / Description</label>
            <input type="text" placeholder="e.g. Authentic Gold Jewelry" value={searchDesc} onChange={e => setSearchDesc(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black" />
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Found {results.length} results</h3>
            <button 
              onClick={handleBulkImport}
              disabled={selectedIds.size === 0 || importing}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {importing ? 'Importing...' : `Import Selected (${selectedIds.size}) to ${block || customBlock || district || customDistrict || state || customState || 'Database'}`}
            </button>
          </div>
          
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={selectedIds.size === results.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(new Set(results.map(r => r.id)));
                        } else {
                          setSelectedIds(new Set());
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((place) => {
                  const edits = editedPlaces[place.id] || {};
                  return (
                  <tr key={place.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300"
                        checked={selectedIds.has(place.id)}
                        onChange={() => toggleSelection(place.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{edits.name || place.displayName?.text}</div>
                      {edits.website && <a href={edits.website} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">Website</a>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">{edits.address || place.formattedAddress}</div>
                      <div className="text-xs text-gray-400 mt-1">{edits.phone || place.nationalPhoneNumber || 'No Phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex -space-x-2">
                        {(place.photoUrls || []).slice(0, 3).map((url: string, i: number) => (
                          <img key={i} src={url} alt="Shop" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                        ))}
                        {(place.photoUrls || []).length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            +{(place.photoUrls.length - 3)}
                          </div>
                        )}
                        {(!place.photoUrls || place.photoUrls.length === 0) && (
                          <span className="text-xs text-red-500 font-bold">0 Images</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => setInspectPlaceId(place.id)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-semibold border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg"
                      >
                        Inspect & Edit
                      </button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect & Edit Modal */}
      {inspectPlaceId && inspectedPlace && currentEdits && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setInspectPlaceId(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Inspect & Edit Shop Data</h2>
              <p className="text-gray-500 mb-8">Review the data grabbed by the Google Crawler. Edit any incorrect fields or clear fields you don't want to inject.</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Shop Name</label>
                    <input 
                      type="text" 
                      value={currentEdits.name} 
                      onChange={(e) => updateEdit(inspectPlaceId, 'name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                    <textarea 
                      value={currentEdits.address} 
                      onChange={(e) => updateEdit(inspectPlaceId, 'address', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={currentEdits.phone} 
                      onChange={(e) => updateEdit(inspectPlaceId, 'phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                      placeholder="e.g. 09923557763"
                    />
                    <p className="text-xs text-gray-400 mt-1">Clear this field if you don't want to import the phone number.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Website URL</label>
                    <input 
                      type="url" 
                      value={currentEdits.website} 
                      onChange={(e) => updateEdit(inspectPlaceId, 'website', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                      placeholder="e.g. https://www.shopname.com"
                    />
                    <p className="text-xs text-gray-400 mt-1">Clear this field if you don't want to import the website.</p>
                  </div>
                </div>

                {/* Right Side: Images */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Image Gallery Preview ({inspectedPlace.photoUrls?.length || 0})</h3>
                  <p className="text-xs text-gray-500 mb-4">Click an image to set it as the primary Shop Logo.</p>
                  
                  {inspectedPlace.photoUrls && inspectedPlace.photoUrls.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {inspectedPlace.photoUrls.map((url: string, i: number) => {
                        const isLogo = currentEdits.logoUrl === url;
                        return (
                          <div 
                            key={i} 
                            onClick={() => updateEdit(inspectPlaceId, 'logoUrl', isLogo ? '' : url)}
                            className={`aspect-square rounded-lg overflow-hidden border-4 cursor-pointer relative group transition-all ${isLogo ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-300 shadow-sm hover:border-blue-300'}`}
                          >
                            <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            {isLogo && (
                              <div className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-md">
                                Shop Logo
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-gray-500 font-bold mb-1">No Images Found</p>
                      <p className="text-xs text-gray-400 text-center max-w-[200px]">Google does not have any high-res images for this business.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button 
                  onClick={() => setInspectPlaceId(null)}
                  className="px-6 py-3 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Auto select it for import if they spent time editing it
                    const newSet = new Set(selectedIds);
                    newSet.add(inspectPlaceId);
                    setSelectedIds(newSet);
                    setInspectPlaceId(null);
                  }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Save & Queue for Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
