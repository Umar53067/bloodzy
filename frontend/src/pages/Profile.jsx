// Profile.jsx
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

function Profile() {
  const { token, user: authUser } = useSelector((s) => s.auth)
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
      if (!token) return
      setLoading(true)
      setError("")
      try {
        const [meRes, donorRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_URL}/api/me`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_SERVER_URL}/api/donors/me`, { headers: { Authorization: `Bearer ${token}` } }).catch((e)=>e.response)
        ])
        if (!mounted) return
        setMe(meRes.data)
        setProfileForm({ username: meRes.data.username || "", email: meRes.data.email || "" })
        if (donorRes && donorRes.status === 200) {
          const d = donorRes.data.donor
          setDonor(d)
          setForm({
            bloodGroup: d.bloodGroup || "",
            age: d.age || "",
            gender: d.gender || "",
            phone: d.phone || "",
            city: d.city || "",
            available: d.available ?? true,
          })
        } else {
          setDonor(null)
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [token])

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
      // if new geo captured, include it
      const payload = newLocation ? { ...form, location: newLocation } : form
      const { data } = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/donors/me`, payload, { headers: { Authorization: `Bearer ${token}` } })
      setDonor(data.donor)
      setSuccess("Profile updated")
    } catch (err) {
      setError(err.response?.data?.message || "Update failed")
    } finally {
      setSaving(false)
    }
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    try {
      const { data } = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/me`, profileForm, { headers: { Authorization: `Bearer ${token}` } })
      setMe(data)
      setSuccess("Account details updated")
    } catch (err) {
      setError(err.response?.data?.message || "Update failed")
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
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex items-center gap-4">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=dc2626&color=fff`}
            alt="profile"
            className="w-20 h-20 rounded-full border-4 border-red-600"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
            <p className="text-gray-600">{email}</p>
            <p className="text-sm text-gray-500">Joined: {joined}</p>
            <p className="text-sm text-red-600 font-semibold">
              {donor ? "Active Donor" : "Not a Donor"}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded bg-red-100 text-red-700 text-sm">{error}</div>
        )}
        {success && (
          <div className="mt-4 p-3 rounded bg-green-100 text-green-700 text-sm">{success}</div>
        )}

        {/* Basic Profile Edit */}
        <form onSubmit={handleProfileSave} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Name</label>
            <input name="username" value={profileForm.username} onChange={handleProfileChange} className="w-full border rounded px-3 py-2"/>
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email</label>
            <input name="email" type="email" value={profileForm.email} onChange={handleProfileChange} className="w-full border rounded px-3 py-2"/>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="bg-gray-800 text-white px-5 py-2 rounded hover:bg-gray-900">Save Account</button>
          </div>
        </form>

        {!donor ? (
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700 italic mb-4">
              "Your blood can save a life today. Be the reason someone smiles again."
            </p>
            <Link to="/donate" className="inline-block bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700">
              Register as Donor
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Blood Group</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="w-full border rounded px-3 py-2">
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Age</label>
              <input name="age" type="number" min="18" max="65" value={form.age} onChange={handleChange} className="w-full border rounded px-3 py-2"/>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2"/>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">City</label>
              <input name="city" value={form.city} onChange={handleChange} className="w-full border rounded px-3 py-2"/>
            </div>
            <div className="flex items-center gap-2">
              <input id="available" name="available" type="checkbox" checked={!!form.available} onChange={handleChange} className="h-4 w-4 text-red-600 border-gray-300 rounded"/>
              <label htmlFor="available" className="text-gray-700">Currently available to donate</label>
            </div>

            <div className="md:col-span-2 flex items-center justify-between mt-2">
              <button type="button" onClick={captureLocation} className="px-4 py-2 border rounded">Use Current Location</button>
              <button disabled={saving} className={`bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Profile
