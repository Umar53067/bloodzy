// EditProfile.jsx
import { useState } from "react"

function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bloodGroup: "",
    gender: "",
    age: "",
    lastDonation: "",
    donorStatus: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Updated Data:", form)
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>O+</option>
            <option>O-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>
          <div className="flex gap-4">
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <input
            type="date"
            name="lastDonation"
            value={form.lastDonation}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="donorStatus"
              checked={form.donorStatus}
              onChange={handleChange}
            />
            Become a Donor
          </label>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProfile
