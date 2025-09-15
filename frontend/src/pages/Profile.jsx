// Profile.jsx
import { useState } from "react"
import { Link } from "react-router-dom"

function Profile() {
  const [user] = useState({
    name: "Umar Farooq",
    email: "umar@example.com",
    phone: "+92 300 1234567",
    location: "Lahore, Pakistan",
    bloodGroup: "B+",
    gender: "Male",
    age: 22,
    lastDonation: "2024-11-10",
    donations: 3,
    donorStatus: true,
  })

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      {/* Card */}
      <div className="bg-white shadow rounded-xl p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <img
            src={`https://ui-avatars.com/api/?name=${user.name}&background=dc2626&color=fff`}
            alt="profile"
            className="w-20 h-20 rounded-full border-4 border-red-600"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-red-600 font-semibold">
              {user.donorStatus ? "Active Donor" : "Not a Donor"}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-700">Phone:</p>
            <p className="text-gray-600">{user.phone}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Location:</p>
            <p className="text-gray-600">{user.location}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Blood Group:</p>
            <p className="text-red-600 font-bold">{user.bloodGroup}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Gender:</p>
            <p className="text-gray-600">{user.gender}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Age:</p>
            <p className="text-gray-600">{user.age} years</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Last Donation:</p>
            <p className="text-gray-600">{user.lastDonation}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Total Donations:</p>
            <p className="text-gray-600">{user.donations}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          <Link
            to="/edit-profile"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Profile
