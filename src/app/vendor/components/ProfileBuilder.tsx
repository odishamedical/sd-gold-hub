import React, { useState } from 'react';
import { INDIAN_STATES, ODISHA_DISTRICTS, ODISHA_DISTRICT_BLOCKS } from '@/lib/locations';

export default function ProfileBuilder() {
  // Personal Info
  const [ownerName, setOwnerName] = useState('John Doe');
  const [ownerDesignation, setOwnerDesignation] = useState('Managing Director');
  const [ownerEmail, setOwnerEmail] = useState('john@example.com');
  
  // Business Info
  const [formData, setFormData] = useState({
    name: 'Shree Gold Palace',
    bio: 'Specialists in 22K Hallmarked Gold and Diamond Jewelry',
    phone: '0674 253 1234',
    whatsapp: '+919876543210'
  });

  // Geo-Taxonomy Address Logic
  const [country, setCountry] = useState('India');
  const [customCountry, setCustomCountry] = useState('');
  const [state, setState] = useState('Odisha');
  const [customState, setCustomState] = useState('');
  const [district, setDistrict] = useState('Khordha');
  const [customDistrict, setCustomDistrict] = useState('');
  const [block, setBlock] = useState('Bhubaneswar');
  const [customBlock, setCustomBlock] = useState('');
  const [pincode, setPincode] = useState('751001');
  const [landmark, setLandmark] = useState('Plot 45, Unit 2, Ashok Nagar');

  const handleSave = () => {
    alert('Profile saved successfully! Your shop is now mapped to the Global Geo-Taxonomy.');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop Profile Builder</h2>
        <p className="text-gray-500 text-sm">Update your personal, business, and strict location details to ensure perfect local SEO indexing.</p>
      </div>

      <div className="space-y-10">
        
        {/* Personal Information */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">1. Owner / Management Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner / Primary Contact Name</label>
              <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <input type="text" value={ownerDesignation} onChange={e => setOwnerDesignation(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email Address</label>
              <input type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black" />
            </div>
          </div>
        </section>

        {/* Business Information */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">2. Showroom Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name (As per GST/BIS)</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio / Tagline</label>
              <textarea rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Phone Number</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Business Number</label>
              <input type="text" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black" />
            </div>
          </div>
        </section>

        {/* Geo-Taxonomy Address Logic */}
        <section className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
            <h3 className="text-lg font-bold text-gray-800">3. Geo-Taxonomy Location Setup</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">SEO Optimized</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">Select your exact location from the dropdowns below. This ensures your store appears in exact regional search results (e.g. "Jewelers in Bhubaneswar, Khordha").</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select value={country} onChange={e => setCountry(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white">
                <option value="India">India</option>
                <option value="Other">Other</option>
              </select>
              {country === 'Other' && <input type="text" placeholder="Enter Country" value={customCountry} onChange={e => setCustomCountry(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black mt-2 bg-white" />}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
              {country === 'India' ? (
                <select value={state} onChange={e => { setState(e.target.value); setDistrict(''); setBlock(''); }} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white">
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : (
                <input type="text" placeholder="Enter State" value={customState} onChange={e => setCustomState(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white" />
              )}
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District / City</label>
              {(country === 'India' && state === 'Odisha') ? (
                <select value={district} onChange={e => { setDistrict(e.target.value); setBlock(''); }} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white">
                  <option value="">Select District</option>
                  {ODISHA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              ) : (
                <input type="text" placeholder="Enter District" value={customDistrict} onChange={e => setCustomDistrict(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white" />
              )}
            </div>

            {/* Block */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Block / Sub-Region</label>
              {(country === 'India' && state === 'Odisha' && district) ? (
                <select value={block} onChange={e => setBlock(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white">
                  <option value="">Select Block</option>
                  {(ODISHA_DISTRICT_BLOCKS[district] || []).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              ) : (
                <input type="text" placeholder="Enter Block" value={customBlock} onChange={e => setCustomBlock(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white" />
              )}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode / Zip</label>
              <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white" />
            </div>

            {/* Landmark */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street / Landmark</label>
              <input type="text" value={landmark} onChange={e => setLandmark(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white" placeholder="e.g. Plot 45, Unit 2" />
            </div>
          </div>
        </section>

        {/* Branding Images */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">4. Branding Assets</h3>
          <div className="flex gap-6">
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-colors bg-gray-50">
                <span className="text-2xl mb-1">📷</span>
                <span className="text-sm">Upload Logo</span>
              </div>
            </div>
            <div className="w-2/3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Images (Max 4)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-colors bg-gray-50">
                <span className="text-2xl mb-1">🖼️</span>
                <span className="text-sm">Upload Store Photos</span>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
          <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm">
            Preview Public Page
          </button>
          <button onClick={handleSave} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-colors shadow-md flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Save Profile & Update Geo-Tags
          </button>
        </div>
      </div>
    </div>
  );
}
