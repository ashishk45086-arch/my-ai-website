import React from 'react';
import { Inquiry } from '../types';
import { useAuth } from '../context/AuthContext';
import { Check, Trash, Shield, MessageCircle, Calendar, Phone, Mail, User } from 'lucide-react';

export default function InquiryManager() {
  const { inquiries, updateInquiry, removeInquiry, adminRole } = useAuth();

  const handleResolve = async (inquiry: Inquiry) => {
    const updated: Inquiry = {
      ...inquiry,
      status: 'resolved'
    };
    await updateInquiry(updated);
  };

  const handleDelete = async (id: string) => {
    if (adminRole === 'Property Manager') {
      alert('Action Restriction: Property Managers are unauthorized to delete database entries. Only Super Admins can erase documents.');
      return;
    }
    if (confirm('Permanently delete this inquiry document?')) {
      await removeInquiry(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/5 font-display">
        <h4 className="font-bold text-sm text-white">Guest Client Inquiries</h4>
        <span className="font-mono text-xs text-accent uppercase">
          {inquiries.length} files logged
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inquiries.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center p-8 bg-slate-900 border border-white/5 rounded-2xl text-center">
            <MessageCircle className="h-8 w-8 text-gray-500 mb-2" />
            <span className="text-xs text-gray-500">No inquiries recorded yet. Contact submissions will appear here instantly!</span>
          </div>
        ) : (
          [...inquiries].reverse().map((inquiry) => (
            <div 
              key={inquiry.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                inquiry.status === 'resolved' 
                  ? 'bg-slate-950/40 border-white/5 opacity-75' 
                  : 'bg-slate-900 border-white/10 shadow-lg shadow-accent/5'
              }`}
            >
              {/* Card Header info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-display font-medium text-xs text-gray-400 capitalize">
                      [{inquiry.type} inquiry]
                    </span>
                    <span className={`h-2 w-2 rounded-full ${inquiry.status === 'resolved' ? 'bg-gray-500' : 'bg-accent animate-pulse'}`} />
                  </div>
                  
                  <span className="text-[10px] font-mono text-gray-500">
                    {new Date(inquiry.createdAt || '').toLocaleDateString('en-IN')}
                  </span>
                </div>

                <div className="space-y-1">
                  <h5 className="font-display font-semibold text-sm text-white flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-gray-500" />
                    {inquiry.name}
                  </h5>
                  <div className="flex flex-col text-[11px] font-mono text-gray-400 gap-0.5">
                    <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1.5 hover:text-accent">
                      <Phone className="h-3 w-3 text-primary-light" />
                      {inquiry.phone}
                    </a>
                    <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1.5 hover:text-accent">
                      <Mail className="h-3 w-3 text-primary-light" />
                      {inquiry.email}
                    </a>
                  </div>
                </div>

                {inquiry.propertyTitle && (
                  <div className="text-[11px] bg-slate-950/50 py-1.5 px-3 rounded-lg text-emerald-400 font-mono inline-block">
                    🏷️ Ref: {inquiry.propertyTitle}
                  </div>
                )}

                <div className="pt-3 border-t border-white/5 text-xs text-gray-300 leading-relaxed bg-slate-950/20 p-3 rounded-xl italic">
                  "{inquiry.message}"
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                {inquiry.status === 'pending' ? (
                  <button
                    onClick={() => handleResolve(inquiry)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-accent/20 hover:bg-accent/30 text-accent font-bold text-[10px] rounded-lg uppercase tracking-wider"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-semibold italic">Resolved ✅</span>
                )}

                <button
                  onClick={() => handleDelete(inquiry.id)}
                  className="p-1 px-2.5 text-gray-600 hover:text-rose-400 rounded-lg text-[10px] font-bold font-mono hover:bg-rose-500/5 transition-all"
                  title="Delete Inquiry File"
                >
                  Delete Inquiry
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
