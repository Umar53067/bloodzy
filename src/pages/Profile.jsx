import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import FormInput from "../components/FormInput"
import FormSelect from "../components/FormSelect"
import Button from "../components/Button"
import AlertMessage from "../components/AlertMessage"
import { BLOOD_TYPES, GENDERS, TYPOGRAPHY } from "../constants"
import { useDonor } from "../hooks/useDonor"
import { updateUserProfile } from "../lib/authService"

function Profile() {
  const { token, user: authUser } = useSelector((s) => s.auth)
  const { getDonor, updateDonor } = useDonor()
  const [me, setMe] = useState(null)
  const [donor, setDonor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Editable donor fields
  const [form, setForm] = useState({
    bloodGroup: "",
    age: "",
    gender: "",
    phone: "",
    city: "",
    available: true,
  })
  // Basic user fields
  const [profileForm, setProfileForm] = useState({ username: "", email: "" })
  // Location update (geolocation)
  const [newLocation, setNewLocation] = useState(null)

  const joined = useMemo(() => {
    if (!me?.createdAt) return "—"
    try { return new Date(me.createdAt).toLocaleDateString() } catch { return "—" }
  }, [me])

  useEffect(() => {
    let mounted = true
    async function fetchData() {
      if (!token || !authUser?.id) {
        setLoading(false)
        return
      }
      setLoading(true)
      setError("")
      
      try {
        // Mock user data
        const mockUser = {
          username: authUser?.username || "User",
          email: authUser?.email || "user@example.com",
          createdAt: new Date()
        }
        
        // Fetch actual donor profile from Supabase
        const { data: donorData, error: donorError } = await getDonor(authUser.id)
        
        if (donorError) {
          console.error("Error fetching donor data:", donorError)
          // It's OK if donor profile doesn't exist yet
        }
        
        if (mounted) {
          setMe(mockUser)
          setProfileForm({ username: mockUser.username, email: mockUser.email })
          
          // Set donor data if exists
          if (donorData) {
            setDonor(donorData)
            setForm({
              bloodGroup: donorData.blood_group || "",
              age: donorData.age || "",
              gender: donorData.gender || "",
              phone: donorData.phone || "",
              city: donorData.city || "",
              available: donorData.available !== false,
            })
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err)
        if (mounted) {
          setError("Failed to load profile data")
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [token, authUser?.id, getDonor])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileForm((f) => ({ ...f, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")
    try {
      if (!donor?.id) {
        setError("Donor profile not found")
        setSaving(false)
        return
      }

      // Update donor in Supabase
      const { data, error: updateError } = await updateDonor(donor.id, {
        blood_group: form.bloodGroup,
        age: parseInt(form.age),
        gender: form.gender,
        phone: form.phone,
        city: form.city,
        available: form.available,
      })

      if (updateError) {
        setError(updateError)
        setSaving(false)
        return
      }

      setSuccess("Donor profile updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.message || "Update failed. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    try {
      // Update user profile metadata in Supabase Auth
      const { user, error: updateError } = await updateUserProfile({
        username: profileForm.username,
      })

      if (updateError) {
        setError(updateError)
        return
      }

      setSuccess("Account details updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.message || "Update failed. Please try again.")
    }
  }

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser")
      return
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      setNewLocation({ lat, lng })
      setSuccess("Current location captured; save to apply.")
    }, () => {
      setError("Unable to fetch location. Please allow location access.")
    })
  }

  if (loading) {
    return <div className="container mx-auto p-6 max-w-3xl">Loading...</div>
  }

  const displayName = me?.username || authUser?.username || "User"
  const email = me?.email || authUser?.email || "—"

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white shadow-lg rounded-xl p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=dc2626&color=fff`}
              alt="profile"
              className="w-24 h-24 rounded-full border-4 border-red-600"
            />
            <div>
              <h2 className={`${TYPOGRAPHY.h2} text-gray-900`}>{displayName}</h2>
              <p className="text-gray-600 text-lg">{email}</p>
              <p className="text-sm text-gray-500 mt-1">Joined: {joined}</p>
              <p className={`text-sm font-semibold mt-2 ${donor ? 'text-green-600' : 'text-amber-600'}`}>
                {donor ? "✅ Active Donor" : "📝 Not yet a Donor"}
              </p>
            </div>
          </div>

          {/* Alert Messages */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Account Details Section */}
            <div className="pb-8 lg:border-r lg:pr-8">
              <h3 className={`${TYPOGRAPHY.h3} text-gray-900 mb-6`}>Account Details</h3>
              <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  id="username"
                  name="username"
                  type="text"
                  label="Username"
                  value={profileForm.username}
                  onChange={handleProfileChange}
                />
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  autoComplete="email"
                />
                <div className="md:col-span-2 flex justify-end">
                  <Button 
                    type="submit" 
                    variant="primary"
                    loading={saving}
                  >
                    {saving ? "Saving..." : "Save Account Details"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Donor Section */}
            <div>
            {!donor ? (
              <div className="text-center py-12 bg-red-50 rounded-lg border-2 border-red-200">
                <p className={`${TYPOGRAPHY.body} text-gray-700 mb-6 italic max-w-md mx-auto`}>
                  "Your blood can save a life today. Be the reason someone smiles again."
                </p>
                <Button variant="primary" size="lg">
                  <Link to="/donate" className="text-white">Register as Donor</Link>
                </Button>
              </div>
            ) : (
              <>
                <h3 className={`${TYPOGRAPHY.h3} text-gray-900 mb-6`}>Donor Information</h3>
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect
                  id="bloodGroup"
                  name="bloodGroup"
                  label="Blood Group"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  options={BLOOD_TYPES}
                />
                <FormInput
                  id="age"
                  name="age"
                  type="number"
                  label="Age"
                  value={form.age}
                  onChange={handleChange}
                  min="18"
                  max="65"
                />
                <FormSelect
                  id="gender"
                  name="gender"
                  label="Gender"
                  value={form.gender}
                  onChange={handleChange}
                  options={GENDERS}
                />
                <FormInput
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
                <FormInput
                  id="city"
                  name="city"
                  type="text"
                  label="City"
                  value={form.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                />
                
                <div className="flex items-center gap-3">
                  <input
                    id="available"
                    name="available"
                    type="checkbox"
                    checked={form.available}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-red-600 cursor-pointer"
                  />
                  <label htmlFor="available" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Currently available to donate
                  </label>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3">
                  <Button 
                    type="submit" 
                    variant="primary"
                    loading={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Profile