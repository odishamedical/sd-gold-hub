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
  const [city, setCity] = useState(profile?.city || profile?.block || '');
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (sameAsPhone) setWhatsapp(val);
  };

  const handleSameAsPhoneToggle = (checked: boolean) => {
    setSameAsPhone(checked);
    if (checked) setWhatsapp(phone);
  };

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0A1021] border border-[#C5A059]/40 rounded-2xl shadow-[0_0_50px_rgba(197,160,89,0.15)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 font-sans">
        <div className="bg-[#141C33]/80 p-6 text-white relative border-b border-[#C5A059]/20">
          {allowSkip && (
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-[#C5A059] transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-xl font-bold mb-1 font-serif text-[#C5A059] tracking-wide">Complete Your Profile</h2>
          <p className="text-gray-400 text-sm">Please provide your contact details so jewelers can reach you regarding your inquiries.</p>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="tel" 
                value={phone}
                onChange={e => handlePhoneChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#2A344A] bg-[#0E1528] text-white rounded-xl focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all"
                placeholder="Enter 10-digit number"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">WhatsApp Number</label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={sameAsPhone}
                  onChange={e => handleSameAsPhoneToggle(e.target.checked)}
                  className="w-3 h-3 text-[#C5A059] bg-[#0E1528] border-[#2A344A] rounded focus:ring-[#C5A059]"
                />
                <span className="text-[10px] text-gray-400">Same as phone</span>
              </label>
            </div>
            <div className="relative">
              <MessageCircle className="w-5 h-5 text-green-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="tel" 
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                disabled={sameAsPhone}
                className="w-full pl-10 pr-4 py-2.5 border border-[#2A344A] bg-[#0E1528] text-white rounded-xl focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all disabled:opacity-50"
                placeholder="Enter WhatsApp number"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">City / Location</label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-red-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#2A344A] bg-[#0E1528] text-white rounded-xl focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all"
                placeholder="e.g. Bhubaneswar, Odisha"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <button 
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-[#E3B061] to-[#C58B39] text-[#060A14] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 flex justify-center items-center uppercase text-[11px] tracking-widest"
            >
              {saving ? 'Saving...' : 'Save Details & Continue'}
            </button>
            
            {allowSkip && (
              <button 
                type="button"
                onClick={onClose}
                className="w-full bg-[#141C33] text-gray-400 font-bold py-3 rounded-xl hover:bg-[#1A2440] hover:text-white transition-colors text-[11px] uppercase tracking-widest border border-[#2A344A]"
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
