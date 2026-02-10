import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Search, Phone, Clock, MapPin, Droplets, Shield, Heart } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

function Homepage() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [radiusKm, setRadiusKm] = useState(5);
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // default center (India)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 📍 Get user's location & fetch nearby donors
  const handleSearch = () => {
    setLoading(true);
    setMessage("Getting your location...");

    if (!navigator.geolocation) {
      setMessage("❌ Geolocation not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapCenter([lat, lng]);

        try {
          setMessage("Mock data: Nearby donors loaded");
          // API call removed - mock data used instead
          setDonors([]);
        } catch (err) {
          console.error(err);
          setMessage("⚠️ Failed to fetch donors. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        setMessage("❌ Unable to access location. Please allow permission.");
        setLoading(false);
      }
    );
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

          <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 mb-4">
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
                key={donor._id}
                onClick={() => handleDonorSelect(donor)}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition ${
                  selectedDonor?._id === donor._id
                    ? "border-red-600"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{donor.user?.username || "Donor"}</h2>
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
                <p className="flex items-center text-sm text-gray-600 gap-1">
                  <Clock size={14} /> Last Donation:{" "}
                  {donor.lastDonation
                    ? new Date(donor.lastDonation).toLocaleDateString()
                    : "N/A"}
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
            {donors.map((donor) => (
              <Marker
                key={donor._id}
                position={[
                  donor.location.coordinates[1],
                  donor.location.coordinates[0],
                ]}
              >
                <Popup>
                  <strong>{donor.user?.username || "Donor"}</strong>
                  <br />
                  Blood Group: {donor.bloodGroup}
                  <br />
                  Phone: {donor.phone}
                  <br />
                  City: {donor.city}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}

export default Homepage;
