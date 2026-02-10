import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import Button from "../components/Button";
import AlertMessage from "../components/AlertMessage";
import { BLOOD_TYPES, GENDERS, SPACING, TYPOGRAPHY } from "../constants";
import { useDonor } from "../hooks/useDonor";

function Donate() {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const { createDonor, loading: donorLoading } = useDonor();

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate, token]);

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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className={`${TYPOGRAPHY.h2} text-center text-red-600 mb-2`}>
          Become a Blood Donor
        </h2>
        <p className={`${TYPOGRAPHY.body} text-center text-gray-600 mb-8`}>
          Fill out the form below to register as a blood donor and help save lives.
        </p>

        {error && (
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError("")}
          />
        )}
        
        {success && (
          <AlertMessage
            type="success"
            message={success}
            onClose={() => setSuccess("")}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <FormSelect
            id="bloodGroup"
            name="bloodGroup"
            label="Blood Group"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            options={BLOOD_TYPES}
            required
            error={errors.bloodGroup}
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
          />

          {/* Get Location Button */}
          <div>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              loading={gettingLocation}
              onClick={handleGetLocation}
            >
              📍 Get My Location
            </Button>

            {location.lat && (
              <p className="text-sm text-gray-600 mt-3 px-3 py-2 bg-green-50 rounded border border-green-200">
                ✅ Location captured: <strong>{location.lat.toFixed(4)}</strong>, <strong>{location.lng.toFixed(4)}</strong>
              </p>
            )}
          </div>

          {/* Availability Checkbox */}
          <div className="flex items-center gap-3">
            <input
              id="available"
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-red-600 cursor-pointer"
            />
            <label htmlFor="available" className="text-sm font-medium text-gray-700 cursor-pointer">
              I am currently available to donate blood
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading || donorLoading}
            disabled={donorLoading}
          >
            {loading || donorLoading ? "Registering..." : "Register as Donor"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Donate;
