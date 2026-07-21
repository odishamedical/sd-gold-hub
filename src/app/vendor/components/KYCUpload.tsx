import React, { useState } from 'react';
import { ShieldCheck, Upload, FileText, CheckCircle } from 'lucide-react';

export default function KYCUpload() {
  const [gstFile, setGstFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [bisFile, setBisFile] = useState<File | null>(null);
  const [kycStatus, setKycStatus] = useState('pending'); // pending, submitted, verified

  const handleSubmit = () => {
    alert('KYC Documents submitted successfully! Our Super Admin will review them shortly.');
    setKycStatus('submitted');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-4xl">
      <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            Verification & KYC <ShieldCheck className="w-6 h-6 text-blue-500" />
          </h2>
          <p className="text-gray-500 text-sm max-w-xl">
            To get the trusted "Verified" badge on your store and products, you must upload valid government certificates.
          </p>
        </div>
        
        {kycStatus === 'pending' && (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-4 py-2 rounded-full border border-yellow-200 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
            Verification Pending
          </span>
        )}
        {kycStatus === 'submitted' && (
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-4 py-2 rounded-full border border-blue-200">
            Under Admin Review
          </span>
        )}
        {kycStatus === 'verified' && (
          <span className="bg-green-100 text-green-800 text-xs font-bold px-4 py-2 rounded-full border border-green-200 flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-600" /> Verified Seller
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* GST Certificate */}
        <div className="border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center bg-gray-50">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">GST Registration Certificate</h3>
            <p className="text-sm text-gray-500 mt-1">Required for tax compliance and business verification.</p>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <label className="flex items-center justify-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
              <Upload className="w-4 h-4" />
              <span>{gstFile ? gstFile.name : 'Upload PDF'}</span>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setGstFile(e.target.files?.[0] || null)} />
            </label>
          </div>
        </div>

        {/* PAN Card */}
        <div className="border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center bg-gray-50">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">Business / Owner PAN Card</h3>
            <p className="text-sm text-gray-500 mt-1">Required for financial processing and identity verification.</p>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <label className="flex items-center justify-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
              <Upload className="w-4 h-4" />
              <span>{panFile ? panFile.name : 'Upload Image'}</span>
              <input type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={(e) => setPanFile(e.target.files?.[0] || null)} />
            </label>
          </div>
        </div>

        {/* BIS Hallmark License */}
        <div className="border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center bg-blue-50/30">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-sm border border-blue-200 flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 text-lg">BIS Hallmark Registration (Optional)</h3>
            <p className="text-sm text-blue-700/70 mt-1">Upload your Bureau of Indian Standards license to unlock the premium "HUID Certified Jeweler" badge on your profile.</p>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <label className="flex items-center justify-center gap-2 px-6 py-2 bg-white border border-blue-200 rounded-lg text-blue-700 cursor-pointer hover:bg-blue-50 transition-colors shadow-sm">
              <Upload className="w-4 h-4" />
              <span>{bisFile ? bisFile.name : 'Upload PDF'}</span>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setBisFile(e.target.files?.[0] || null)} />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
        <button 
          onClick={handleSubmit}
          disabled={!gstFile || !panFile || kycStatus !== 'pending'}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors shadow-md flex items-center gap-2"
        >
          {kycStatus === 'pending' ? 'Submit for Verification' : 'Verification Submitted'}
        </button>
      </div>

    </div>
  );
}
