// HomePage.jsx
import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Search, Phone, Clock } from "lucide-react"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix marker icon (Leaflet’s default icons break in React)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// Sample Donors
const initialDonors = [
  {
    id: 1,
    name: "John Smith",
    bloodGroup: "A+",
    distance: 2.5,
    lastDonation: "3 months ago",
    location: [51.505, -0.09],
    phone: "+1 (555) 123-4567",
    available: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    bloodGroup: "O-",
    distance: 5.1,
    lastDonation: "1 month ago",
    location: [51.51, -0.1],
    phone: "+1 (555) 987-6543",
    available: false,
  },
]

function MapUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 13)
  }, [center, map])
  return null
}

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [donors] = useState(initialDonors)
  const [filteredDonors, setFilteredDonors] = useState(initialDonors)
  const [selectedDonor, setSelectedDonor] = useState(null)
  const [mapCenter, setMapCenter] = useState([51.505, -0.09])

  // Filter donors
  useEffect(() => {
    if (searchQuery) {
      const filtered = donors.filter((donor) =>
        donor.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredDonors(filtered)
    } else {
      setFilteredDonors(donors)
    }
  }, [searchQuery, donors])

  const handleDonorSelect = (donor) => {
    setSelectedDonor(donor)
    setMapCenter(donor.location)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="bg-red-600 py-12 text-center text-white">
        <h1 className="text-4xl font-bold">Find Blood Donors Near You</h1>
        <p className="mt-2 text-lg">Connect with blood donors in your area and save lives</p>
        <div className="mt-6 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2 px-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by blood group (e.g., A+, B-, O+)"
              className="w-full pl-9 pr-4 py-2 rounded border text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 bg-white text-red-600 rounded border">Search</button>
        </div>
      </section>

      {/* DONOR LIST + MAP */}
      <main className="flex-1 container mx-auto px-4 py-8 grid md:grid-cols-2 gap-6">
        {/* Donor List */}
        <div className="space-y-4">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              onClick={() => handleDonorSelect(donor)}
              className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition ${
                selectedDonor?.id === donor.id ? "border-red-600" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{donor.name}</h2>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    donor.available ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {donor.available ? "Available" : "Unavailable"}
                </span>
              </div>
              <p className="text-sm text-gray-600">Blood Group: {donor.bloodGroup}</p>
              <p className="text-sm text-gray-600">Distance: {donor.distance} km</p>
              <p className="flex items-center text-sm text-gray-600 gap-1">
                <Clock size={14} /> Last Donation: {donor.lastDonation}
              </p>
              <p className="flex items-center text-sm text-gray-600 gap-1">
                <Phone size={14} /> {donor.phone}
              </p>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="h-96 md:h-auto min-h-[400px]">
          <MapContainer center={mapCenter} zoom={13} className="h-full w-full rounded-lg z-0">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater center={mapCenter} />
            {filteredDonors.map((donor) => (
              <Marker key={donor.id} position={donor.location}>
                <Popup>
                  <strong>{donor.name}</strong>
                  <br />
                  Blood Group: {donor.bloodGroup}
                  <br />
                  Phone: {donor.phone}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>
    </div>
  )
}

export default HomePage
