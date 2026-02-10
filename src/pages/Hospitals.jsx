import React, { useState, useEffect } from "react";
import { useHospital } from "../hooks/useHospital";
import { useAuthStateSync } from "../hooks/useAuthStateSync";
import HospitalCard from "../components/HospitalCard";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";
import { Search, MapPin, AlertCircle } from "lucide-react";

export default function Hospitals() {
  const isAuthenticated = useAuthStateSync();
  const { getHospitals, searchHospitals, getCitiesWithHospitals } =
    useHospital();

  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, verified, emergency, bloodbank
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Fetch hospitals and cities on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all hospitals
        const { data: hospitalsData, error: hospitalsError } =
          await getHospitals();
        if (hospitalsError) throw new Error(hospitalsError);

        // Fetch cities
        const { data: citiesData, error: citiesError } =
          await getCitiesWithHospitals();
        if (citiesError) throw new Error(citiesError);

        setHospitals(hospitalsData || []);
        setFilteredHospitals(hospitalsData || []);

        // Extract unique cities
        const uniqueCities = citiesData
          ? citiesData.map((item) => item.city).filter(Boolean)
          : [];
        setCities(uniqueCities);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load hospitals");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let results = hospitals;

    // Apply city filter
    if (selectedCity) {
      results = results.filter((h) => h.city === selectedCity);
    }

    // Apply type filter
    if (filterType === "verified") {
      results = results.filter((h) => h.verified);
    } else if (filterType === "emergency") {
      results = results.filter((h) => h.emergency_24h);
    } else if (filterType === "bloodbank") {
      results = results.filter((h) => h.blood_bank);
    }

    // Apply search term
    if (searchTerm) {
      results = results.filter(
        (h) =>
          h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (h.blood_types &&
            h.blood_types.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredHospitals(results);
  }, [hospitals, selectedCity, filterType, searchTerm]);

  const handleSelectHospital = (hospital) => {
    setSelectedHospital(hospital);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please log in to view hospitals and blood banks
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">🏥 Hospitals & Blood Banks</h1>
          <p className="text-red-100">Find trusted hospitals and blood banks near you</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && <AlertMessage type="error" message={error} />}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by hospital name, address, or blood type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hospital Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Hospitals</option>
                <option value="verified">Verified Only</option>
                <option value="emergency">24/7 Emergency</option>
                <option value="bloodbank">Blood Banks</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="w-full px-4 py-2 bg-gray-100 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  {filteredHospitals.length} result{filteredHospitals.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <LoadingSpinner />
          </div>
        ) : filteredHospitals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hospitals found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search filters or selecting a different city
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hospitals List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredHospitals.map((hospital) => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  onSelect={handleSelectHospital}
                />
              ))}
            </div>

            {/* Selected Hospital Details */}
            {selectedHospital && (
              <div className="lg:col-span-1 sticky top-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        Hospital Name
                      </p>
                      <p className="text-gray-800">{selectedHospital.name}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        Address
                      </p>
                      <p className="text-gray-800 text-sm">
                        {selectedHospital.address}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        Phone
                      </p>
                      <a
                        href={`tel:${selectedHospital.phone}`}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        {selectedHospital.phone}
                      </a>
                    </div>

                    {selectedHospital.email && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          Email
                        </p>
                        <a
                          href={`mailto:${selectedHospital.email}`}
                          className="text-blue-600 hover:underline text-sm font-medium break-all"
                        >
                          {selectedHospital.email}
                        </a>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Status
                      </p>
                      <div className="space-y-1">
                        {selectedHospital.verified && (
                          <p className="text-sm text-green-700">✓ Verified Hospital</p>
                        )}
                        {selectedHospital.blood_bank && (
                          <p className="text-sm text-blue-700">🩸 Has Blood Bank</p>
                        )}
                        {selectedHospital.emergency_24h && (
                          <p className="text-sm text-red-700">⏰ 24/7 Emergency</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        window.open(
                          `tel:${selectedHospital.phone}`,
                          "_self"
                        )
                      }
                      className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                    >
                      Call Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
