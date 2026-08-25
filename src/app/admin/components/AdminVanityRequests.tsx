import React, { useState, useEffect } from "react";
import { 
  getPendingVanityRequests, 
  approveVanityRequest, 
  rejectVanityRequest, 
  VanityRequest 
} from "@/lib/firestore/vanityRequests";

export default function AdminVanityRequests() {
  const [requests, setRequests] = useState<VanityRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const data = await getPendingVanityRequests();
    setRequests(data);
    setLoading(false);
  };

  const handleApprove = async (req: VanityRequest) => {
    if (!confirm(`Are you sure you want to approve and lock in ${req.requestedUrls[0]} for ${req.shopName}?`)) return;
    setProcessingId(req.id);
    try {
      await approveVanityRequest(req.id, req.shopId, req.requestedUrls[0], req.tier);
      alert("Successfully approved and assigned vanity URL!");
      loadRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to approve request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this request?")) return;
    setProcessingId(id);
    try {
      await rejectVanityRequest(id);
      loadRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to reject request.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading requests...</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vanity URL Requests</h2>
          <p className="text-sm text-gray-500">Manage offline payment approvals for custom domains and paths.</p>
        </div>
        <button 
          onClick={loadRequests}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
        >
          ↻ Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-lg font-bold text-gray-900">No Pending Requests</h3>
          <p className="text-gray-500">All vanity URL requests have been processed.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Shop Details</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Requested URL</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Tier / Amount</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{req.shopName}</div>
                    <div className="text-xs text-gray-500 font-mono mt-1">ID: {req.shopId}</div>
                    {req.shopPhone && <div className="text-xs text-blue-600 mt-1">📞 {req.shopPhone}</div>}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-blue-600">{req.requestedUrls[0]}</div>
                    <div className="text-xs text-gray-400 mt-1">Requested: {new Date(req.createdAt?.toMillis ? req.createdAt.toMillis() : Date.now()).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded capitalize">
                      {req.tier.replace("Path", "")}
                    </span>
                    <div className="text-sm font-bold text-gray-900 mt-1">₹ {req.amount}</div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleApprove(req)}
                      disabled={processingId === req.id}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {processingId === req.id ? "..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      disabled={processingId === req.id}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
