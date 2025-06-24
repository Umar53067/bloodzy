// BloodConnect.jsx
import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Search, MapPin, Phone, Clock, Filter } from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"

// Types
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
  // Add the rest of the donor data as shown in your original code...
]

function MapUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 13)
  }, [center, map])
  return null
}

function Homepage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [donors, setDonors] = useState(initialDonors)
  const [filteredDonors, setFilteredDonors] = useState(initialDonors)
  const [selectedDonor, setSelectedDonor] = useState(null)
  const [mapCenter, setMapCenter] = useState([51.505, -0.09])
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    if (searchQuery) {
      const filtered = donors.filter((donor) => donor.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredDonors(filtered)
    } else {
      setFilteredDonors(donors)
    }
  }, [searchQuery, donors])

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const handleDonorSelect = (donor) => {
    setSelectedDonor(donor)
    setMapCenter(donor.location)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b z-30">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-red-600 rounded-full"></div>
            <span className="text-xl font-bold text-red-600">Bloodzy</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-black hover:text-red-600">Home</Link>
            <Link to="/donate" className="text-sm font-medium text-gray-600 hover:text-red-600">Donate</Link>
            <Link to="/find" className="text-sm font-medium text-gray-600 hover:text-red-600">Find Donors</Link>
            <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-red-600">About Us</Link>
            <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-red-600">Contact</Link>
          </nav>
          <div className="hidden md:flex gap-4">
            <Link to="/login" className="border px-3 py-1 rounded text-sm">Sign In</Link>
            <Link to="/signup" className="bg-red-600 text-white px-3 py-1 rounded text-sm">Sing Up</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-red-600 py-12 text-center text-white">
          <h1 className="text-4xl font-bold">Find Blood Donors Near You</h1>
          <p className="mt-2 text-lg">Connect with blood donors in your area and save lives</p>
          <div className="mt-6 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2 px-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by blood group (e.g., A+, B-, O+)"
                className="w-full pl-9 pr-4 py-2 rounded border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="px-4 py-2 bg-white text-red-600 rounded border">Search</button>
          </div>
        </section>

        {/* More layout continued... */}
        {/* You can continue replicating the donor list, map, and footer using Tailwind similar to above */}
      </main>

      <footer className="border-t bg-gray-100 text-sm text-gray-600">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; {new Date().getFullYear()} BloodConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Homepage;