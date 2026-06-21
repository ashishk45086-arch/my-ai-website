import React, { useState } from 'react';
import { Property, Room, RoomStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash, Edit, Check, X, Shield, Sparkles } from 'lucide-react';

export default function RoomManager() {
  const { properties, rooms, updateRoom, removeRoom, adminRole } = useAuth();
  
  // States
  const [selectedPropId, setSelectedPropId] = useState<string>(properties[0]?.id || '');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('AC Single Deluxe');
  const [sharingType, setSharingType] = useState('Single');
  const [price, setPrice] = useState(6000);
  const [roomStatus, setRoomStatus] = useState<RoomStatus>('Available');
  
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState(6000);
  const [editStatus, setEditStatus] = useState<RoomStatus>('Available');

  const filteredRooms = rooms.filter(r => r.propertyId === selectedPropId);
  const selectedProperty = properties.find(p => p.id === selectedPropId);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropId) return;
    if (!roomNumber.trim()) return;

    const newRoom: Room = {
      id: 'room_' + Math.random().toString(36).substring(2, 10),
      propertyId: selectedPropId,
      roomNumber: roomNumber.trim(),
      roomType,
      sharingType,
      price,
      status: roomStatus,
      images: [],
      videos: []
    };

    await updateRoom(newRoom);
    setRoomNumber('');
  };

  const handleStartEdit = (room: Room) => {
    setEditingRoomId(room.id);
    setEditPrice(room.price);
    setEditStatus(room.status);
  };

  const handleSaveEdit = async (room: Room) => {
    const updated: Room = {
      ...room,
      price: editPrice,
      status: editStatus
    };
    await updateRoom(updated);
    setEditingRoomId(null);
  };

  const handleDeleteRoom = async (id: string) => {
    if (adminRole === 'Property Manager') {
      alert('Action Restriction: Property Managers are unauthorized to delete database entries. Only Super Admins can erase documents.');
      return;
    }
    if (confirm('Are you sure you want to permanently erase this room?')) {
      await removeRoom(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Property Selector */}
      <div className="p-5 bg-slate-900 border border-white/5 rounded-2xl">
        <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
          Select Target PG Property
        </label>
        <select
          value={selectedPropId}
          onChange={(e) => setSelectedPropId(e.target.value)}
          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent"
        >
          {properties.map(p => (
            <option key={p.id} value={p.id}>{p.title} ({p.location})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Add Room form */}
        <div className="lg:col-span-1 p-5 bg-slate-900 border border-white/5 rounded-2xl h-fit">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent" />
            <h4 className="font-display font-bold text-sm text-white">Add New Room Document</h4>
          </div>

          <form onSubmit={handleAddRoom} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                Room Number / Block *
              </label>
              <input
                type="text"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. Room 101, B-4"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                Room Type Description
              </label>
              <input
                type="text"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                placeholder="e.g. AC Single Deluxe, Non-AC Double"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                  Sharing Format
                </label>
                <select
                  value={sharingType}
                  onChange={(e) => setSharingType(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Single">Single Occupancy</option>
                  <option value="Double">Double Sharing</option>
                  <option value="Triple">Triple Sharing</option>
                  <option value="Four">Four Sharing</option>
                  <option value="Private">Private Apartment</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                  Monthly Rent (INR) *
                </label>
                <input
                  type="number"
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                Initial Status
              </label>
              <select
                value={roomStatus}
                onChange={(e) => setRoomStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved (Booking approved)</option>
                <option value="Occupied">Occupied (Checked-in)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 hover:opacity-95"
            >
              <Plus className="h-4 w-4" />
              <span>Record Room</span>
            </button>
          </form>
        </div>

        {/* Right column: Rooms List */}
        <div className="lg:col-span-2 p-5 bg-slate-900 border border-white/5 rounded-2xl flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
            <h4 className="font-display font-bold text-sm text-white">
              Room Directory for "{selectedProperty?.title || 'Select PG'}"
            </h4>
            <span className="font-mono text-[10px] bg-white/5 px-2.5 py-1 rounded-full text-accent">
              {filteredRooms.length} rooms mapped
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-slate-950/20 rounded-xl border border-dashed border-white/5">
                <span className="text-gray-500 text-xs">No individual rooms added yet. Create the first room above!</span>
              </div>
            ) : (
              filteredRooms.map((room) => {
                const isEditing = editingRoomId === room.id;
                return (
                  <div 
                    key={room.id}
                    className="p-4 bg-slate-950/60 border border-white/5 rounded-xl flex items-center justify-between"
                  >
                    {isEditing ? (
                      <div className="flex-1 grid grid-cols-3 gap-4 mr-4">
                        <div>
                          <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Room No</span>
                          <span className="text-sm font-bold text-white">{room.roomNumber}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Edit Rent</span>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white w-full focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Edit Status</span>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as any)}
                            className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white w-full focus:outline-none"
                          >
                            <option value="Available">Available</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Occupied">Occupied</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 pr-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-display font-bold text-base text-white">{room.roomNumber}</span>
                          <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                            {room.sharingType} format
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{room.roomType}</p>
                        
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs font-bold text-accent">₹{room.price}/mo</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            room.status === 'Available' ? 'bg-emerald-500/15 text-emerald-400' :
                            room.status === 'Reserved' ? 'bg-amber-500/15 text-amber-400' :
                            'bg-blue-500/15 text-blue-400'
                          }`}>
                            ● {room.status}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Actions column */}
                    <div className="flex items-center space-x-1.5 flex-none">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(room)}
                            className="p-1 px-2.5 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg text-xs font-bold"
                            title="Save"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingRoomId(null)}
                            className="p-1 px-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-xs font-bold"
                            title="Cancel"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(room)}
                            className="p-2 bg-slate-800 text-gray-400 hover:text-white rounded-lg transition-colors"
                            title="Edit Room Rate & Availability"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                            title="Delete Room Record"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
