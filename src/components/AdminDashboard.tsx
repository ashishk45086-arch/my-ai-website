import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Property } from '../types';
import PropertyFormModal from './PropertyFormModal';
import RoomManager from './RoomManager';
import BookingManager from './BookingManager';
import InquiryManager from './InquiryManager';
import { 
  Building, 
  Users, 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  Shield, 
  Plus, 
  Edit, 
  Trash, 
  LogOut, 
  Bell, 
  Home, 
  Sparkles,
  ArrowRight,
  TrendingDown,
  CheckCircle,
  Eye,
  Settings
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    user, 
    logOut, 
    adminRole, 
    properties, 
    rooms, 
    bookings, 
    inquiries, 
    notifications,
    updateProperty, 
    removeProperty,
    markNotiRead
  } = useAuth();

  // Selected sub-tab
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'rooms' | 'bookings' | 'inquiries' | 'notifications'>('overview');
  
  // Property editing modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPropertyForEdit, setSelectedPropertyForEdit] = useState<Property | null>(null);

  // Stats Calculations
  const totalProperties = properties.length;
  const availableProperties = properties.filter(p => p.isAvailable && !p.isArchived).length;
  const occupiedProperties = properties.filter(p => !p.isAvailable).length;
  const totalBookings = bookings.length;
  const pendingInquiries = inquiries.filter(i => i.status === 'pending').length;
  
  // Monthly Revenue calculated from occupied rooms rent or available rent matching active bookings
  const monthlyRevenue = bookings
    .filter(b => b.status === 'Checked In' || b.status === 'Approved')
    .reduce((acc, curr) => {
      // Find matching property rent or check room rent
      const prop = properties.find(p => p.id === curr.propertyId);
      return acc + (prop ? prop.rent : 5000);
    }, 0);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleCreateNewProperty = () => {
    setSelectedPropertyForEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setSelectedPropertyForEdit(property);
    setIsFormModalOpen(true);
  };

  const handleDeleteProperty = async (id: string) => {
    if (adminRole === 'Property Manager') {
      alert('Action Restriction: Property Managers are unauthorized to delete database entries. Only Super Admins can erase documents.');
      return;
    }
    if (confirm('Permanently delete this property listing? This action is irreversible.')) {
      await removeProperty(id);
    }
  };

  const handleToggleAvailability = async (property: Property) => {
    const updated: Property = {
      ...property,
      isAvailable: !property.isAvailable
    };
    await updateProperty(updated);
  };

  const handleSavePropertyRecord = async (property: Property) => {
    await updateProperty(property);
  };

  return (
    <section className="bg-slate-950 min-h-screen text-slate-100 pb-24 font-sans" id="admin-dashboard-container">
      
      {/* Admin Title Subheader Banner */}
      <div className="relative py-8 md:py-12 bg-slate-900 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 opacity-60" />
        <div className="mx-auto max-w-7xl px-4 md:px-8 relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <Shield className="h-5 w-5 text-accent animate-pulse" />
              <span className="font-mono text-xs text-accent uppercase tracking-widest font-bold">
                Secure Portal
              </span>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full uppercase">
                {adminRole}
              </span>
            </div>
            <h1 className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
              Property Management Center
            </h1>
            <p className="text-xs md:text-sm text-gray-400 font-medium my-1 max-w-xl">
              Hello, {user?.displayName || 'Administrator'}. Monitor listings, approve PG rents, and resolve inquiries in real-time.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white transition-all focus:outline-none border border-white/5"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <button
              onClick={logOut}
              className="flex items-center space-x-1.5 px-4.5 py-2.5 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-400 hover:bg-rose-950/60 font-bold text-xs transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 mt-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2.5 border-b border-white/5 pb-4 mb-8">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Home },
            { id: 'properties', label: 'Manage PG Properties', icon: Building },
            { id: 'rooms', label: 'Room Levels', icon: Settings },
            { id: 'bookings', label: 'Tenants & Bookings', icon: Calendar },
            { id: 'inquiries', label: 'Inquiries Box', icon: MessageCircle },
            { id: 'notifications', label: 'Logs & Alerts', icon: Bell }
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-4.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 border focus:outline-none ${
                  isTabActive
                    ? 'bg-primary border-primary text-slate-950 font-bold shadow-lg shadow-primary/10 scale-105'
                    : 'bg-slate-900 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ==================== 1. OVERVIEW SCREEN ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn" id="dashboard-tab-overview">
            
            {/* Overview Counters Panel */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { title: 'Total Listings', value: totalProperties, icon: Building, color: 'text-indigo-400' },
                { title: 'Available Units', value: availableProperties, icon: CheckCircle, color: 'text-emerald-400' },
                { title: 'Occupied Units', value: occupiedProperties, icon: Users, color: 'text-indigo-400' },
                { title: 'Total Bookings', value: totalBookings, icon: Calendar, color: 'text-amber-400' },
                { title: 'New Inquiries', value: pendingInquiries, icon: MessageCircle, color: 'text-rose-400', pulse: pendingInquiries > 0 },
                { title: 'Est. Revenue', value: `₹${monthlyRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-emerald-400 font-mono' }
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} className="p-4 bg-slate-900 border border-white/5 rounded-2xl flex flex-col justify-between h-28 hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{card.title}</span>
                      <Icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                    <div className="flex items-baseline space-x-1.5">
                      <span className={`text-xl md:text-2xl font-black text-white ${card.pulse ? 'animate-pulse' : ''}`}>{card.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions & Recent list split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left span 8: Recent elements */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Recent bookings sneak peak */}
                <div className="p-5 bg-slate-900 border border-white/5 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-display font-bold text-sm text-white">Recent Rent Bookings Squeezed</h4>
                    <button onClick={() => setActiveTab('bookings')} className="text-xs text-accent font-semibold flex items-center space-x-1 hover:underline">
                      <span>View All</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="divide-y divide-white/5">
                    {bookings.length === 0 ? (
                      <div className="py-6 text-center text-xs text-gray-500">No rent bookings filed yet.</div>
                    ) : (
                      [...bookings].reverse().slice(0, 3).map((b) => (
                        <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-semibold text-white">{b.name}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{b.propertyTitle} - {b.roomNumber || 'Any room'}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${b.status === 'Checked In' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-gray-400'}`}>
                              {b.status}
                            </span>
                            <p className="text-[9px] font-mono text-gray-500 mt-1">{b.checkInDate}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Inquiries snap */}
                <div className="p-5 bg-slate-900 border border-white/5 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-display font-bold text-sm text-white">Recent Guest Inquiries Panel</h4>
                    <button onClick={() => setActiveTab('inquiries')} className="text-xs text-accent font-semibold flex items-center space-x-1 hover:underline">
                      <span>Inquiries Window</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="divide-y divide-white/5">
                    {inquiries.length === 0 ? (
                      <div className="py-6 text-center text-xs text-gray-500">No client inquiries registered yet.</div>
                    ) : (
                      [...inquiries].reverse().slice(0, 3).map((inq) => (
                        <div key={inq.id} className="py-3 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-semibold text-white">{inq.name} ({inq.type})</p>
                            <p className="text-[10px] text-gray-400 truncate max-w-sm mt-0.5">"{inq.message}"</p>
                          </div>
                          <span className={`text-[10px] uppercase font-mono ${inq.status === 'resolved' ? 'text-gray-500' : 'text-accent font-bold'}`}>
                            {inq.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right span 4: System Alerts sneak peak */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Admin Quick Console Panel */}
                <div className="p-5 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-white/10 rounded-2xl">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="h-4.5 w-4.5 text-accent" />
                    <h4 className="font-display font-bold text-sm text-white">Quick Actions Console</h4>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Instantly publish accommodation spaces to dynamic Firestore listings matching client queries.
                  </p>
                  
                  <div className="space-y-2.5">
                    <button
                      onClick={handleCreateNewProperty}
                      className="w-full bg-accent text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 hover:opacity-95 shadow"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Upload New PG Space</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('properties')}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center"
                    >
                      <span>Explore Active Properties</span>
                    </button>
                  </div>
                </div>

                {/* Brief Rules overview card */}
                <div className="p-4 bg-slate-900 border border-white/5 rounded-2xl space-y-2 text-xs">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Authorization Policy</span>
                  <div className="space-y-1 text-gray-400">
                    <p>● <span className="text-gray-200">Super Admins</span> retain complete master authorization including erasures config.</p>
                    <p>● <span className="text-gray-200">Property Managers</span> possess management capabilities but delete actions are restricted.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== 2. PROPERTIES TAB ==================== */}
        {activeTab === 'properties' && (
          <div className="space-y-6 animate-fadeIn" id="dashboard-tab-properties">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h4 className="font-display font-bold text-sm text-white">Active House Listings ({properties.length})</h4>
              <button
                onClick={handleCreateNewProperty}
                className="bg-accent text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 hover:opacity-95"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Upload New Property</span>
              </button>
            </div>

            {/* Table or list format */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
              {properties.length === 0 ? (
                <div className="p-12 text-center text-xs text-gray-500">No properties initialized. Click above to add!</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950/60 text-gray-500 font-mono uppercase tracking-wider text-[9px] border-b border-white/5 select-none">
                        <th className="p-4">Property</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Rent (/mo)</th>
                        <th className="p-4">Availability</th>
                        <th className="p-4 text-right">Settings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {properties.map((p) => (
                        <tr key={p.id} className="hover:bg-white/2 transition-colors">
                          <td className="p-4 font-medium text-white max-w-sm truncate">{p.title}</td>
                          <td className="p-4 text-gray-400">{p.location}</td>
                          <td className="p-4 capitalize">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.type === 'boys' ? 'bg-blue-500/10 text-blue-400' :
                              p.type === 'girls' ? 'bg-rose-500/10 text-rose-400' :
                              'bg-indigo-500/10 text-indigo-400'
                            }`}>
                              {p.type}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-accent">₹{p.rent}</td>
                          <td className="p-4 text-xs font-semibold">
                            <button
                              onClick={() => handleToggleAvailability(p)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                                p.isAvailable 
                                  ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                                  : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                              }`}
                              title="Toggle Availability State"
                            >
                              ● {p.isAvailable ? 'Available' : 'Occupied'}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => handleEditProperty(p)}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white rounded-lg transition-all"
                                title="Edit Listing Info"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              
                              <button
                                onClick={() => handleDeleteProperty(p.id)}
                                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all"
                                title="Delete Listing Record"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== 3. ROOMS TAB ==================== */}
        {activeTab === 'rooms' && (
          <div className="animate-fadeIn" id="dashboard-tab-rooms">
            <RoomManager />
          </div>
        )}

        {/* ==================== 4. BOOKINGS TAB ==================== */}
        {activeTab === 'bookings' && (
          <div className="animate-fadeIn" id="dashboard-tab-bookings">
            <BookingManager />
          </div>
        )}

        {/* ==================== 5. INQUIRIES TAB ==================== */}
        {activeTab === 'inquiries' && (
          <div className="animate-fadeIn" id="dashboard-tab-inquiries">
            <InquiryManager />
          </div>
        )}

        {/* ==================== 6. NOTIFICATIONS/LOGS TAB ==================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 animate-fadeIn" id="dashboard-tab-notifications">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h4 className="font-display font-bold text-sm text-white">System Actions & Alerts log</h4>
              <span className="font-mono text-xs text-accent">
                {notifications.length} alerts logged
              </span>
            </div>

            <div className="space-y-3.5">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500 bg-slate-900 border border-white/5 rounded-2xl select-none">
                  No system notifications or audit logs present.
                </div>
              ) : (
                [...notifications].reverse().map((noti) => (
                  <div 
                    key={noti.id}
                    className={`p-4 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      noti.read 
                        ? 'bg-slate-950/20 border-white/5 opacity-60' 
                        : 'bg-slate-900 border-accent/20 border-l-4 border-l-accent'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{noti.title}</span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {new Date(noti.createdAt).toLocaleTimeString('en-IN')}
                        </span>
                      </div>
                      <p className="text-gray-400 mt-1">{noti.message}</p>
                    </div>

                    {!noti.read && (
                      <button
                        onClick={() => markNotiRead(noti.id)}
                        className="px-2.5 py-1 bg-accent hover:opacity-95 text-slate-950 font-bold rounded-lg text-[10px] uppercase font-mono"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* Upload/Edit Modal Container */}
      <PropertyFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSavePropertyRecord}
        propertyToEdit={selectedPropertyForEdit}
        role={adminRole}
      />
    </section>
  );
}
