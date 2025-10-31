import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Search, Phone, Clock, MapPin, Droplets, Shield, Heart } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

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

function HomePage() {
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
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapCenter([lat, lng]);

        try {
          setMessage("Fetching nearby donors...");
          const { data } = await axios.get("http://localhost:3000/api/donors/nearby", {
            params: {
              lat,
              lng,
              maxDistance: radiusKm * 1000,
              bloodGroup: bloodGroup || undefined,
            },
          });

          setDonors(data.donors || []);
          setMessage(data.donors?.length ? "" : "No donors found nearby.");
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
    <div className="flex flex-col min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="bg-red-600 py-12 text-center text-white">
        <h1 className="text-4xl font-bold">Find Blood Donors Near You</h1>
        <p className="mt-2 text-lg">Locate available donors around your area</p>

        <div className="mt-6 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-2 px-4">
          <div>
            <label className="block text-left text-white/90 text-sm mb-1">Blood Group</label>
            <select value={bloodGroup} onChange={(e)=>setBloodGroup(e.target.value)} className="w-full pr-4 py-2 rounded border text-black px-3">
              <option value="">Any</option>
              {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-left text-white/90 text-sm mb-1">Distance</label>
            <select value={radiusKm} onChange={(e)=>setRadiusKm(Number(e.target.value))} className="w-full pr-4 py-2 rounded border text-black px-3">
              {[5,10,15,20,30,40,50].map(km => (
                <option key={km} value={km}>{km} km</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
            onClick={handleSearch}
            disabled={loading}
            className={`px-4 py-2 bg-white text-red-600 rounded border font-semibold ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-red-100"
            }`}
          >
            {loading ? "Searching..." : "Search"}
          </button>
          </div>
        </div>

        {message && (
          <p className="mt-3 text-sm text-white bg-red-700 inline-block px-4 py-1 rounded">
            {message}
          </p>
        )}
      </section>

      {/* DONOR LIST + MAP */}
      <main className="flex-1 container mx-auto px-4 py-8 grid md:grid-cols-2 gap-6">
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

export default HomePage;
