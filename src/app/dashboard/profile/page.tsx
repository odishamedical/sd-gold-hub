'use client';

import React, { useState, useEffect } from 'react';
import { useCustomer } from '@/context/CustomerContext';
import { Save, User, Phone, MessageCircle, MapPin, Mail } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { profile, updateProfileData, loading } = useCustomer();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setWhatsapp(profile.whatsapp || '');
      setCity(profile.city || '');
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
      await updateProfileData({ name, phone, whatsapp, city });
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

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">City / Location</label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-red-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
                placeholder="e.g. Bhubaneswar, Odisha"
              />
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
