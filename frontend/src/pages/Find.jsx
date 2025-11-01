import { useState } from 'react'
import axios from 'axios'

function Find() {
  const [bloodGroup, setBloodGroup] = useState('')
  const [radiusKm, setRadiusKm] = useState(5)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = () => {
    if (!navigator.geolocation) {
      setMessage('❌ Geolocation is not supported by your browser')
      return
    }
    setLoading(true)
    setMessage('Fetching your location...')

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const maxDistance = radiusKm * 1000
        const params = { lat, lng, maxDistance }
        if (bloodGroup) params.bloodGroup = bloodGroup
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/donors/nearby`, { params })
        setResults(data.donors || [])
        setMessage(data.donors?.length ? '' : 'No donors found in this radius')
      } catch (err) {
        setMessage(err.response?.data?.message || 'Search failed')
      } finally {
        setLoading(false)
      }
    }, () => {
      setLoading(false)
      setMessage('❌ Unable to fetch location. Please allow location access.')
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Find Donors Near You</h2>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="">Any</option>
              {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Radius (km)</label>
            <select value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} className="w-full border rounded px-3 py-2">
              {[5,10,15,20,30,40,50].map(km => (
                <option key={km} value={km}>{km} km</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button onClick={handleSearch} disabled={loading} className={`w-full bg-red-600 text-white px-4 py-2 rounded ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded text-center ${message.startsWith('❌') ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {message}
          </div>
        )}

        <div className="divide-y">
          {results.map((d) => (
            <div key={d._id} className="py-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800">{d.user?.username || 'Donor'}</div>
                <div className="text-sm text-gray-600">{d.bloodGroup} • {d.city} • {d.user?.email}</div>
                <div className="text-sm text-gray-600">Phone: {d.phone}</div>
              </div>
              <div className="text-xs px-2 py-1 border rounded">{d.available ? 'Available' : 'Unavailable'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Find


