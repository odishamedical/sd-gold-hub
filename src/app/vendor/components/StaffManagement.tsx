import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Mail, Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

export default function StaffManagement({ shopId, subscriptionTier = "pro" }: { shopId: string, subscriptionTier?: string }) {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStaff() {
      if (!shopId) {
        setStaffList([
          { id: 1, name: 'John Doe (You)', email: 'john@example.com', role: 'Owner', status: 'Active' },
          { id: 2, name: 'Ramesh Singh', email: 'ramesh.manager@example.com', role: 'Store Manager', status: 'Active' }
        ]);
        setLoading(false);
        return;
      }
      
      try {
        const d = await getDoc(doc(db, 'shops', shopId));
        if (d.exists()) {
          setStaffList(d.data().staff || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStaff();
  }, [shopId]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Sales Executive');
  const [inviteCode, setInviteCode] = useState('');
  const [invitePermissions, setInvitePermissions] = useState<string[]>(['products', 'inquiries']);

  const togglePermission = (permId: string) => {
    if (invitePermissions.includes(permId)) {
      setInvitePermissions(invitePermissions.filter(p => p !== permId));
    } else {
      setInvitePermissions([...invitePermissions, permId]);
    }
  };

  const updateStaffInDb = async (newStaffList: any[]) => {
    setStaffList(newStaffList);
    if (!shopId) return;
    try {
      await updateDoc(doc(db, 'shops', shopId), { staff: newStaffList });
    } catch (err) {
      console.error(err);
      alert('Failed to update staff in database.');
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail || !inviteCode) {
      alert("Email and Access Code are required.");
      return;
    }
    
    // Check staff quota based on tier (owner counts as 1 in length but we can just count non-owner or total staff length minus 1)
    const maxStaff = subscriptionTier.toLowerCase() === "advance" || subscriptionTier.toLowerCase() === "pro_advance" ? 4 : 2; // Owner + N staff
    if (staffList.length >= maxStaff) {
      alert(`Staff quota exceeded! Your current tier (${subscriptionTier.toUpperCase()}) allows a maximum of ${maxStaff - 1} invited staff member(s). Please call support to upgrade to Advance.`);
      return;
    }

    const cleanEmail = inviteEmail.trim().toLowerCase();
    const newStaff = {
      id: Date.now(),
      name: 'Pending Staff',
      email: cleanEmail,
      role: inviteRole,
      status: 'Pending Invite',
      accessCode: inviteCode,
      permissions: invitePermissions
    };
    
    // Save to shop's staff array for display
    await updateStaffInDb([...staffList, newStaff]);
    
    // Save to global staff_invites collection for the staff onboarding flow
    if (shopId && shopId !== 'test_vendor') {
      try {
        await setDoc(doc(db, 'staff_invites', cleanEmail), {
          bossUid: shopId,
          email: cleanEmail,
          role: inviteRole,
          accessCode: inviteCode,
          permissions: invitePermissions,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Failed to create global staff invite:", err);
      }
    }

    setIsInviteModalOpen(false);
    setInviteEmail('');
    setInviteCode('');
    setInvitePermissions(['products', 'inquiries']);
  };

  const handleRemove = async (id: number) => {
    const staffToRemove = staffList.find(s => s.id === id);
    await updateStaffInDb(staffList.filter(s => s.id !== id));
    
    // If they were still pending, delete their invite from global collection
    if (staffToRemove && staffToRemove.status === 'Pending Invite') {
      try {
        const { deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'staff_invites', staffToRemove.email));
      } catch (err) {
        console.error("Failed to delete pending invite:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 shadow-sm flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-5xl">
      <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            Staff & Team Management <Users className="w-6 h-6 text-blue-500" />
          </h2>
          <p className="text-gray-500 text-sm max-w-xl">
            Invite your showroom managers and sales executives to manage daily gold rates and inventory without sharing your owner password.
          </p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Invite Staff
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
              <th className="p-4">Staff Member</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {staffList.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      {staff.name.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">{staff.name}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-500 text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" /> {staff.email}
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    <Shield className="w-3 h-3" /> {staff.role}
                  </span>
                </td>
                <td className="p-4">
                  {staff.status === 'Active' ? (
                    <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Active
                    </span>
                  ) : (
                    <span className="text-yellow-600 text-xs font-bold flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Pending
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {staff.role !== 'Owner' && (
                    <div className="flex items-center justify-end gap-1">
                      {staff.accessCode && staff.status === 'Pending Invite' && (
                        <a 
                          href={`https://wa.me/?text=${encodeURIComponent(`Hello! You have been invited as ${staff.role} for our Gold Dunia shop. Your Access Code is: ${staff.accessCode}. Please go to https://golddunia.com/vendor and log in with your email (${staff.email}) to claim your role.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                          title="Send via WhatsApp"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </a>
                      )}
                      <button 
                        onClick={() => handleRemove(staff.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Staff"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal (Simple Inline rendering for demo) */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Invite Team Member</h3>
              <p className="text-sm text-gray-500 mt-1">An invitation email will be sent to this address.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  placeholder="manager@showroom.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Role</label>
                <select 
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Store Manager">Store Manager</option>
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Admin Assistant">Admin Assistant</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Code (Create a password for them)</label>
                <input 
                  type="text" 
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  placeholder="e.g. STAFF2026"
                />
                <p className="text-xs text-gray-500 mt-1">They will need this code to claim their staff account.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Granular Permissions</label>
                <div className="space-y-2 border border-gray-200 p-3 rounded-lg bg-gray-50 max-h-48 overflow-y-auto">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={invitePermissions.includes('rates')} onChange={() => togglePermission('rates')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-gray-800">Global Pricing Engine (Gold Rates & Making Charges)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={invitePermissions.includes('products')} onChange={() => togglePermission('products')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-gray-800">Manage Products & Inventory</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={invitePermissions.includes('inquiries')} onChange={() => togglePermission('inquiries')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-gray-800">Customer Inbox (Chats & Inquiries)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={invitePermissions.includes('orders')} onChange={() => togglePermission('orders')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-gray-800">Order Management & Logistics</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={invitePermissions.includes('auctions')} onChange={() => togglePermission('auctions')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-gray-800">Auctions</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={invitePermissions.includes('jobs')} onChange={() => togglePermission('jobs')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-gray-800">Job Postings</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleInvite}
                disabled={!inviteEmail}
                className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
