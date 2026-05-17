"use client";

import React, { useState } from "react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("users");

  // System Configurations State
  const [goldMarkup, setGoldMarkup] = useState("1.25%");
  const [makingGst, setMakingGst] = useState("18%");
  const [goldGst, setGoldGst] = useState("3%");
  const [bvcPremium, setBvcPremium] = useState("0.15%");
  const [sequelFlatRate, setSequelFlatRate] = useState("₹ 2,500");

  // Users & Governance State
  const [users, setUsers] = useState([
    {
      id: "UID-849201",
      name: "Shyam Dash",
      email: "shyamdash@gmail.com",
      role: "super_admin", // The One and Only Sovereign Super Admin
      status: "ACTIVE",
      projects: ["sd-gold-hub", "sd-auth-center", "sd-bhulia-hub", "sd-dehapa-hub"],
      lastLogin: "May 17, 2026 - 18:25 IST"
    },
    {
      id: "UID-773829",
      name: "Vikram Malhotra",
      email: "vikram@odishamedical.com",
      role: "admin", // Delegated Admin
      status: "ACTIVE",
      projects: ["sd-gold-hub", "sd-auth-center"],
      lastLogin: "May 17, 2026 - 14:10 IST"
    },
    {
      id: "UID-663920",
      name: "IRA Jewels Owner",
      email: "owner@irajewels.com",
      role: "vendor",
      status: "ACTIVE",
      projects: ["sd-gold-hub"],
      lastLogin: "May 16, 2026 - 09:30 IST"
    },
    {
      id: "UID-552819",
      name: "Rajesh Sharma",
      email: "rajesh.sharma@gmail.com",
      role: "user",
      status: "ACTIVE",
      projects: ["sd-gold-hub"],
      lastLogin: "May 17, 2026 - 14:30 IST"
    }
  ]);

  // Modal State for Adding User/Vendor/Admin
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");
  const [newUserProjects, setNewUserProjects] = useState(["sd-gold-hub"]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: `UID-${Math.floor(Math.random() * 800000 + 100000)}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: "ACTIVE",
      projects: newUserProjects,
      lastLogin: "Never (Pending Invitation Handshake)"
    };
    setUsers([newUser, ...users]);
    setShowAddUserModal(false);
    setNewUserName(""); setNewUserEmail("");
    alert(`👑 Sovereign Identity Minted Successfully!\n\nID: ${newUser.id}\nName: ${newUser.name}\nEmail: ${newUser.email}\nRole Tag: ${newUser.role.toUpperCase()}\nAllocated Hubs: ${newUser.projects.join(", ")}\n\nSecure API handshake established with sd-auth-center SSO engine. Invitation dispatched.`);
  };

  const handleUpdateRole = (id: string, newRole: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    alert(`🔄 Sovereign Role Updated to ${newRole.toUpperCase()} for ${id}.\n\nChanges synchronized across SD Auth Center SSO network.`);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`⚙️ System Global Variables Updated!\n\nGold Markup: ${goldMarkup}\nGold GST: ${goldGst}\nMaking GST: ${makingGst}\nBVC Insurance Premium: ${bvcPremium}\nSequel Armored Base Rate: ${sequelFlatRate}\n\nSpree Commerce pricing matrix recalculated successfully.`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#C5A059] tracking-wider mb-2">System Settings & Governance</h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">Global pricing matrix, BVC insurance rules & universal user/vendor/admin registry.</p>
        </div>
        <button 
          onClick={() => setShowAddUserModal(true)}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] rounded-xl text-xs font-bold uppercase tracking-widest text-[#0A1021] hover:brightness-110 transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>+ Provision User / Vendor / Admin</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-8 border-b border-[#2A344A] mb-8 font-mono">
        <button 
          onClick={() => setActiveTab("users")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === "users" ? "text-[#C5A059]" : "text-gray-500 hover:text-white"}`}
        >
          Sovereign Identity Registry
          {activeTab === "users" && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.5)]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("config")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === "config" ? "text-[#C5A059]" : "text-gray-500 hover:text-white"}`}
        >
          Global Pricing & Logistics Matrix
          {activeTab === "config" && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.5)]"></div>}
        </button>
      </div>

      {/* Tab 1: Users & Governance Registry */}
      {activeTab === "users" && (
        <div className="bg-[#0E1528] border border-[#2A344A] rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2A344A] bg-[#141C33]/50 text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                  <th className="p-5">Sovereign Identity / UID</th>
                  <th className="p-5">Registered Email</th>
                  <th className="p-5">Ecosystem Role Tag</th>
                  <th className="p-5">Allocated Hubs</th>
                  <th className="p-5">Last Handshake</th>
                  <th className="p-5 text-right">Governance Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A344A] text-xs font-sans">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#141C33]/30 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#141C33] border border-[#C5A059]/30 flex items-center justify-center font-mono font-bold text-[#C5A059] text-sm shrink-0 group-hover:border-[#C5A059] transition-colors">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm mb-0.5">{u.name}</p>
                          <span className="text-[10px] font-mono text-gray-500">{u.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 font-mono text-gray-300">{u.email}</td>
                    <td className="p-5 font-mono">
                      {u.role === 'super_admin' ? (
                        <span className="bg-[#C5A059]/10 border border-[#C5A059] text-[#C5A059] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg inline-block shadow">
                          👑 Super Admin (Sovereign Lock)
                        </span>
                      ) : (
                        <select 
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className={`bg-[#141C33] border text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer ${u.role === 'admin' ? 'border-[#C5A059] text-[#C5A059]' : u.role === 'vendor' ? 'border-blue-500/40 text-blue-400' : 'border-gray-600 text-gray-300'}`}
                        >
                          <option value="admin">Admin (Hub Governance)</option>
                          <option value="vendor">Vendor Merchant</option>
                          <option value="user">Sovereign User</option>
                        </select>
                      )}
                    </td>
                    <td className="p-5 font-mono text-xs text-gray-400 max-w-[200px] truncate">
                      {u.projects.join(", ")}
                    </td>
                    <td className="p-5 font-mono text-gray-400 text-[11px]">{u.lastLogin}</td>
                    <td className="p-5 text-right font-mono">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20 uppercase tracking-widest">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Global Configuration Matrix */}
      {activeTab === "config" && (
        <form onSubmit={handleSaveConfig} className="bg-[#0E1528] border border-[#2A344A] rounded-2xl p-8 shadow-xl max-w-4xl animate-in fade-in duration-500 space-y-8 font-mono text-xs">
          
          <div className="bg-[#141C33] p-5 rounded-xl border border-[#2A344A] flex flex-col gap-2 font-sans">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <span className="text-[#C5A059]">🛡️</span> Spree Commerce Dynamic Pricing Matrix
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              These variables automatically regulate the Spree Commerce backend calculation engine for real-time gold rate adjustments, BVC Insurance premiums, and Sequel Armored logistics flat rates across all vendor nodes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-gray-400 uppercase tracking-widest text-[10px]">Gold Rate Ecosystem Markup</label>
              <input 
                type="text" 
                required
                value={goldMarkup}
                onChange={(e) => setGoldMarkup(e.target.value)}
                className="bg-[#141C33] border border-[#2A344A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] font-bold tracking-wider"
              />
              <span className="text-[10px] text-gray-500">Premium added to MCX live base rate.</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-400 uppercase tracking-widest text-[10px]">BVC Indemnity Insurance Premium</label>
              <input 
                type="text" 
                required
                value={bvcPremium}
                onChange={(e) => setBvcPremium(e.target.value)}
                className="bg-[#141C33] border border-[#2A344A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] font-bold tracking-wider"
              />
              <span className="text-[10px] text-gray-500">Percentage charged on total jewelry valuation.</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-400 uppercase tracking-widest text-[10px]">Official Gold GST Slab</label>
              <input 
                type="text" 
                required
                value={goldGst}
                onChange={(e) => setGoldGst(e.target.value)}
                className="bg-[#141C33] border border-[#2A344A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] font-bold tracking-wider"
              />
              <span className="text-[10px] text-gray-500">Mandatory Government of India tax slab.</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-400 uppercase tracking-widest text-[10px]">Making Charges GST Slab</label>
              <input 
                type="text" 
                required
                value={makingGst}
                onChange={(e) => setMakingGst(e.target.value)}
                className="bg-[#141C33] border border-[#2A344A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] font-bold tracking-wider"
              />
              <span className="text-[10px] text-gray-500">Applicable tax on artisan craftsmanship.</span>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-gray-400 uppercase tracking-widest text-[10px]">Sequel Secure Logistics Base Transit Rate</label>
              <input 
                type="text" 
                required
                value={sequelFlatRate}
                onChange={(e) => setSequelFlatRate(e.target.value)}
                className="bg-[#141C33] border border-[#2A344A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059] font-bold tracking-wider"
              />
              <span className="text-[10px] text-gray-500">Insured armored transit flat fee for pan-India delivery.</span>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl mt-8 font-sans cursor-pointer"
          >
            Save Global Configuration Matrix
          </button>
        </form>
      )}

      {/* Add User / Vendor / Admin Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#0E1528] border border-[#C5A059] rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(197,160,89,0.2)] relative">
            <button 
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors w-8 h-8 rounded-full bg-[#141C33] border border-[#2A344A] flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-xl font-serif text-[#C5A059] font-bold mb-1">Provision Sovereign Identity</h2>
            <p className="text-xs text-gray-400 mb-6">Mint a new authenticated user, vendor merchant, or admin clearance across the SD Auth Center network.</p>

            <form onSubmit={handleAddUser} className="space-y-4 font-mono text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 uppercase tracking-widest text-[10px]">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="bg-[#141C33] border border-[#2A344A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-400 uppercase tracking-widest text-[10px]">Registered Google Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. ramesh@gmail.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="bg-[#141C33] border border-[#2A344A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-400 uppercase tracking-widest text-[10px]">Ecosystem Role Tag</label>
                <select 
                  value={newUserRole} 
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="bg-[#141C33] border border-[#2A344A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="user">Sovereign User (Customer)</option>
                  <option value="vendor">Vendor Merchant (Store Owner)</option>
                  <option value="admin">Admin (Hub Governance)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-400 uppercase tracking-widest text-[10px]">Allocated Ecosystem Hubs</label>
                <div className="bg-[#141C33] border border-[#2A344A] rounded-xl p-4 flex flex-col gap-2 font-sans">
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input type="checkbox" defaultChecked disabled className="accent-[#C5A059]" />
                    <span>SD Gold Hub (Primary)</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#C5A059]" />
                    <span>SD Auth Center SSO</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#C5A059]" />
                    <span>SD Bhulia Hub</span>
                  </label>
                </div>
              </div>

              <div className="bg-[#141C33] p-3 rounded-xl border border-[#2A344A] text-[10px] text-gray-400 leading-relaxed mt-2 font-sans">
                ⚠️ <strong className="text-[#C5A059]">Sovereignty Lock:</strong> Absolute Super Admin clearance is restricted to founding principals (Shyam Dash) and cannot be provisioned via this delegator.
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#996515] text-[#0A1021] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl mt-6 font-sans cursor-pointer"
              >
                Mint Identity & Dispatch Handshake
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
