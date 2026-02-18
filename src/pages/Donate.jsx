import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import Button from "../components/Button";
import AlertMessage from "../components/AlertMessage";
import { BLOOD_TYPES, GENDERS, SPACING, TYPOGRAPHY } from "../constants";
import { useDonor } from "../hooks/useDonor";
import { CheckCircle, Edit3, MapPin, Heart, Droplet, User, Phone, Map, Calendar, Activity } from "lucide-react";

function Donate() {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const { createDonor, getDonor, loading: donorLoading } = useDonor();

  // Form fields
  const [name, setName] = useState("")
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  
  // Check if already a donor
  const [isAlreadyDonor, setIsAlreadyDonor] = useState(false);
  const [checkingDonorStatus, setCheckingDonorStatus] = useState(true);
  const [existingDonor, setExistingDonor] = useState(null);

  // Check if user is already a donor
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const checkDonorStatus = async () => {
      try {
        setCheckingDonorStatus(true);
        if (!user || !user.id) {
          setCheckingDonorStatus(false);
          return;
        }

        const { data, error: donorError } = await getDonor(user.id);
        
        if (!donorError && data) {
          setIsAlreadyDonor(true);
          setExistingDonor(data);
        }
      } catch (err) {
        console.error("Error checking donor status:", err);
      } finally {
        setCheckingDonorStatus(false);
      }
    };

    checkDonorStatus();
  }, [token, user, getDonor, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!age) newErrors.age = 'Age is required';
    else if (age < 18 || age > 65) newErrors.age = 'Age must be between 18 and 65';
    if (!gender) newErrors.gender = 'Gender is required';
    if (!phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\+?[0-9]{10,}/.test(phone.replace(/\D/g, ''))) newErrors.phone = 'Valid phone number required';
    if (!city.trim()) newErrors.city = 'City is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 📍 Get current location from browser
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setSuccess("Location captured successfully!");
        setGettingLocation(false);
        
        setTimeout(() => setSuccess(""), 3000);
      },
      (error) => {
        console.error(error);
        setGettingLocation(false);
        setError("Unable to fetch location. Please allow location access.");
      }
    );
  };

  // 🩸 Submit donor registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError("Please fix the errors below");
      return;
    }

    if (!location.lat || !location.lng) {
      setError("Please get your location before submitting.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Create donor profile in Supabase
      if (!user || !user.id) {
        setError("User information not found. Please login again.");
        setLoading(false);
        return;
      }

      const { data, error: donorError } = await createDonor(user.id, {
       name,
        bloodGroup,
        age: parseInt(age),
        gender,
        phone,
        city,
        available,
        location: {
          latitude: location.lat,
          longitude: location.lng,
        },
      });

      if (donorError) {
        console.error("Donor registration error:", donorError);
        setError(donorError || "Failed to register as donor. Please try again.");
        setLoading(false);
        return;
      }

      if (data) {
        setSuccess("🎉 You are now registered as a blood donor!");
        
        // Reset form
        setBloodGroup("");
        setAge("");
        setGender("");
        setPhone("");
        setCity("");
        setLocation({ lat: "", lng: "" });
        setAvailable(true);
        
        setTimeout(() => navigate("/profile"), 1500);
      }
    } catch (err) {
      console.error("Donation registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Hero Section */}
          <div className="lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-red-700 to-red-900 text-white flex flex-col justify-between">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Give the gift of life</h1>
              <p className="text-xl text-red-100 mb-8">
                Your donation can save up to three lives. Join our community of heroes today.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Droplet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Quick Registration</h3>
                    <p className="text-red-200">Fill out the form and get verified in minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Location Based Alerts</h3>
                    <p className="text-red-200">Get notified when someone near you needs your blood type</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Track Your Impact</h3>
                    <p className="text-red-200">See how many lives you've touched through your donations</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-red-200 mt-8">
              Already registered? <a href="/profile" className="font-semibold underline hover:text-white transition">View your profile</a>
            </p>
          </div>

          {/* Right Side - Content */}
          <div className="lg:w-1/2 p-8 lg:p-12 bg-white">
            {checkingDonorStatus ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                <p className="text-gray-600">Checking your donor status...</p>
              </div>
            ) : isAlreadyDonor && existingDonor ? (
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex bg-green-100 p-4 rounded-full mb-4">
                    <CheckCircle size={48} className="text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">You're a Donor! 🎉</h2>
                  <p className="text-gray-600">Thank you for being part of our lifesaving community.</p>
                </div>

                {/* Donor Card */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 mb-6 border border-red-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-red-600" />
                    Your Current Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-red-100">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-red-600" />
                        Blood Group:
                      </span>
                      <span className="font-bold text-red-600 text-lg">{existingDonor.blood_group || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-red-100">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-red-600" />
                        Age:
                      </span>
                      <span className="font-semibold text-gray-900">{existingDonor.age || "N/A"} years</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-red-100">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-red-600" />
                        Gender:
                      </span>
                      <span className="font-semibold text-gray-900">{existingDonor.gender || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-red-100">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-red-600" />
                        Phone:
                      </span>
                      <span className="font-semibold text-gray-900">{existingDonor.phone || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-red-100">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Map className="w-4 h-4 text-red-600" />
                        City:
                      </span>
                      <span className="font-semibold text-gray-900">{existingDonor.city || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-semibold ${existingDonor.available ? "text-green-600 bg-green-50 px-3 py-1 rounded-full" : "text-orange-600 bg-orange-50 px-3 py-1 rounded-full"}`}>
                        {existingDonor.available ? "✓ Available to donate" : "⚠️ Currently unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={() => navigate("/profile")}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200 transform hover:-translate-y-0.5"
                  >
                    <Edit3 size={20} />
                    Update Your Information
                  </Button>
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => navigate("/")}
                    className="flex items-center justify-center gap-2 border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold py-3 px-6 rounded-lg transition duration-200"
                  >
                    Back to Home
                  </Button>
                </div>

                <p className="text-sm text-gray-500 text-center mt-6">
                  Want to update your blood type, location, or availability? <br />
                  Click the update button above.
                </p>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Become a Blood Donor</h2>
                <p className="text-gray-600 mb-8">Fill out the form below to register and start saving lives.</p>

                {error && (
                  <AlertMessage
                    type="error"
                    message={error}
                    onClose={() => setError("")}
                    className="mb-6"
                  />
                )}
                
                {success && (
                  <AlertMessage
                    type="success"
                    message={success}
                    onClose={() => setSuccess("")}
                    className="mb-6"
                  />
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <FormInput
                    id="name"
                    name="name"
                    type="text"
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    error={errors.name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    icon={<User className="w-5 h-5 text-gray-400" />}
                  />

                  <FormSelect
                    id="bloodGroup"
                    name="bloodGroup"
                    label="Blood Group"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    options={BLOOD_TYPES}
                    required
                    error={errors.bloodGroup}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    icon={<Droplet className="w-5 h-5 text-gray-400" />}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      id="age"
                      name="age"
                      type="number"
                      label="Age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="18"
                      max="65"
                      required
                      error={errors.age}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                      icon={<Calendar className="w-5 h-5 text-gray-400" />}
                    />

                    <FormSelect
                      id="gender"
                      name="gender"
                      label="Gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      options={GENDERS}
                      required
                      error={errors.gender}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                      icon={<Activity className="w-5 h-5 text-gray-400" />}
                    />
                  </div>

                  <FormInput
                    id="phone"
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 555 123 4567"
                    required
                    error={errors.phone}
                    autoComplete="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    icon={<Phone className="w-5 h-5 text-gray-400" />}
                  />

                  <FormInput
                    id="city"
                    name="city"
                    type="text"
                    label="City / Location Name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Your city"
                    required
                    error={errors.city}
                    autoComplete="address-level2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    icon={<Map className="w-5 h-5 text-gray-400" />}
                  />

                  {/* Location Button */}
                  <div>
                    <Button
                      type="button"
                      variant="secondary"
                      fullWidth
                      loading={gettingLocation}
                      onClick={handleGetLocation}
                      className="flex items-center justify-center gap-2 border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold py-3 px-6 rounded-lg transition duration-200"
                    >
                      <MapPin className="w-5 h-5" />
                      {gettingLocation ? "Getting Location..." : "📍 Get My Location"}
                    </Button>

                    {location.lat && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>
                          Location captured: <strong>{location.lat.toFixed(4)}</strong>, <strong>{location.lng.toFixed(4)}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Availability Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={available}
                      onChange={(e) => setAvailable(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      I am currently available to donate blood
                    </span>
                  </label>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={loading || donorLoading}
                    disabled={donorLoading}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200 transform hover:-translate-y-0.5"
                  >
                    {loading || donorLoading ? "Registering..." : "Register as Donor"}
                  </Button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-6">
                  By registering, you agree to be contacted for blood donation requests in your area.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Donate;