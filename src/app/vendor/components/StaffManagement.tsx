import React, { useState } from 'react';
import { Users, UserPlus, Shield, Mail, Trash2 } from 'lucide-react';

export default function StaffManagement() {
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'John Doe (You)', email: 'john@example.com', role: 'Owner', status: 'Active' },
    { id: 2, name: 'Ramesh Singh', email: 'ramesh.manager@example.com', role: 'Store Manager', status: 'Active' },
    { id: 3, name: 'Priya Sharma', email: 'priya.sales@example.com', role: 'Sales Executive', status: 'Pending Invite' }
  ]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Sales Executive');

  const handleInvite = () => {
    if (!inviteEmail) return;
    setStaffList([...staffList, {
      id: Date.now(),
      name: 'Pending Staff',
      email: inviteEmail,
      role: inviteRole,
      status: 'Pending Invite'
    }]);
    setIsInviteModalOpen(false);
    setInviteEmail('');
  };

  const handleRemove = (id: number) => {
    setStaffList(staffList.filter(s => s.id !== id));
  };

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
                    <button 
                      onClick={() => handleRemove(staff.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Staff"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                  <option value="Store Manager">Store Manager (Can edit rates & inventory)</option>
                  <option value="Sales Executive">Sales Executive (Can view orders & rates)</option>
                  <option value="Admin Assistant">Admin Assistant (Can manage profile)</option>
                </select>
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
