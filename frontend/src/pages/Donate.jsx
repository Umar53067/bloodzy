import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Donate() {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  // Form fields
  const [bloodGroup, setBloodGroup] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [available, setAvailable] = useState(true);
  const [location, setLocation] = useState({ lat: "", lng: "" });

  // UI feedback
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate, token]);

  // 📍 Get current location from browser
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setMessage("❌ Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    setMessage("Fetching your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setMessage("✅ Location captured successfully!");
        setGettingLocation(false);
      },
      (error) => {
        console.error(error);
        setGettingLocation(false);
        setMessage("❌ Unable to fetch location. Please allow location access.");
      }
    );
  };

  // 🩸 Submit donor registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!location.lat || !location.lng) {
      setMessage("⚠️ Please get your location before submitting.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/donors/register",
        {
          bloodGroup,
          age,
          gender,
          phone,
          city,
          available,
          location,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ You are now registered as a donor!");
      setLoading(false);
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setLoading(false);
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
          Become a Blood Donor
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Fill out the form below to register as a blood donor.
        </p>

        {message && (
          <div
            className={`mb-4 p-3 rounded text-center ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Blood Group */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Blood Group
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select your blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Age
              </label>
              <input
                type="number"
                min="18"
                max="65"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="e.g. +1 555 123 4567"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              City / Location Name
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              placeholder="Your city"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Get Location Button */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Get Current Location
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={gettingLocation}
              className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition ${
                gettingLocation ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {gettingLocation ? "Getting location..." : "Get My Location"}
            </button>

            {location.lat && (
              <p className="text-sm text-gray-600 mt-2">
                📍 Latitude: <strong>{location.lat.toFixed(4)}</strong>, Longitude:{" "}
                <strong>{location.lng.toFixed(4)}</strong>
              </p>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              id="available"
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="available" className="text-gray-700">
              I am currently available to donate
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register as Donor"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Donate;
