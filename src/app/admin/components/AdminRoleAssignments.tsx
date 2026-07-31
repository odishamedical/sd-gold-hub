import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Shield, Mail, Trash2, Key, CheckSquare, Square } from 'lucide-react';

const ADMIN_MODULES = [
  { id: 'shops', label: 'Master Vendor CRM' },
  { id: 'applications', label: 'Pending Applications' },
  { id: 'verifications', label: 'KYC Verifications' },
  { id: 'product_directory', label: 'Global Directory & Filters' },
  { id: 'product_review', label: 'Review Queue' },
  { id: 'product_add', label: 'Add Product (Map Shop)' },
  { id: 'subscriptions', label: 'Premium Subscriptions' },
  { id: 'ads', label: 'Global Ad Engine' },
  { id: 'crawler', label: 'Google Data Crawler' },
  { id: 'vendor_activity', label: 'Vendor Activity Stream' },
  { id: 'jobs', label: 'ATS & Job Board' },
  { id: 'layout_builder', label: 'Page Layout Builder' },
  { id: 'activity_log', label: 'Admin Activity Log' }
];

export default function AdminRoleAssignments() {
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['shops']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "admin_invites"));
      setInvites(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (moduleId: string) => {
    if (selectedPermissions.includes(moduleId)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== moduleId));
    } else {
      setSelectedPermissions([...selectedPermissions, moduleId]);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return alert("Email is required");
    if (selectedPermissions.length === 0) return alert("Select at least one permission");

    setIsSubmitting(true);
    try {
      const cleanEmail = inviteEmail.trim().toLowerCase();
      
      // Save invite
      await setDoc(doc(db, "admin_invites", cleanEmail), {
        email: cleanEmail,
        role: "staff",
        permissions: selectedPermissions,
        createdAt: new Date().toISOString()
      });

      // We also preemptively create/update the users collection to grant access immediately upon login
      await setDoc(doc(db, "users", cleanEmail), {
        email: cleanEmail,
        role: "staff",
        adminPermissions: selectedPermissions,
        createdAt: new Date().toISOString()
      }, { merge: true });

      alert(`Invite sent to ${cleanEmail}! They can now log in with their Google account to access the panel.`);
      setInviteEmail('');
      setSelectedPermissions(['shops']);
      fetchInvites();
    } catch (err: any) {
      console.error(err);
      alert("Failed to send invite: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (email: string) => {
    if (!confirm(`Are you sure you want to revoke admin access for ${email}?`)) return;
    try {
      await deleteDoc(doc(db, "admin_invites", email));
      
      // Downgrade user back to regular buyer
      await setDoc(doc(db, "users", email), {
        role: "buyer",
        adminPermissions: []
      }, { merge: true });

      fetchInvites();
    } catch (err) {
      console.error(err);
      alert("Failed to revoke access.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col lg:flex-row h-[calc(100vh-120px)]">
      
      {/* LEFT: Invite Form */}
      <div className="w-full lg:w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" /> Appoint Admin Staff
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Delegate specific modules to your team without giving them Master access.
          </p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 mb-1">Staff Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="staff@golddunia.com"
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 mb-3 flex items-center justify-between">
              Module Permissions
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">{selectedPermissions.length} selected</span>
            </label>
            <div className="space-y-2 bg-white p-3 border border-gray-200 rounded-xl max-h-[300px] overflow-y-auto custom-scrollbar">
              {ADMIN_MODULES.map(mod => (
                <div 
                  key={mod.id} 
                  onClick={() => togglePermission(mod.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors border ${selectedPermissions.includes(mod.id) ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-transparent border-transparent hover:bg-gray-50 text-gray-700'}`}
                >
                  {selectedPermissions.includes(mod.id) ? <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" /> : <Square className="w-4 h-4 text-gray-300 shrink-0" />}
                  <span className="text-xs font-bold">{mod.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleInvite}
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Inviting..." : <><Key className="w-4 h-4" /> Grant Access</>}
          </button>
        </div>
      </div>

      {/* RIGHT: Active Staff */}
      <div className="w-full lg:w-2/3 flex flex-col bg-white">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white z-10">
          <h3 className="text-lg font-bold text-gray-900">Active Admin Staff</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold">{invites.length} Members</span>
        </div>

        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : invites.length === 0 ? (
            <div className="text-center py-20">
              <Shield className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-400">No Staff Appointed</h3>
              <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">Use the form to grant specific module access to your team members.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {invites.map(invite => (
                <div key={invite.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors bg-gray-50/50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                        {invite.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm truncate max-w-[150px]">{invite.email}</div>
                        <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{invite.role || 'Staff'}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRevoke(invite.email)}
                      className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Revoke Access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200/60">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Granted Modules ({invite.permissions?.length || 0})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {invite.permissions?.map((p: string) => {
                        const m = ADMIN_MODULES.find(mod => mod.id === p);
                        return (
                          <span key={p} className="bg-white border border-gray-200 text-gray-700 text-[10px] px-2 py-1 rounded shadow-sm">
                            {m ? m.label : p}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
