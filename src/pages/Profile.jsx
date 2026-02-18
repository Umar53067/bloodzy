import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import Button from "../components/Button";
import AlertMessage from "../components/AlertMessage";
import { BLOOD_TYPES, GENDERS, TYPOGRAPHY } from "../constants";
import { useDonor } from "../hooks/useDonor";
import { updateUserProfile } from "../lib/authService";
import { User, Mail, Calendar, Droplet, Phone, Map, Activity, CheckCircle, AlertCircle } from "lucide-react";

function Profile() {
  const { token, user: authUser } = useSelector((s) => s.auth);
  const { getDonor, updateDonor } = useDonor();
  const [me, setMe] = useState(null);
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Editable donor fields
  const [form, setForm] = useState({
    name: "",
    bloodGroup: "",
    age: "",
    gender: "",
    phone: "",
    city: "",
    available: true,
  });
  // Basic user fields
  const [profileForm, setProfileForm] = useState({ username: "", email: "" });
  // Location update (geolocation) – defined but not used in UI
  const [newLocation, setNewLocation] = useState(null);

  const joined = useMemo(() => {
    if (!me?.createdAt) return "—";
    try {
      return new Date(me.createdAt).toLocaleDateString();
    } catch {
      return "—";
    }
  }, [me]);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      if (!token || !authUser?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");

      try {
        // Mock user data
        const mockUser = {
          username: authUser?.username || "User",
          email: authUser?.email || "user@example.com",
          createdAt: new Date(),
        };

        // Fetch actual donor profile from Supabase
        const { data: donorData, error: donorError } = await getDonor(authUser.id);

        if (donorError) {
          console.error("Error fetching donor data:", donorError);
          // It's OK if donor profile doesn't exist yet
        }

        if (mounted) {
          setMe(mockUser);
          setProfileForm({ username: mockUser.username, email: mockUser.email });

          // Set donor data if exists
          if (donorData) {
            setDonor(donorData);
            setForm({
              name: donorData.name || "",
              bloodGroup: donorData.blood_group || "",
              age: donorData.age || "",
              gender: donorData.gender || "",
              phone: donorData.phone || "",
              city: donorData.city || "",
              available: donorData.available !== false,
            });
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        if (mounted) {
          setError("Failed to load profile data");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, [token, authUser?.id, getDonor]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (!donor?.id) {
        setError("Donor profile not found");
        setSaving(false);
        return;
      }

      // Update donor in Supabase
      const { data, error: updateError } = await updateDonor(donor.user_id, {
        name: form.name,
        blood_group: form.bloodGroup,
        age: parseInt(form.age),
        gender: form.gender,
        phone: form.phone,
        city: form.city,
        available: form.available,
      });

      if (updateError) {
        setError(updateError);
        setSaving(false);
        return;
      }

      setSuccess("Donor profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      // Update user profile metadata in Supabase Auth
      const { user, error: updateError } = await updateUserProfile({
        username: profileForm.username,
      });

      if (updateError) {
        setError(updateError);
        return;
      }

      setSuccess("Account details updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Update failed. Please try again.");
    }
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setNewLocation({ lat, lng });
        setSuccess("Current location captured; save to apply.");
      },
      () => {
        setError("Unable to fetch location. Please allow location access.");
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const displayName = me?.username || authUser?.username || "User";
  const email = me?.email || authUser?.email || "—";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-start justify-center px-4 py-12 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 md:p-10">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row items-center gap-6 border-b border-gray-200 pb-8 mb-8">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              displayName
            )}&background=dc2626&color=fff&size=128`}
            alt="profile"
            className="w-28 h-28 rounded-full border-4 border-red-600 shadow-lg"
          />
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-gray-900">{displayName}</h2>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  donor
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {donor ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" /> Active Donor
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-1" /> Not Registered
                  </>
                )}
              </span>
            </div>
            <div className="space-y-1 text-gray-600">
              <p className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4 text-red-600" />
                {email}
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <Calendar className="w-4 h-4 text-red-600" />
                Joined: {joined}
              </p>
            </div>
          </div>
        </div>

        {/* Alert messages */}
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

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Account Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-red-600" />
              Account Details
            </h3>
            <form onSubmit={handleProfileSave} className="space-y-5">
              <FormInput
                id="username"
                name="username"
                type="text"
                label="Username"
                value={profileForm.username}
                onChange={handleProfileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                value={profileForm.email}
                onChange={handleProfileChange}
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  {saving ? "Saving..." : "Save Account Details"}
                </Button>
              </div>
            </form>
          </div>

          {/* Donor Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-red-600" />
              Donor Information
            </h3>
            {!donor ? (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 text-center border-2 border-red-200">
                <Droplet className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <p className="text-gray-700 mb-4 italic">
                  "Your blood can save a life today. Be the reason someone smiles again."
                </p>
                <Button variant="primary" size="lg">
                  <Link to="/donate" className="text-white">
                    Register as Donor
                  </Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-5">
                <FormInput
                  id="name"
                  name="name"
                  type="text"
                  label="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
                <FormSelect
                  id="bloodGroup"
                  name="bloodGroup"
                  label="Blood Group"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  options={BLOOD_TYPES}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    id="age"
                    name="age"
                    type="number"
                    label="Age"
                    value={form.age}
                    onChange={handleChange}
                    min="18"
                    max="65"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  />
                  <FormSelect
                    id="gender"
                    name="gender"
                    label="Gender"
                    value={form.gender}
                    onChange={handleChange}
                    options={GENDERS}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  />
                </div>
                <FormInput
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
                <FormInput
                  id="city"
                  name="city"
                  type="text"
                  label="City"
                  value={form.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    id="available"
                    name="available"
                    type="checkbox"
                    checked={form.available}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Currently available to donate
                  </span>
                </label>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={saving}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;