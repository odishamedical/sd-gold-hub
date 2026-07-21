import React, { useState } from 'react';

export default function ProfileBuilder() {
  const [formData, setFormData] = useState({
    name: 'Shree Gold Palace',
    bio: 'Specialists in 22K Hallmarked Gold and Diamond Jewelry',
    address: 'Plot 45, Unit 2, Ashok Nagar, Bhubaneswar',
    phone: '0674 253 1234',
    whatsapp: '+919876543210'
  });

  const handleSave = () => {
    alert('Profile saved successfully!');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop Profile Builder</h2>
        <p className="text-gray-500 text-sm">Upload your branding and business details. This information will be visible on your public directory page.</p>
      </div>

      <div className="space-y-8">
        {/* Images Section */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Branding & Images</h3>
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

        {/* Details Section */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
              <textarea 
                rows={3}
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
              <input 
                type="text" 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input 
                type="text" 
                value={formData.whatsapp}
                onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Preview Public Page
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
