import React, { useState } from 'react';
import { useCustomer } from '@/context/CustomerContext';
import { X, MapPin, Phone, MessageCircle } from 'lucide-react';

interface CompleteProfileModalProps {
  onClose: () => void;
  onSuccess: () => void;
  allowSkip: boolean;
}

export default function CompleteProfileModal({ onClose, onSuccess, allowSkip }: CompleteProfileModalProps) {
  const { profile, updateProfileData } = useCustomer();
  
  const [phone, setPhone] = useState(profile?.phone || '');
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp || '');
  const [city, setCity] = useState(profile?.city || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !whatsapp.trim() || !city.trim()) {
      setError("Please fill all fields to continue.");
      return;
    }

    setSaving(true);
    try {
      await updateProfileData({ phone, whatsapp, city });
      onSuccess();
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-blue-600 p-6 text-white relative">
          {allowSkip && (
            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-xl font-bold mb-1">Complete Your Profile</h2>
          <p className="text-blue-100 text-sm">Please provide your contact details so jewelers can reach you regarding your inquiries.</p>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

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

          <div className="pt-4 flex flex-col gap-2">
            <button 
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save Details & Continue'}
            </button>
            
            {allowSkip && (
              <button 
                type="button"
                onClick={onClose}
                className="w-full bg-white text-gray-500 hover:text-gray-800 font-medium py-2 rounded-lg transition-colors"
              >
                Skip for now
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
