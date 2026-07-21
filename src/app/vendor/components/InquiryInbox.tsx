import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Clock, User, Package } from 'lucide-react';

interface Inquiry {
  id: string;
  shopId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerWhatsapp?: string;
  productId?: string;
  productTitle?: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  createdAt: any;
}

export default function InquiryInbox() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real app, this would fetch from Firestore `inquiries` where `shopId == currentUser`
  useEffect(() => {
    setTimeout(() => {
      setInquiries([
        {
          id: "inq-1",
          shopId: "shop-1",
          customerId: "user-1",
          customerName: "Rahul Sharma",
          customerPhone: "9876543210",
          customerWhatsapp: "9876543210",
          productId: "prod-1",
          productTitle: "22K Antique Temple Choker",
          message: "Is this design available in 18K? Can I customize the stone to Emerald?",
          status: 'new',
          createdAt: Date.now() - 1000 * 60 * 30 // 30 mins ago
        },
        {
          id: "inq-2",
          shopId: "shop-1",
          customerId: "user-2",
          customerName: "Priya Mohanty",
          productId: "prod-2",
          productTitle: "22K Gold Bangles",
          message: "I want to exchange my old gold for this. What is your exchange policy?",
          status: 'replied',
          createdAt: Date.now() - 1000 * 60 * 60 * 24 // 1 day ago
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStatusChange = (id: string, newStatus: Inquiry['status']) => {
    setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    // In real app, updateDoc in Firestore
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-600" /> Unified Inquiry Inbox
        </h2>
        <p className="text-gray-500 text-sm">Manage all leads and customer inquiries from the marketplace here.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No inquiries yet. When customers contact you, leads will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {inquiries.map(inq => (
              <div key={inq.id} className={`p-6 transition-colors ${inq.status === 'new' ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                <div className="flex flex-col lg:flex-row gap-6">
                  
                  {/* Left: Customer Info */}
                  <div className="lg:w-1/4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{inq.customerName}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {new Date(inq.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {inq.customerPhone && (
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" /> {inq.customerPhone}
                      </div>
                    )}
                  </div>

                  {/* Middle: Message Context */}
                  <div className="lg:w-2/4">
                    {inq.productTitle && (
                      <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">
                        <Package className="w-3 h-3" /> Regarding: {inq.productTitle}
                      </div>
                    )}
                    <p className="text-gray-700 text-sm italic border-l-2 border-gray-200 pl-3 mb-4">
                      "{inq.message}"
                    </p>
                    
                    <div className="flex gap-2 mt-4">
                      {inq.customerWhatsapp && (
                        <a 
                          href={`https://wa.me/${inq.customerWhatsapp.replace(/\D/g,'')}?text=Hi ${inq.customerName}, regarding your inquiry about ${inq.productTitle}: `} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => handleStatusChange(inq.id, 'replied')}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded shadow-sm transition-colors"
                        >
                          Reply on WhatsApp
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right: Status */}
                  <div className="lg:w-1/4 flex flex-col items-end justify-between">
                    <div>
                      {inq.status === 'new' && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200">New Lead</span>}
                      {inq.status === 'replied' && <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-200">Replied</span>}
                      {inq.status === 'closed' && <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">Closed</span>}
                    </div>
                    
                    {inq.status !== 'closed' && (
                      <button 
                        onClick={() => handleStatusChange(inq.id, 'closed')}
                        className="text-xs font-bold text-gray-500 hover:text-gray-700 mt-4"
                      >
                        Mark as Closed
                      </button>
                    )}
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
