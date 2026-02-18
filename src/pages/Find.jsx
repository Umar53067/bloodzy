import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Search, Phone, Clock, MapPin, Droplets, Shield, Heart } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useDonor } from "../hooks/useDonor";

// Fix default marker icons (Leaflet issue in React)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

function Find() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [radiusKm, setRadiusKm] = useState(5);
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // default center (India)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [seekerLocation, setSeekerLocation] = useState(null); // Add seeker location state
  const [geoLoading, setGeoLoading] = useState(true); // Track geolocation loading
  const { searchNearbyDonors } = useDonor();

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  /**
   * Extract coordinates from donor location object (handles multiple formats)
   */
  const extractCoordinates = (location) => {
    if (!location) {
      console.warn('❌ Location is null/undefined');
      return null;
    }
    
    console.log('📍 Extracting coordinates from location:', location);
    
    // Handle if location is a string (JSON stringified)
    if (typeof location === 'string') {
      try {
        location = JSON.parse(location);
        console.log('✓ Parsed location from string:', location);
      } catch (e) {
        console.error('❌ Failed to parse location string:', e);
        return null;
      }
    }

    // GeoJSON format: {type: "Point", coordinates: [lng, lat]}
    if (location.type === 'Point' && location.coordinates && Array.isArray(location.coordinates)) {
      const [lng, lat] = location.coordinates;
      if (typeof lng === 'number' && typeof lat === 'number' && isFinite(lng) && isFinite(lat)) {
        console.log('✓ GeoJSON format detected:', { lat, lng });
        return { lat, lng };
      }
    }
    
    // GeoJSON coordinates without type field
    if (location.coordinates && Array.isArray(location.coordinates)) {
      const [lng, lat] = location.coordinates;
      if (typeof lng === 'number' && typeof lat === 'number' && isFinite(lng) && isFinite(lat)) {
        console.log('✓ Coordinates array detected:', { lat, lng });
        return { lat, lng };
      }
    }
    
    // Direct format: {lat: x, lng: y}
    if (location.lat !== undefined && location.lng !== undefined) {
      const lat = parseFloat(location.lat);
      const lng = parseFloat(location.lng);
      if (isFinite(lat) && isFinite(lng)) {
        console.log('✓ lat/lng format detected:', { lat, lng });
        return { lat, lng };
      }
    }
    
    // Alternative format: {latitude: x, longitude: y}
    if (location.latitude !== undefined && location.longitude !== undefined) {
      const lat = parseFloat(location.latitude);
      const lng = parseFloat(location.longitude);
      if (isFinite(lat) && isFinite(lng)) {
        console.log('✓ latitude/longitude format detected:', { lat, lng });
        return { lat, lng };
      }
    }
    
    console.warn('⚠️ Could not extract coordinates from:', location);
    return null;
  };

  /**
   * Get seeker's location on page load
   */
  useEffect(() => {
    setGeoLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSeekerLocation({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);
          console.log('✓ Seeker location captured:', { latitude, longitude });
          setGeoLoading(false);
        },
        (error) => {
          console.warn('⚠️ Geolocation error:', error.message);
          setMessage('Geolocation failed. Using default location.');
          setSeekerLocation(null);
          setGeoLoading(false);
        }
      );
    } else {
      setMessage('Geolocation not supported');
      setGeoLoading(false);
    }
  }, []);

  // 📍 Search for nearby donors - using Find page approach
  const handleSearch = async () => {
    // Validate inputs
    if (!bloodGroup && !city) {
      setMessage('⚠️ Please enter at least a Blood Group or City to search');
      setDonors([]);
      return;
    }

    setLoading(true);
    setMessage("Searching for donors...");

    try {
      // Search Supabase for ALL donors matching blood group and city
      const { data, error } = await searchNearbyDonors(bloodGroup || null, city || null, 500);

      if (error) {
        console.error('❌ Error searching donors:', error);
        const errorMsg = error.includes('RLS')
          ? 'Access denied: Check database permissions'
          : error;
        setMessage(`Error searching donors: ${errorMsg}`);
        setDonors([]);
        setLoading(false);
        return;
      }

      console.log('📊 Raw search results from API:', { count: data?.length || 0, data });

      if (data && data.length > 0) {
        // Transform Supabase data with proper coordinate extraction and distance calculation
        const transformedDonors = [];
        const skippedDonors = [];
        
        data.forEach((donor) => {
          // Extract coordinates properly
          const coords = extractCoordinates(donor.location);
          
          if (!coords) {
            console.warn(`⚠️ Skipping donor ${donor.id} (${donor.user?.username || 'Unknown'}) - Invalid location:`, donor.location);
            skippedDonors.push({
              id: donor.id,
              name: donor.user?.username,
              reason: 'Invalid location coordinates'
            });
            return;
          }

          // Calculate distance if seeker location is available
          let distance = 'Unknown';
          if (seekerLocation) {
            const distKm = calculateDistance(
              seekerLocation.lat,
              seekerLocation.lng,
              coords.lat,
              coords.lng
            );
            distance = `${distKm.toFixed(1)} km`;
          }

          const transformed = {
            id: donor.id,
            name: donor.name,
            bloodGroup: donor.blood_group,
            age: donor.age,
            phone: donor.phone,
            city: donor.city,
            available: donor.available,
            distance,
            location: {
              coordinates: [coords.lng, coords.lat]
            }
          };
          
          transformedDonors.push(transformed);
        });

        console.log(`✓ Successfully transformed ${transformedDonors.length} donors`);
        if (skippedDonors.length > 0) {
          console.warn(`⚠️ Skipped ${skippedDonors.length} donors due to invalid locations:`, skippedDonors);
        }
        console.log(`📍 Ready to display ${transformedDonors.length} donors on map`);

        if (transformedDonors.length === 0) {
          setMessage(`❌ Found ${data.length} match(es) but none have valid location data. Ask donors to complete their profile location.`);
          setDonors([]);
        } else {
          setMessage(
            `✓ Found ${transformedDonors.length} donor${transformedDonors.length !== 1 ? 's' : ''} with valid locations matching your criteria`
          );
          setDonors(transformedDonors);

          // Center map on first donor if available
          if (transformedDonors[0]?.location?.coordinates) {
            const [lng, lat] = transformedDonors[0].location.coordinates;
            setMapCenter([lat, lng]);
            console.log('🗺️ Map centered on first donor:', { lat, lng });
          }
        }
      } else {
        const searchCriteria = bloodGroup && city ? `${bloodGroup} blood type in ${city}` : bloodGroup ? `${bloodGroup} blood type` : 'donors';
        setMessage(
          `No ${searchCriteria} found in the database. Try registering as a donor first!`
        );
        setDonors([]);
      }
    } catch (err) {
      console.error('❌ Search error:', err);
      setMessage(`Error searching donors: ${err.message}`);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDonorSelect = (donor) => {
    setSelectedDonor(donor);
    setMapCenter([
      donor.location.coordinates[1],
      donor.location.coordinates[0],
    ]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* HERO SECTION - Enhanced with gradient */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 py-16 text-center text-white overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">Find Blood Donors Near You</h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto mb-8">Connect with verified donors in your area. Save lives in minutes, not hours.</p>

          <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 mb-4">
            <div>
              <label className="block text-left text-red-100 text-sm font-medium mb-2">Blood Group</label>
              <select value={bloodGroup} onChange={(e)=>setBloodGroup(e.target.value)} className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 bg-white shadow-lg focus:ring-2 focus:ring-red-300 font-medium">
                <option value="">Any Group</option>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-left text-red-100 text-sm font-medium mb-2">City</label>
              <input
                type="text"
                value={city}
                onChange={(e)=>setCity(e.target.value)}
                placeholder="Enter city name"
                className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 bg-white shadow-lg focus:ring-2 focus:ring-red-300 font-medium"
              />
            </div>
            <div>
              <label className="block text-left text-red-100 text-sm font-medium mb-2">Search Radius</label>
              <select value={radiusKm} onChange={(e)=>setRadiusKm(Number(e.target.value))} className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 bg-white shadow-lg focus:ring-2 focus:ring-red-300 font-medium">
                {[5,10,15,20,30,40,50].map(km => (
                  <option key={km} value={km}>{km} km</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className={`w-full px-6 py-3 bg-white text-red-600 rounded-lg font-bold text-lg transition-all transform ${
                  loading 
                    ? "opacity-75 cursor-not-allowed" 
                    : "hover:bg-red-50 hover:shadow-xl hover:scale-105 active:scale-95"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Search size={20} />
                  {loading ? "Searching..." : "Search Now"}
                </span>
              </button>
            </div>
          </div>

          {message && (
            <div className={`mt-4 inline-block px-6 py-3 rounded-lg font-medium transition-all ${
              message.includes("✅") 
                ? "bg-green-500/20 text-green-100 border border-green-500/50" 
                : message.includes("❌") 
                ? "bg-red-500/20 text-red-100 border border-red-500/50"
                : "bg-yellow-500/20 text-yellow-100 border border-yellow-500/50"
            }`}>
              {message}
            </div>
          )}
        </div>
      </section>

      {/* DONOR LIST + MAP */}
      <main className="flex-1 container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        {/* Donor List / Left Panel */}
        <div className="space-y-4">
          {donors.length === 0 ? (
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg flex items-start gap-3">
                <Droplets className="text-red-600"/>
                <div>
                  <div className="font-semibold">Every drop counts</div>
                  <div className="text-sm text-gray-600">One donation can save up to three lives. Search to see who needs you nearby.</div>
                </div>
              </div>
              <div className="p-4 border rounded-lg flex items-start gap-3">
                <Shield className="text-red-600"/>
                <div>
                  <div className="font-semibold">Safe and Simple</div>
                  <div className="text-sm text-gray-600">Modern blood donation is quick, safe, and monitored by professionals.</div>
                </div>
              </div>
              <div className="p-4 border rounded-lg flex items-start gap-3">
                <Heart className="text-red-600"/>
                <div>
                  <div className="font-semibold">Be the reason</div>
                  <div className="text-sm text-gray-600">Share hope in your community. Start by searching donors around you.</div>
                </div>
              </div>
            </div>
          ) : (
            donors.map((donor) => (
              <div
                key={donor.id}
                onClick={() => handleDonorSelect(donor)}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition ${
                  selectedDonor?.id === donor.id
                    ? "border-red-600"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{donor.name || "Donor"}</h2>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      donor.available
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {donor.available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Blood Group: {donor.bloodGroup}
                </p>
                <p className="text-sm text-gray-600">
                  City: {donor.city}
                </p>
                <p className="text-sm text-gray-600">
                  Distance: {donor.distance}
                </p>
                <p className="flex items-center text-sm text-gray-600 gap-1">
                  <Phone size={14} /> {donor.phone}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Map */}
        <div className="h-96 md:h-auto min-h-[400px] relative">
          <MapContainer
            center={mapCenter}
            zoom={13}
            className="h-full w-full rounded-lg z-0"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater center={mapCenter} />

            {/* Current user location marker */}
            <Marker position={mapCenter}>
              <Popup>
                <strong>Your Location</strong>
              </Popup>
            </Marker>

            {/* Donor Markers */}
            {donors.length > 0 && donors.map((donor) => {
              if (!donor.location || !donor.location.coordinates) {
                console.warn(`⚠️ Skipping donor ${donor.id} - no valid coordinates`);
                return null;
              }
              const lat = donor.location.coordinates[1];
              const lng = donor.location.coordinates[0];
              
              if (isNaN(lat) || isNaN(lng)) {
                console.warn(`⚠️ Skipping donor ${donor.id} - invalid coordinates:`, { lat, lng });
                return null;
              }
              
              console.log(`✓ Rendering marker for ${donor.name}:`, { lat, lng });
              
              return (
                <Marker
                  key={donor.id}
                  position={[lat, lng]}
                  title={donor.name}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <strong>{donor.name}</strong>
                      <br />
                      <span className="text-red-600 font-semibold">Blood Group: {donor.bloodGroup}</span>
                      <br />
                      City: {donor.city}
                      <br />
                      Distance: <span className="font-semibold text-green-600">{donor.distance}</span>
                      <br />
                      Phone: {donor.phone}
                      <br />
                      Status: {donor.available ? <span className="text-green-600">✓ Available</span> : <span className="text-orange-600">⚠️ Unavailable</span>}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
            
            {/* Seeker Location Marker (if available) */}
            {seekerLocation && (
              <Marker 
                position={[seekerLocation.lat, seekerLocation.lng]}
                title="Your Location"
              >
                <Popup>
                  <strong>📍 Your Location</strong>
                  <br />
                  Lat: {seekerLocation.lat.toFixed(4)}
                  <br />
                  Lng: {seekerLocation.lng.toFixed(4)}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}

export default Find;
