import React, { useState, useEffect } from 'react';
import { INDIAN_STATES, ODISHA_DISTRICTS, ODISHA_DISTRICT_BLOCKS } from '@/lib/locations';
import { ChevronRight, ChevronLeft, Check, Upload, Save, Building } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import { getShopById } from '@/lib/firestore/products';
import { saveShop } from '@/lib/firestore/shops';

export default function ProfileBuilder({ shopId }: { shopId?: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Personal Info
  const [ownerName, setOwnerName] = useState('');
  const [ownerDesignation, setOwnerDesignation] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');

  // Business Info
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    whatsapp: '',
    website: '',
    email: '',
    establishmentYear: '',
    gstNumber: '',
    hallmarkLicence: '',
    logoUrl: '',
    coverImages: [] as string[]
  });

  // Geo-Taxonomy Address Logic
  const [country, setCountry] = useState('India');
  const [customCountry, setCustomCountry] = useState('');
  const [state, setState] = useState('Odisha');
  const [customState, setCustomState] = useState('');
  const [district, setDistrict] = useState('');
  const [customDistrict, setCustomDistrict] = useState('');
  const [block, setBlock] = useState('');
  const [customBlock, setCustomBlock] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');

  useEffect(() => {
    if (!shopId) return;
    async function loadShop() {
      setLoading(true);
      try {
        const shop = await getShopById(shopId!);
        if (shop) {
          setFormData({
            name: shop.name || '',
            bio: shop.description || '',
            phone: shop.phone || '',
            whatsapp: shop.whatsappNumber || '',
            website: shop.website || '',
            email: shop.email || '',
            establishmentYear: shop.establishmentYear || '',
            gstNumber: shop.gstNumber || '',
            hallmarkLicence: shop.hallmarkLicence || '',
            logoUrl: shop.logoUrl || '',
            coverImages: shop.coverImages || []
          });
          
          if (shop.location) {
             if (shop.location.country) setCountry(shop.location.country);
             if (shop.location.state) setState(shop.location.state);
             if (shop.location.district) setDistrict(shop.location.district);
             if (shop.location.city) setBlock(shop.location.city);
             if (shop.location.pincode) setPincode(shop.location.pincode);
          }
          if (shop.address) setLandmark(shop.address);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadShop();
  }, [shopId]);

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSave = async () => {
    if (!shopId) return alert("Error: User not authenticated.");
    setIsSaving(true);
    try {
      const addressString = `${landmark ? landmark + ', ' : ''}${block ? block + ', ' : ''}${district}, ${state}, ${pincode}`;
      await saveShop({
        id: shopId,
        name: formData.name,
        description: formData.bio,
        phone: formData.phone,
        whatsappNumber: formData.whatsapp,
        website: formData.website,
        email: formData.email,
        establishmentYear: formData.establishmentYear,
        gstNumber: formData.gstNumber,
        hallmarkLicence: formData.hallmarkLicence,
        logoUrl: formData.logoUrl,
        coverImages: formData.coverImages,
        address: addressString,
        location: {
           country: country === 'Other' ? customCountry : country,
           state: country === 'India' && state !== 'Other' ? state : customState,
           district: country === 'India' && state === 'Odisha' && district !== 'Other' ? district : customDistrict,
           block: block || customBlock,
           city: block || customBlock,
           pincode: pincode
        },
        googlePlaceId: shopId
      });
      alert('Profile saved successfully! Your shop is now updated.');
    } catch (e) {
      console.error(e);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
              <div className="mb-4 border-b border-gray-100 pb-2">
                <h3 className="text-lg font-bold text-gray-800">Owner / Management Details</h3>
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  This information is kept strictly confidential for official communication only. It will NOT be published on your public profile.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner / Primary Contact Name</label>
                  <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input type="text" value={ownerDesignation} onChange={e => setOwnerDesignation(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" placeholder="e.g. Managing Director" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personal Phone (Private)</label>
                  <input type="text" placeholder="e.g. +91 9876543210" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email Address (Private)</label>
                  <input type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" />
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 border-b border-gray-100 pb-2">
                <h3 className="text-lg font-bold text-gray-800">Showroom Identity</h3>
                <p className="text-xs text-gray-500 mt-1">This information will be visible to all customers on your public directory page.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name (As per GST/BIS)</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio / Tagline</label>
                  <textarea rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" />
                </div>
                
                {/* Phones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Phone 1</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" placeholder="Primary store number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Phone 2 (Optional)</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" placeholder="Secondary store number" />
                </div>

                {/* WhatsApps */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Business</label>
                  <input type="text" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" placeholder="Primary WhatsApp" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Official Website</label>
                  <input type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" placeholder="https://www.yourshop.com" />
                </div>

                {/* Trust & Compliance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Establishment Year</label>
                  <input type="text" value={formData.establishmentYear} onChange={e => setFormData({...formData, establishmentYear: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" placeholder="e.g. 1995" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <input type="text" value={formData.gstNumber} onChange={e => setFormData({...formData, gstNumber: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" placeholder="21AAAAA0000A1Z5" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">BIS Hallmark Licence (HUID)</label>
                  <input type="text" value={formData.hallmarkLicence} onChange={e => setFormData({...formData, hallmarkLicence: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black bg-white" placeholder="HM/Bhubaneswar/..." />
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
              
              {/* Dedicated Logo Upload Section */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-4">Shop Logo</h4>
                <div className="flex gap-6 items-start">
                  <div className="w-24 h-24 bg-white rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0 relative">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-xs text-center px-2">No Logo</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <ImageUploader 
                      label="Upload Dedicated Logo"
                      aspectRatio="square"
                      value={formData.logoUrl}
                      onChange={(url) => setFormData({...formData, logoUrl: url})}
                    />
                  </div>
                </div>
              </div>

              {/* Cover Images Bento Manager */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-700">Cover Images (Bento Layout)</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Upload 5 cover images. You can also quickly assign any of these to be your shop logo.</p>
                  </div>
                  {formData.logoUrl && (
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Active Logo:</span>
                      <img src={formData.logoUrl} alt="Logo" className="w-6 h-6 rounded-full object-cover" />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Hero Slot (Index 0) */}
                  <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-blue-200 shadow-sm relative">
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl z-10">
                      HERO (MAIN)
                    </div>
                    <ImageUploader 
                      label="Upload Hero Image"
                      aspectRatio="portrait"
                      value={formData.coverImages[0] || ""}
                      onChange={(url) => {
                        const newCovers = [...formData.coverImages];
                        newCovers[0] = url;
                        setFormData({...formData, coverImages: newCovers});
                      }}
                    />
                    {formData.coverImages[0] && (
                      <button 
                        onClick={() => setFormData({...formData, logoUrl: formData.coverImages[0]})}
                        className={`mt-2 w-full text-xs font-bold py-1.5 rounded transition-colors ${formData.logoUrl === formData.coverImages[0] ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                      >
                        {formData.logoUrl === formData.coverImages[0] ? '✓ Current Logo' : 'Set as Logo'}
                      </button>
                    )}
                  </div>

                  {/* Secondary Slots (Index 1 to 4) */}
                  <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(idx => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm relative">
                        <ImageUploader 
                          label={`Grid Image ${idx}`}
                          aspectRatio="square"
                          value={formData.coverImages[idx] || ""}
                          onChange={(url) => {
                            const newCovers = [...formData.coverImages];
                            while (newCovers.length <= idx) newCovers.push("");
                            newCovers[idx] = url;
                            setFormData({...formData, coverImages: newCovers});
                          }}
                        />
                        {formData.coverImages[idx] && (
                          <div className="flex gap-2 mt-2">
                            <button 
                              onClick={() => {
                                const newCovers = [...formData.coverImages];
                                const temp = newCovers[0];
                                newCovers[0] = newCovers[idx];
                                newCovers[idx] = temp || "";
                                setFormData({...formData, coverImages: newCovers});
                              }}
                              className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold py-1.5 rounded transition-colors"
                            >
                              Make Hero
                            </button>
                            <button 
                              onClick={() => setFormData({...formData, logoUrl: formData.coverImages[idx]})}
                              className={`flex-1 text-[10px] font-bold py-1.5 rounded transition-colors ${formData.logoUrl === formData.coverImages[idx] ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                            >
                              {formData.logoUrl === formData.coverImages[idx] ? '✓ Logo' : 'Set Logo'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
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
