import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Crosshair, AlertCircle } from 'lucide-react';
import L from 'leaflet';

// Fix default marker icon issues with Vite bundler
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


export default function LocationPicker({ value, onChange }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState('');

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.display_name || '';
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
    }
    return '';
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const defaultCenter = [23.6, 80.2]; // center of India
    const map = L.map(mapRef.current, {
      center: value?.lat ? [value.lat, value.lng] : defaultCenter,
      zoom: value?.lat ? 14 : 5,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    if (value?.lat) {
      markerRef.current = L.marker([value.lat, value.lng]).addTo(map);
    }

    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }
      const latFixed = parseFloat(lat.toFixed(6));
      const lngFixed = parseFloat(lng.toFixed(6));
      const address = await reverseGeocode(latFixed, lngFixed);
      onChange({ lat: latFixed, lng: lngFixed, address });
    });

    mapInstanceRef.current = map;
    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  const useMyLocation = () => {
    if (!navigator.geolocation) { setGeoError('Geolocation not supported by your browser.'); return; }
    setLocating(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const map = mapInstanceRef.current;
        if (map) {
          map.setView([lat, lng], 16);
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = L.marker([lat, lng]).addTo(map);
          }
        }
        const latFixed = parseFloat(lat.toFixed(6));
        const lngFixed = parseFloat(lng.toFixed(6));
        const address = await reverseGeocode(latFixed, lngFixed);
        onChange({ lat: latFixed, lng: lngFixed, address });
        setLocating(false);
      },
      (err) => {
        setGeoError('Could not get location. Please click on the map to pin it manually.');
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="flex items-center gap-1.5 text-sm font-medium text-navy-800 bg-navy-50 border border-navy-200 px-3 py-1.5 rounded hover:bg-navy-100 disabled:opacity-50 transition-colors"
        >
          {locating ? (
            <div className="w-4 h-4 border-2 border-navy-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Crosshair size={14} />
          )}
          {locating ? 'Detecting…' : 'Use My Location'}
        </button>

        {value?.lat && (
          <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-mono">
            <MapPin size={11} className="text-red-500" />
            {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
          </span>
        )}

        {value?.address && (
          <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded truncate max-w-md" title={value.address}>
            📍 {value.address}
          </span>
        )}

        {!value?.lat && (
          <span className="text-xs text-amber-600">Click on the map below to mark the issue location</span>
        )}
      </div>

      {geoError && (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
          <AlertCircle size={12} /> {geoError}
        </div>
      )}

      <div
        ref={mapRef}
        className="w-full h-52 rounded-lg border border-gray-200 shadow-sm overflow-hidden"
        style={{ zIndex: 1 }}
      />
    </div>
  );
}
