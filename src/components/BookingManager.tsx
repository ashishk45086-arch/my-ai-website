import React from 'react';
import { Booking, Room } from '../types';
import { useAuth } from '../context/AuthContext';
import { Check, X, Shield, Calendar, CreditCard, ChevronRight, User, Phone, Mail } from 'lucide-react';

export default function BookingManager() {
  const { bookings, rooms, properties, updateBooking, removeBooking, updateRoom, adminRole } = useAuth();

  const handleUpdateStatus = async (booking: Booking, nextStatus: Booking['status']) => {
    // 1. Update Booking state
    const updatedBooking: Booking = {
      ...booking,
      status: nextStatus
    };
    await updateBooking(updatedBooking);

    // 2. Reactively cascade status to the underlying room if present!
    if (booking.roomId) {
      const room = rooms.find(r => r.id === booking.roomId);
      if (room) {
        let roomStatus: Room['status'] = 'Available';
        if (nextStatus === 'Approved') roomStatus = 'Reserved';
        if (nextStatus === 'Checked In') roomStatus = 'Occupied';
        if (nextStatus === 'Checked Out' || nextStatus === 'Rejected') roomStatus = 'Available';

        const updatedRoom: Room = {
          ...room,
          status: roomStatus
        };
        await updateRoom(updatedRoom);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (adminRole === 'Property Manager') {
      alert('Action Restriction: Property Managers are unauthorized to delete database entries. Only Super Admins can erase documents.');
      return;
    }
    if (confirm('Permanently delete this booking record?')) {
      await removeBooking(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <h4 className="font-display font-bold text-sm text-white">Client Rent Bookings</h4>
        <span className="font-mono text-xs text-accent uppercase">
          {bookings.length} reservations logged
        </span>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-900 border border-white/5 rounded-2xl text-center">
            <Calendar className="h-8 w-8 text-gray-500 mb-2" />
            <span className="text-xs text-gray-500">No rent bookings filed yet. They will appear here when guest clients book a stay!</span>
          </div>
        ) : (
          [...bookings].reverse().map((booking) => {
            const hasAadhaar = booking.aadhaar ? booking.aadhaar.trim() : null;
            return (
              <div 
                key={booking.id}
                className="p-5 bg-slate-900 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-white/10"
              >
                {/* Details info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-display font-bold text-sm text-white">{booking.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      booking.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                      booking.status === 'Approved' ? 'bg-indigo-500/10 text-indigo-400' :
                      booking.status === 'Checked In' ? 'bg-emerald-500/10 text-emerald-400' :
                      booking.status === 'Checked Out' ? 'bg-slate-700 text-gray-400' :
                      'bg-rose-500/10 text-rose-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-400 font-mono">
                    <div className="flex items-center space-x-1.5">
                      <Phone className="h-3 w-3 text-primary" />
                      <span>{booking.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 truncate">
                      <Mail className="h-3 w-3 text-primary" />
                      <span>{booking.email}</span>
                    </div>
                    {hasAadhaar && (
                      <div className="flex items-center space-x-1.5">
                        <CreditCard className="h-3 w-3 text-primary" />
                        <span>Aadhaar: <span className="text-gray-200">{booking.aadhaar}</span></span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs p-3.5 bg-slate-950/60 rounded-xl space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Property:</span>
                      <span className="font-semibold text-white text-right truncate max-w-[200px]">{booking.propertyTitle}</span>
                    </div>

                    {booking.roomNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Selected Room No:</span>
                        <span className="font-bold text-accent">{booking.roomNumber}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Requested Moving Date:</span>
                      <span className="text-gray-200">{booking.checkInDate}</span>
                    </div>

                    {booking.message && (
                      <div className="pt-2 border-t border-white/5 mt-1">
                        <span className="text-[10px] uppercase font-mono text-gray-500 block">Personal Message:</span>
                        <p className="text-gray-300 italic max-w-lg truncate leading-relaxed mt-0.5 font-sans">"{booking.message}"</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Trigger Buttons */}
                <div className="flex flex-row md:flex-col justify-end items-end gap-2 pr-1">
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {booking.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(booking, 'Approved')}
                          className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-lg hover:opacity-95 uppercase tracking-wider"
                        >
                          Approve Stay
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(booking, 'Rejected')}
                          className="px-3 py-1.5 bg-rose-500/20 text-rose-400 font-bold text-[10px] rounded-lg hover:bg-rose-500/30 uppercase tracking-wider"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {booking.status === 'Approved' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(booking, 'Checked In')}
                          className="px-3 py-1.5 bg-accent text-slate-950 font-bold text-[10px] rounded-lg hover:opacity-95 uppercase tracking-wider"
                        >
                          Confirm Check-In
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(booking, 'Pending')}
                          className="px-2 py-1.5 bg-slate-800 text-gray-400 text-[10px] rounded-lg"
                        >
                          Reset
                        </button>
                      </>
                    )}

                    {booking.status === 'Checked In' && (
                      <button
                        onClick={() => handleUpdateStatus(booking, 'Checked Out')}
                        className="px-3 py-1.5 bg-slate-800 text-orange-400 font-bold text-[10px] rounded-lg hover:bg-slate-700 uppercase tracking-wider border border-orange-500/20"
                      >
                        Check-Out Room
                      </button>
                    )}

                    {booking.status === 'Checked Out' && (
                      <span className="text-[11px] font-mono text-gray-500 italic block">Archived Stay</span>
                    )}

                    {booking.status === 'Rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(booking, 'Pending')}
                        className="px-2.5 py-1.5 bg-slate-800 text-gray-400 text-[10px] rounded-lg"
                      >
                        Re-evaluate
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="text-[10px] text-gray-600 hover:text-rose-400 font-bold font-mono transition-colors mt-1 hover:underline"
                  >
                    Delete Record
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
