import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Filter, 
  Search, 
  Flame, 
  RotateCcw, 
  MapPin, 
  Compass, 
  Info,
  Layers,
  ArrowRight,
  Satellite,
  Map as MapIcon
} from 'lucide-react';
import { usePollution } from '../../context/PollutionContext';
import { PollutionObservation, SeverityLevel } from '../../types/pollution';
import { SeverityBadge, ProvenanceBadge } from '../common/Badge';

// Fix Leaflet default icon paths broken by Vite bundling
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface PollutionMapProps {
  onOpenDetails: (location: PollutionObservation) => void;
  onMapCoordinateClick?: (lat: number, lng: number) => void;
}

export const PollutionMap: React.FC<PollutionMapProps> = ({ onOpenDetails, onMapCoordinateClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const baseLayerRef = useRef<L.TileLayer | null>(null);
  const labelsLayerRef = useRef<L.TileLayer | null>(null);

  const [mapStyle, setMapStyle] = useState<'satellite' | 'street'>('satellite');

  // Stable refs for callbacks so the map init useEffect can use [] deps
  const onMapCoordinateClickRef = useRef(onMapCoordinateClick);
  const onOpenDetailsRef = useRef(onOpenDetails);

  useEffect(() => {
    onMapCoordinateClickRef.current = onMapCoordinateClick;
  }, [onMapCoordinateClick]);

  useEffect(() => {
    onOpenDetailsRef.current = onOpenDetails;
  }, [onOpenDetails]);

  const {
    filteredObservations,
    selectedLocation,
    setSelectedLocation,
    filters,
    setFilters,
    resetFilters,
    showHotspotsOnly,
    setShowHotspotsOnly,
  } = usePollution();

  // Helper to get marker color
  const getMarkerColor = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Critical':
        return '#ef4444';
      case 'High':
        return '#f97316';
      case 'Moderate':
        return '#f59e0b';
      case 'Low':
        return '#10b981';
      default:
        return '#0284c7';
    }
  };

  // Initialize Map — runs once on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create map centered on global perspective with ocean visibility
      const map = L.map(mapContainerRef.current, {
        center: [20, 15],
        zoom: 2.4,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false,
      });

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Default to real Satellite Imagery with Boundaries & Places labels
      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
          maxZoom: 19,
        }
      ).addTo(map);

      const labelsLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          pane: 'overlayPane',
        }
      ).addTo(map);

      baseLayerRef.current = satelliteLayer;
      labelsLayerRef.current = labelsLayer;

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Handle map clicks for coordinate selection (uses ref for stable callback)
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onMapCoordinateClickRef.current) {
          onMapCoordinateClickRef.current(Number(e.latlng.lat.toFixed(4)), Number(e.latlng.lng.toFixed(4)));
        }
      });

      // Fix grey/blank tiles on initial load (especially on GitHub Pages)
      setTimeout(() => map.invalidateSize(), 100);

      // Fix grey/blank tiles on window resize
      const handleResize = () => map.invalidateSize();
      window.addEventListener('resize', handleResize);

      // Store resize handler for cleanup
      (map as any)._resizeHandler = handleResize;
    }

    return () => {
      if (mapInstanceRef.current) {
        const map = mapInstanceRef.current;
        const handleResize = (map as any)._resizeHandler;
        if (handleResize) {
          window.removeEventListener('resize', handleResize);
        }
        map.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        baseLayerRef.current = null;
        labelsLayerRef.current = null;
      }
    };
  }, []);

  // Switch between Satellite and Street base layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseLayerRef.current) {
      map.removeLayer(baseLayerRef.current);
      baseLayerRef.current = null;
    }
    if (labelsLayerRef.current) {
      map.removeLayer(labelsLayerRef.current);
      labelsLayerRef.current = null;
    }

    if (mapStyle === 'satellite') {
      baseLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
          maxZoom: 19,
        }
      ).addTo(map);

      labelsLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          pane: 'overlayPane',
        }
      ).addTo(map);
    } else {
      baseLayerRef.current = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      ).addTo(map);
    }
  }, [mapStyle]);

  // Update Markers when filtered observations change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    filteredObservations.forEach((obs) => {
      const color = getMarkerColor(obs.severity);
      const isCritical = obs.severity === 'Critical';

      // Custom HTML Marker with pulsing ring for critical hotspots
      const markerHtml = `
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
          ${isCritical ? `<div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background-color: ${color}; opacity: 0.35; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
          <div style="width: 20px; height: 20px; border-radius: 50%; background: ${color}; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s;">
            <div style="width: 6px; height: 6px; border-radius: 50%; background: white;"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-pollution-marker',
        html: markerHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const marker = L.marker([obs.coordinates[0], obs.coordinates[1]], { icon: customIcon });

      // Create rich popup
      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-slate-800 space-y-2 min-w-[220px]';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">${obs.waterbodyType.toUpperCase()}</span>
          <span class="text-xs font-bold px-2 py-0.5 rounded-full" style="background-color: ${color}20; color: ${color};">
            ${obs.severity} Severity
          </span>
        </div>
        <h4 class="font-bold text-sm text-slate-900 leading-snug">${obs.locationName}</h4>
        <p class="text-xs text-slate-500">${obs.country} • ${obs.waterbodyName}</p>
        
        <div class="bg-slate-50 rounded-lg p-2 text-xs space-y-1 border border-slate-100">
          <div class="flex justify-between">
            <span class="text-slate-500">Recorded:</span>
            <span class="font-semibold text-slate-700">${obs.measuredValue.toLocaleString()} ${obs.measurementUnit}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Dominant Debris:</span>
            <span class="font-semibold text-slate-800 capitalize">${obs.primaryDebrisCategory.replace('_', ' ')}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Confidence:</span>
            <span class="font-semibold text-emerald-600">${obs.confidence.overallScore}/100</span>
          </div>
        </div>

        <button id="inspect-btn-${obs.id}" class="w-full mt-2 py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-ocean-600 hover:bg-ocean-700 flex items-center justify-center gap-1.5 transition-colors shadow-sm">
          <span>Inspect Full Data</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      `;

      // Attach button listener after popup opens (uses ref for stable callback)
      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`inspect-btn-${obs.id}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedLocation(obs);
            onOpenDetailsRef.current(obs);
          };
        }
      });

      marker.on('click', () => {
        setSelectedLocation(obs);
      });

      markersGroup.addLayer(marker);
    });
  }, [filteredObservations, setSelectedLocation]);

  // Center map when selected location changes
  const handleFlyToLocation = (loc: PollutionObservation) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.coordinates[0], loc.coordinates[1]], 6, {
        duration: 1.5,
      });
      setSelectedLocation(loc);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-100">
      
      {/* Top Floating Filter & Search Header */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pointer-events-auto">
          
          {/* Search Input Bar */}
          <div className="flex-1 max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 p-1.5 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search by location, river, coast, or country..."
              className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
            />
            {filters.searchQuery && (
              <button 
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="text-xs text-slate-400 hover:text-slate-600 px-2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Interactive Filters Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            
            {/* Severity Filter Dropdown */}
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 px-2.5 py-1.5 flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">Severity:</span>
              <select
                value={filters.severity}
                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none text-xs cursor-pointer"
              >
                <option value="all">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Moderate">Moderate</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Waterbody Type Filter */}
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 px-2.5 py-1.5 flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">Waterbody:</span>
              <select
                value={filters.waterbodyType}
                onChange={(e) => setFilters(prev => ({ ...prev, waterbodyType: e.target.value }))}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none text-xs cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="river">Rivers</option>
                <option value="beach">Beaches</option>
                <option value="coastline">Coastlines</option>
                <option value="sea_ocean">Seas & Gyres</option>
                <option value="estuary">Estuaries & Deltas</option>
              </select>
            </div>

            {/* Map View Switcher (Satellite / Street) */}
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 p-1 flex items-center gap-1 text-xs shrink-0">
              <button
                onClick={() => setMapStyle('satellite')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all ${
                  mapStyle === 'satellite'
                    ? 'bg-ocean-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Satellite Imagery View"
              >
                <Satellite className="w-3.5 h-3.5" />
                Satellite
              </button>
              <button
                onClick={() => setMapStyle('street')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all ${
                  mapStyle === 'street'
                    ? 'bg-ocean-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Standard Street Map View"
              >
                <MapIcon className="w-3.5 h-3.5" />
                Street
              </button>
            </div>

            {/* Hotspots Quick Toggle */}
            <button
              onClick={() => setShowHotspotsOnly(!showHotspotsOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                showHotspotsOnly
                  ? 'bg-rose-500 text-white shadow-rose-500/30'
                  : 'bg-white/95 backdrop-blur-md text-slate-700 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${showHotspotsOnly ? 'fill-white' : 'text-rose-500'}`} />
              Hotspots Only
            </button>

            {/* Reset Filters */}
            {(filters.searchQuery || filters.severity !== 'all' || filters.waterbodyType !== 'all' || showHotspotsOnly) && (
              <button
                onClick={() => {
                  resetFilters();
                  setShowHotspotsOnly(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 shadow-md transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Legend (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-4 max-w-xs transition-all pointer-events-auto">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-ocean-600" />
            Pollution Severity
          </div>
          <span className="text-[11px] font-semibold text-ocean-700 bg-ocean-50 px-2 py-0.5 rounded-full border border-ocean-100">
            {filteredObservations.length} Visible Sites
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-200 animate-pulse" />
            <span className="font-semibold text-slate-700">Critical (&gt;80)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 ring-2 ring-orange-200" />
            <span className="font-semibold text-slate-700">High (60–80)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200" />
            <span className="font-semibold text-slate-700">Moderate (40–60)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            <span className="font-semibold text-slate-700">Low (&lt;40)</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Click any marker to inspect</span>
          <span className="text-ocean-600 font-bold">
            {mapStyle === 'satellite' ? 'Esri Satellite' : 'OpenStreetMap'}
          </span>
        </div>
      </div>

      {/* Quick Location Preview Drawer (Bottom Center / Right on desktop) */}
      {selectedLocation && (
        <div className="hidden lg:block absolute bottom-6 right-16 z-20 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 p-4 transition-all animate-in slide-in-from-bottom-3 pointer-events-auto">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <SeverityBadge severity={selectedLocation.severity} />
                <ProvenanceBadge provenance={selectedLocation.provenance} />
              </div>
              <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{selectedLocation.locationName}</h4>
              <p className="text-xs text-slate-500">{selectedLocation.country} • {selectedLocation.waterbodyName}</p>
            </div>
            <button
              onClick={() => handleFlyToLocation(selectedLocation)}
              className="p-1.5 rounded-lg bg-ocean-50 text-ocean-600 hover:bg-ocean-100"
              title="Fly to this location"
            >
              <Compass className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Observed Value:</span>
              <span className="font-bold text-slate-900">{selectedLocation.measuredValue.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-slate-400 italic">{selectedLocation.measurementUnit}</p>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
              <span className="text-slate-500">Confidence Score:</span>
              <span className="font-bold text-emerald-600">{selectedLocation.confidence.overallScore}/100</span>
            </div>
          </div>

          <button
            onClick={() => onOpenDetails(selectedLocation)}
            className="w-full mt-3 py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-ocean-600 to-marine-600 hover:from-ocean-700 hover:to-marine-700 flex items-center justify-center gap-1.5 shadow-md shadow-ocean-600/20 transition-all"
          >
            <span>View Full Scientific Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
