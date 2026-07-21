import React, { useState } from 'react';
import { INDIAN_STATES, ODISHA_DISTRICTS, ODISHA_DISTRICT_BLOCKS } from '@/lib/locations';
import { ChevronRight, ChevronLeft, Check, Upload, Save } from 'lucide-react';

export default function ProfileBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSave = () => {
    alert('Profile saved successfully! Your shop is now live and mapped to the Global Geo-Taxonomy.');
  };

  const renderProgressBar = () => {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    
    return (
      <div className="mb-10">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Shop Profile Builder</h2>
            <p className="text-gray-500 text-sm">Step {currentStep} of {totalSteps}</p>
          </div>
          <span className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {Math.round(progress)}% Completed
          </span>
        </div>
        
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between text-xs font-medium text-gray-400 px-1 mt-2">
            <span className={currentStep >= 1 ? "text-blue-600 font-bold" : ""}>1. Identity</span>
            <span className={currentStep >= 2 ? "text-blue-600 font-bold" : ""}>2. Location</span>
            <span className={currentStep >= 3 ? "text-blue-600 font-bold" : ""}>3. Assets</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-4xl min-h-[600px] flex flex-col relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/5 blur-[120px] rounded-full pointer-events-none"></div>

      {renderProgressBar()}

      <div className="flex-1 relative z-10">
        {/* Step 1: Core Identity */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Owner / Management Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner / Primary Contact Name</label>
                  <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input type="text" value={ownerDesignation} onChange={e => setOwnerDesignation(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" placeholder="e.g. Managing Director" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email Address</label>
                  <input type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Showroom Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name (As per GST/BIS)</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio / Tagline</label>
                  <textarea rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Phone Number</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Business Number</label>
                  <input type="text" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Step 2: Location Setup */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
            <section className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                <h3 className="text-lg font-bold text-gray-800">Geo-Taxonomy Location Setup</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">SEO Optimized</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">Select your exact location from the dropdowns below. This ensures your store appears in local search results instantly.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white">
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                  {country === 'Other' && <input type="text" placeholder="Enter Country" value={customCountry} onChange={e => setCustomCountry(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black mt-2 bg-white" />}
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode / Zip</label>
                  <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white" />
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street / Landmark</label>
                  <input type="text" value={landmark} onChange={e => setLandmark(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white" placeholder="e.g. Plot 45, Unit 2" />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Step 3: Assets & Preview */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Branding Assets</h3>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shop Logo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 cursor-pointer transition-colors bg-gray-50">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Upload Logo</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</span>
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Images (Max 4)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 cursor-pointer transition-colors bg-gray-50">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Upload Store Photos</span>
                    <span className="text-xs text-gray-400 mt-1">16:9 ratio recommended</span>
                  </div>
                </div>
              </div>
            </section>
            
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                 <Check className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="font-bold text-blue-900 mb-1">Ready to Publish!</h4>
                  <p className="text-sm text-blue-700">Your profile is complete. Click preview to see how customers will view your storefront, or click Finish & Publish to go live on the platform immediately.</p>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 mt-8 border-t border-gray-200 flex justify-between items-center">
        {currentStep > 1 ? (
          <button 
            onClick={prevStep} 
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        ) : (
          <div></div> // Spacer to keep Next button on the right
        )}

        <div className="flex gap-4">
          {currentStep === 3 && (
            <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm hidden md:block">
              Preview Public Page
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button 
              onClick={nextStep} 
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md"
            >
              Save & Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSave} 
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-colors shadow-md"
            >
              <Save className="w-4 h-4" /> Finish & Publish Profile
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
