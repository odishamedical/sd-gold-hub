import React, { useState } from 'react';
import { saveShop } from '@/lib/firestore/shops';
import { INDIAN_STATES, ODISHA_DISTRICTS, ODISHA_DISTRICT_BLOCKS } from '@/lib/locations';

export default function GoogleCrawler() {
  const [query, setQuery] = useState('Jewelers in Pune');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);

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
        await saveShop({
          googlePlaceId: place.id,
          name: place.displayName?.text || 'Unknown Shop',
          address: place.formattedAddress || '',
          location: {
            country: finalCountry,
            state: finalState,
            district: finalDistrict,
            block: finalBlock,
            pincode: pincode,
            lat: place.location?.latitude,
            lng: place.location?.longitude
          },
          phone: place.nationalPhoneNumber,
          coverImages: place.photoUrls || [],
          rating: place.rating,
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

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Google Data Crawler</h2>
          <p className="text-gray-500">Search and bulk import jewelers from Google Maps into the database with rigid Geo-Taxonomy.</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((place) => (
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
                      <div className="font-medium text-gray-900">{place.displayName?.text}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">{place.formattedAddress}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {place.nationalPhoneNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        ⭐ {place.rating || 'N/A'} ({place.userRatingCount || 0})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
