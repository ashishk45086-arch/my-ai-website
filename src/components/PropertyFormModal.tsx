import React, { useState, useEffect } from 'react';
import { Property, FurnishingStatus, AmenityType, PropertyType } from '../types';
import { X, Plus, Trash, Image as ImageIcon, Video, Sparkles } from 'lucide-react';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Property) => Promise<void>;
  propertyToEdit?: Property | null;
  role: 'Super Admin' | 'Property Manager' | null;
}

export default function PropertyFormModal({
  isOpen,
  onClose,
  onSave,
  propertyToEdit,
  role
}: PropertyFormModalProps) {
  // Pure field states conforming exactly to the true Property interface
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PropertyType>('PG');
  const [genderPreference, setGenderPreference] = useState<'Boys' | 'Girls' | 'Any' | 'Family'>('Any');
  const [price, setPrice] = useState(5000);
  const [securityDeposit, setSecurityDeposit] = useState(5000);
  const [brokerage, setBrokerage] = useState(0);
  const [location, setLocation] = useState('LPU Law Gate, Phagwara');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('Semi Furnished');
  const [distanceToLPU, setDistanceToLPU] = useState('300m walking');
  const [hostName, setHostName] = useState('Centra Landlord');
  const [hostPhone, setHostPhone] = useState('+91 98765 43210');
  const [hostWhatsApp, setHostWhatsApp] = useState('+91 98765 43210');
  const [hostAvatar, setHostAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80');
  
  // Amenities list
  const [amenities, setAmenities] = useState<AmenityType[]>([]);
  
  // Media states
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [mediaInput, setMediaInput] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const allAmenitiesList: { id: AmenityType; label: string }[] = [
    { id: 'WiFi', label: 'High Speed Wi-Fi' },
    { id: 'AC', label: 'Air Conditioner (AC)' },
    { id: 'Geyser', label: 'Geyser / Water Heater' },
    { id: 'Meals Included', label: 'Meals / Food Included' },
    { id: 'Washing Machine', label: 'Washing Machine / Laundry' },
    { id: 'CCTV', label: 'CCTV Surveillance' },
    { id: 'Parking', label: 'Two Wheeler Parking' },
    { id: 'Power Backup', label: 'Power Backup Systems' },
    { id: 'Kitchen', label: 'Shared Kitchen Facility' },
    { id: 'Study Table', label: 'Study Table & Chair' },
    { id: 'Refrigerator', label: 'In-house Refrigerator' }
  ];

  useEffect(() => {
    if (propertyToEdit) {
      setTitle(propertyToEdit.title);
      setType(propertyToEdit.type);
      setGenderPreference(propertyToEdit.genderPreference || 'Any');
      setPrice(propertyToEdit.price);
      setSecurityDeposit(propertyToEdit.securityDeposit || 5000);
      setBrokerage(propertyToEdit.brokerage || 0);
      setLocation(propertyToEdit.location);
      setAddress(propertyToEdit.address || '');
      setDescription(propertyToEdit.description || '');
      setBedrooms(propertyToEdit.bedrooms || 1);
      setBathrooms(propertyToEdit.bathrooms || 1);
      setFurnishing(propertyToEdit.furnishing || 'Semi Furnished');
      setDistanceToLPU(propertyToEdit.distanceToLPU || '300m walking');
      setHostName(propertyToEdit.hostName || 'Centra Landlord');
      setHostPhone(propertyToEdit.hostPhone || '+91 98765 43210');
      setHostWhatsApp(propertyToEdit.hostWhatsApp || '+91 98765 43210');
      setHostAvatar(propertyToEdit.hostAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80');
      setAmenities(propertyToEdit.amenities || []);
      setImages(propertyToEdit.images || []);
      setVideos(propertyToEdit.videos || []);
    } else {
      // Clear fields to defaults
      setTitle('');
      setType('PG');
      setGenderPreference('Any');
      setPrice(5000);
      setSecurityDeposit(5000);
      setBrokerage(0);
      setLocation('LPU Law Gate, Phagwara');
      setAddress('');
      setDescription('');
      setBedrooms(1);
      setBathrooms(1);
      setFurnishing('Semi Furnished');
      setDistanceToLPU('300m walk');
      setHostName('Centra Landlord');
      setHostPhone('+91 98765 43210');
      setHostWhatsApp('+91 98765 43210');
      setHostAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80');
      setAmenities(['WiFi', 'CCTV', 'Parking']);
      setImages([
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
      ]);
      setVideos([]);
    }
    setError('');
  }, [propertyToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleAmenity = (id: AmenityType) => {
    if (amenities.includes(id)) {
      setAmenities(amenities.filter(a => a !== id));
    } else {
      setAmenities([...amenities, id]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (mediaType === 'image') {
          setImages(prev => [...prev, base64]);
        } else {
          setVideos(prev => [...prev, base64]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddMediaUrl = () => {
    if (!mediaInput.trim()) return;
    if (mediaType === 'image') {
      setImages(prev => [...prev, mediaInput.trim()]);
    } else {
      setVideos(prev => [...prev, mediaInput.trim()]);
    }
    setMediaInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || price <= 0) {
      setError('Please fill in ALL required fields (Title, Location, Rent).');
      return;
    }

    if (images.length === 0) {
      setError('Please add at least ONE property image for preview listings.');
      return;
    }

    setSaving(true);
    setError('');

    const finalProperty: Property = {
      id: propertyToEdit?.id || 'prop_' + Math.random().toString(36).substring(2, 10),
      title: title.trim(),
      price: price,
      type: type,
      genderPreference: genderPreference,
      securityDeposit: securityDeposit,
      brokerage: brokerage,
      location: location.trim(),
      address: address.trim() || location.trim(),
      description: description.trim(),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      furnishing: furnishing,
      ac: amenities.includes('AC'),
      nearLPU: distanceToLPU.toLowerCase().includes('m') || distanceToLPU.toLowerCase().includes('lpu') || Number(distanceToLPU.replace(/[^0-9.]/g, '')) <= 2,
      distanceToLPU: distanceToLPU,
      images: images,
      videos: videos,
      amenities: amenities,
      size: propertyToEdit?.size || '450 sq.ft',
      rating: propertyToEdit?.rating || 4.7,
      reviewsCount: propertyToEdit?.reviewsCount || 12,
      hostName: hostName,
      hostPhone: hostPhone,
      hostWhatsApp: hostWhatsApp,
      hostAvatar: hostAvatar,
      featured: propertyToEdit?.featured || false,
      addedDate: propertyToEdit?.addedDate || new Date().toISOString().split('T')[0],
      isAvailable: propertyToEdit?.isAvailable !== undefined ? propertyToEdit?.isAvailable : true,
      isArchived: propertyToEdit?.isArchived !== undefined ? propertyToEdit?.isArchived : false
    };

    try {
      await onSave(finalProperty);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save property records.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto" id="property-form-modal">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-8 text-left">
        
        {/* Header styling separator line */}
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        
        {/* Modal Title and close header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h3 className="font-display font-bold text-lg text-white">
              {propertyToEdit ? 'Edit Property Record' : 'Upload New PG Property'}
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form contents scroll zone */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-mono">
              ⚠️ {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column Input fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                  Property Title Header *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Royal Boys PG Near Law Gate"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Property Type Format *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PropertyType)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
                  >
                    <option value="PG">Hostel / PG Room</option>
                    <option value="Single Room">Single Room</option>
                    <option value="1 BHK">1 BHK Apartment</option>
                    <option value="2 BHK">2 BHK Apartment</option>
                    <option value="3 BHK">3 BHK Flat</option>
                    <option value="Independent House">Independent House</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Furnish Status *
                  </label>
                  <select
                    value={furnishing}
                    onChange={(e) => setFurnishing(e.target.value as FurnishingStatus)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
                  >
                    <option value="Furnished">Fully Furnished</option>
                    <option value="Semi Furnished">Semi Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Gender Preference *
                  </label>
                  <select
                    value={genderPreference}
                    onChange={(e) => setGenderPreference(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Any">Co-Ed / Couples / Any</option>
                    <option value="Boys">Boys Only</option>
                    <option value="Girls">Girls Only</option>
                    <option value="Family">Families Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Distance to LPU Gate *
                  </label>
                  <input
                    type="text"
                    required
                    value={distanceToLPU}
                    onChange={(e) => setDistanceToLPU(e.target.value)}
                    placeholder="e.g. 400m walk, 1.2 Km"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Rent (₹/mo) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Security Deposit
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Landlord Brokerage
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={brokerage}
                    onChange={(e) => setBrokerage(Number(e.target.value))}
                    placeholder="0 for direct"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                  General Location Name *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Law Gate back street, Maheru"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                  Detailed Address (For Approved Residents)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House 45-B, Lane 2, Law Gate Area, Maheru"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Right Column Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Bedrooms count
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Bathrooms count
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                  Property Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe building rules, meals menu etc..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Landlord Credentials Section */}
              <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5 space-y-3">
                <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest font-semibold">Landlord Info</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[9px] font-mono text-gray-500 uppercase mb-1">Landlord Name</span>
                    <input
                      type="text"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                    />
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-gray-500 uppercase mb-1">WhatsApp No</span>
                    <input
                      type="text"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      value={hostWhatsApp}
                      onChange={(e) => setHostWhatsApp(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Photo Attachments Section */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Property Media Links ({images.length} images uploaded)
                </label>
                
                <div className="flex gap-2">
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as any)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-2 py-1.5 text-[11px] text-white focus:outline-none"
                  >
                    <option value="image">📸 Image</option>
                    <option value="video">🎥 Video</option>
                  </select>

                  <input
                    type="text"
                    value={mediaInput}
                    onChange={(e) => setMediaInput(e.target.value)}
                    placeholder="Paste URL address directly"
                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddMediaUrl}
                    className="px-3 bg-accent/20 hover:bg-accent/30 text-accent font-bold rounded-xl text-xs"
                  >
                    Attach
                  </button>
                </div>

                {/* Local Upload Input */}
                <div className="pt-1.5">
                  <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 hover:text-white text-gray-300 font-bold px-4 py-2 rounded-xl text-xs transition-colors">
                    <ImageIcon className="h-4 w-4 text-accent" />
                    <span>Upload Local Mock Files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Micro Images List display */}
                <div className="flex gap-2 overflow-x-auto pb-1 max-w-md pt-2">
                  {images.map((img, inx) => (
                    <div key={inx} className="relative h-14 w-14 rounded-lg overflow-hidden border border-white/10 group flex-none bg-slate-950">
                      <img src={img} className="h-full w-full object-cover" alt="" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(inx)}
                        className="absolute inset-0 bg-rose-950/70 hover:bg-rose-950/90 text-rose-300 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        title="Remove"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Amenities grid switches */}
          <div className="space-y-2.5">
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
              Select Key Facilities &amp; Amenities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {allAmenitiesList.map((item) => {
                const isActive = amenities.includes(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggleAmenity(item.id)}
                    className={`p-3 rounded-xl border text-xs text-left font-medium transition-all focus:outline-none flex items-center justify-between ${
                      isActive 
                        ? 'bg-accent/10 border-accent/40 text-white shadow shadow-accent/5' 
                        : 'bg-slate-950 border-white/5 text-gray-400 hover:text-white hover:border-white/15'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-accent' : 'bg-transparent border border-white/10'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dialog buttons actions */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs hover:opacity-95 shadow transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              {saving ? (
                <span>Writing Records...</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{propertyToEdit ? 'Save Changes' : 'Initialize Property'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
