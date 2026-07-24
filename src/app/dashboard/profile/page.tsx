'use client';

import React, { useState, useEffect } from 'react';
import { useCustomer } from '@/context/CustomerContext';
import { Save, User, Phone, MessageCircle, MapPin, Mail } from 'lucide-react';
import { INDIAN_STATES, ODISHA_DISTRICT_BLOCKS } from '@/lib/locations';

export default function ProfileSettingsPage() {
  const { profile, updateProfileData, loading } = useCustomer();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [block, setBlock] = useState('');
  const [localAddress, setLocalAddress] = useState('');
  const [pincode, setPincode] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setWhatsapp(profile.whatsapp || '');
      setCountry(profile.country || 'India');
      setState(profile.state || '');
      setDistrict(profile.district || '');
      setBlock(profile.block || '');
      setLocalAddress(profile.localAddress || '');
      setPincode(profile.pincode || '');
    }
  }, [profile]);

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-mono">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-12 text-center text-gray-500 font-mono">Please sign in to view settings.</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateProfileData({ name, phone, whatsapp, country, state, district, block, localAddress, pincode });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-500 text-sm">Manage your contact details. This information is shared with shops when you send an inquiry.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
                placeholder="Your Name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                value={profile.email}
                disabled
                className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email is managed by Google Sign-In and cannot be changed here.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
                  placeholder="Enter 10-digit number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Number</label>
              <div className="relative">
                <MessageCircle className="w-5 h-5 text-green-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="tel" 
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
                  placeholder="Enter WhatsApp number"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Country</label>
              <select value={country === 'India' ? 'India' : 'Other'} onChange={e => { setCountry(e.target.value === 'Other' ? '' : e.target.value); setState(''); setDistrict(''); setBlock(''); }} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white appearance-none">
                <option value="India">India</option>
                <option value="Other">Other</option>
              </select>
              {country !== 'India' && (
                <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black mt-2 bg-white" placeholder="Enter Country" />
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">State / Province</label>
              {country === 'India' ? (
                <select value={state} onChange={e => { setState(e.target.value); setDistrict(''); setBlock(''); }} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white appearance-none">
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : (
                <input type="text" value={state} onChange={e => setState(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white" placeholder="Enter State" />
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">District / Region</label>
              {(country === 'India' && state === 'Odisha') ? (
                <select value={district} onChange={e => { setDistrict(e.target.value); setBlock(''); }} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white appearance-none">
                  <option value="">Select District</option>
                  {Object.keys(ODISHA_DISTRICT_BLOCKS).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              ) : (
                <input type="text" value={district} onChange={e => setDistrict(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white" placeholder="Enter District" />
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">City / Block</label>
              {(country === 'India' && state === 'Odisha' && district) ? (
                <select value={block} onChange={e => setBlock(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white appearance-none">
                  <option value="">Select Block</option>
                  {(ODISHA_DISTRICT_BLOCKS[district] || []).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              ) : (
                <input type="text" value={block} onChange={e => setBlock(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white" placeholder="Enter City/Block" />
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Local Address</label>
              <input type="text" value={localAddress} onChange={e => setLocalAddress(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white" placeholder="House No, Street, Landmark" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Pincode</label>
              <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white" placeholder="Postal Code" />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            {success ? (
              <span className="text-green-600 font-bold text-sm animate-in fade-in">✅ Profile updated successfully!</span>
            ) : (
              <span className="text-gray-400 text-sm">Keep your profile updated.</span>
            )}
            
            <button 
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
