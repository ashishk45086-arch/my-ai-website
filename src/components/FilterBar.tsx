import { FilterState, PropertyType, FurnishingStatus } from '../types';
import { Filter, SlidersHorizontal, RotateCcw, Search, Sparkles } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const PROPERTY_TYPES: (PropertyType | 'All')[] = [
  'All',
  'PG',
  'Single Room',
  '1 BHK',
  '2 BHK',
  '3 BHK',
  '4 BHK',
  '5 BHK',
  'Independent House'
];

const PRICE_RANGES = [
  { value: 'All', label: 'Any Budget' },
  { value: '3000-5000', label: '₹3,000 - ₹5,000' },
  { value: '5000-8000', label: '₹5,000 - ₹8,000' },
  { value: '8000-12000', label: '₹8,000 - ₹12,000' },
  { value: '12000+', label: '₹12,000+' }
];

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  
  const setFilterKey = (key: keyof FilterState, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const handleReset = () => {
    onFilterChange({
      searchQuery: '',
      propertyType: 'All',
      priceRange: 'All',
      furnishing: 'All',
      acStatus: 'All',
      nearLPUOnly: false,
      sortBy: 'newest'
    });
  };

  // Check if any filter is modified from defaults
  const isFiltered = 
    filters.searchQuery !== '' ||
    filters.propertyType !== 'All' ||
    filters.priceRange !== 'All' ||
    filters.furnishing !== 'All' ||
    filters.acStatus !== 'All' ||
    filters.nearLPUOnly ||
    filters.sortBy !== 'newest';

  return (
    <div className="glass p-5 rounded-2xl border border-white/5 bg-slate-900/40 w-full" id="filter-bar-widget">
      
      {/* Search Input and Sorting Top Panel */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6 pb-5 border-b border-white/5">
        
        {/* Search bar helper */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by neighborhood e.g. Law Gate, Urban Estate..."
            value={filters.searchQuery}
            onChange={(e) => setFilterKey('searchQuery', e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
            id="filter-search-input"
          />
        </div>

        {/* Action Header or Active Reset label */}
        <div className="flex items-center space-x-3.5 w-full lg:w-auto justify-between lg:justify-end">
          {/* Active indicator */}
          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 text-[11px] font-mono text-accent hover:text-white uppercase tracking-wider transition-colors"
              id="filter-clear-all"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Filters</span>
            </button>
          )}

          {/* Sorting Box dropdown */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[11px] font-mono uppercase text-gray-500">
              Sort By:
            </span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilterKey('sortBy', e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-lg py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-primary cursor-pointer font-medium"
              aria-label="Sort listings"
            >
              <option value="newest">Newest Listed</option>
              <option value="low-to-high">Rent: Affordable to High</option>
              <option value="high-to-low">Rent: High to Low</option>
            </select>
          </div>
        </div>

      </div>

      {/* 8 Property types horizontal badges slider */}
      <div className="mb-5">
        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2.5">
          Filter Property Layouts ({PROPERTY_TYPES.length - 1} categories)
        </label>
        {/* Horizontal draggable container on touch devices */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {PROPERTY_TYPES.map((type) => {
            const isActive = filters.propertyType === type;
            return (
              <button
                key={type}
                onClick={() => setFilterKey('propertyType', type)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap tracking-wide cursor-pointer transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                    : 'bg-white/5 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                id={`filter-type-${type.replace(/\s+/g, '-')}`}
              >
                {type === 'All' ? 'All Types' : type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Core filters rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Price Ranges selector pills */}
        <div className="flex flex-col">
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2">
            Rent Range Filter
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => setFilterKey('priceRange', e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-accent text-left"
            aria-label="Price range filter"
          >
            {PRICE_RANGES.map((pr) => (
              <option key={pr.value} value={pr.value}>
                {pr.label}
              </option>
            ))}
          </select>
        </div>

        {/* Furnished status select */}
        <div className="flex flex-col">
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2">
            Furnishing Status
          </label>
          <select
            value={filters.furnishing}
            onChange={(e) => setFilterKey('furnishing', e.target.value as FurnishingStatus | 'All')}
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-accent"
            aria-label="Furnishing Filter"
          >
            <option value="All">Any Furnishing</option>
            <option value="Furnished">Fully Furnished</option>
            <option value="Semi Furnished">Semi Furnished</option>
            <option value="Unfurnished">Unfurnished / Raw</option>
          </select>
        </div>

        {/* Air conditioning status select */}
        <div className="flex flex-col">
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2">
            Air Conditioning
          </label>
          <select
            value={filters.acStatus}
            onChange={(e) => setFilterKey('acStatus', e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-accent"
            aria-label="Air Conditioning Filter"
          >
            <option value="All">AC &amp; Non-AC</option>
            <option value="AC">AC Option Only</option>
            <option value="Non AC">Non-AC Only</option>
          </select>
        </div>

        {/* Gated Society/Students Near LPU exclusive flag */}
        <div className="flex items-center h-full pt-4 md:pt-2">
          <label 
            className="flex items-center space-x-3 cursor-pointer group bg-slate-950/50 p-2.5 rounded-xl border border-white/5 hover:border-white/10 w-full"
            id="filter-lpu-checkbox"
          >
            <input
              type="checkbox"
              checked={filters.nearLPUOnly}
              onChange={(e) => setFilterKey('nearLPUOnly', e.target.checked)}
              className="h-4 w-4 rounded bg-slate-950 border-white/20 text-accent focus:ring-accent"
              aria-label="Near LPU Only Filter"
            />
            <div className="text-left leading-none flex flex-col justify-center">
              <span className="text-xs font-semibold text-white tracking-wide group-hover:text-accent transition-colors">
                Near LPU Campus Only
              </span>
              <span className="text-[9.5px] text-gray-500 font-mono mt-0.5">
                Walking distance to Law Gate
              </span>
            </div>
          </label>
        </div>

      </div>

    </div>
  );
}
export type { FilterBar };
