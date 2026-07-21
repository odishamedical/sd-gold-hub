import React, { useState } from 'react';
import { saveShop } from '@/lib/firestore/shops';

export default function GoogleCrawler() {
  const [query, setQuery] = useState('Jewelers in Pune');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);

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
      for (const place of selectedPlaces) {
        await saveShop({
          googlePlaceId: place.id,
          name: place.displayName?.text || 'Unknown Shop',
          address: place.formattedAddress || '',
          location: {
            country: 'India',
            state: '',
            district: '',
            block: '',
            lat: place.location?.latitude,
            lng: place.location?.longitude
          },
          phone: place.nationalPhoneNumber,
          coverImages: place.photoUrls || [],
          rating: place.rating
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
          <p className="text-gray-500">Search and bulk import jewelers from Google Maps into the database.</p>
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

      {results.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Found {results.length} results</h3>
            <button 
              onClick={handleBulkImport}
              disabled={selectedIds.size === 0 || importing}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {importing ? 'Importing...' : `Import Selected (${selectedIds.size})`}
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
