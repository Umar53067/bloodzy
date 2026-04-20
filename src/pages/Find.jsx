import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Search, Shield, Droplets, Heart, Clock, Users, AlertTriangle } from 'lucide-react';
import { useDonor } from '../hooks/useDonor';
import SkeletonCard from '../components/SkeletonCard';
import AlertMessage from '../components/AlertMessage';
import Button from '../components/Button';
import { BLOOD_TYPES } from '../constants';

function Find() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [radiusKm, setRadiusKm] = useState(5);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [seekerLocation, setSeekerLocation] = useState(null);
  const [geoLoading, setGeoLoading] = useState(true);
  const { searchNearbyDonors } = useDonor();

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371;
    const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  };

  const extractCoordinates = (location) => {
    if (!location) return null;

    if (typeof location === 'string') {
      try {
        location = JSON.parse(location);
      } catch {
        return null;
      }
    }

    if (location.type === 'Point' && Array.isArray(location.coordinates)) {
      const [lng, lat] = location.coordinates;
      if (Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
        return { lat: Number(lat), lng: Number(lng) };
      }
    }

    if (Array.isArray(location.coordinates)) {
      const [lng, lat] = location.coordinates;
      if (Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
        return { lat: Number(lat), lng: Number(lng) };
      }
    }

    if (location.lat !== undefined && location.lng !== undefined) {
      const lat = Number(location.lat);
      const lng = Number(location.lng);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng };
      }
    }

    if (location.latitude !== undefined && location.longitude !== undefined) {
      const lat = Number(location.latitude);
      const lng = Number(location.longitude);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng };
      }
    }

    return null;
  };

  useEffect(() => {
    setGeoLoading(true);

    if (!navigator.geolocation) {
      setMessage('Location access is not available. You can still search by city.');
      setGeoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSeekerLocation({ lat: latitude, lng: longitude });
        setGeoLoading(false);
      },
      () => {
        setMessage('Location access was skipped. Search by city to continue.');
        setGeoLoading(false);
      }
    );
  }, []);

  const handleSearch = async () => {
    if (!bloodGroup && !city.trim()) {
      setMessage('Choose a blood group or enter a city to start the search.');
      setDonors([]);
      return;
    }

    setLoading(true);
    setMessage('Scanning nearby donors...');

    try {
      const { data, error } = await searchNearbyDonors(
        bloodGroup || null,
        city.trim() || null,
        radiusKm,
        seekerLocation?.lat || null,
        seekerLocation?.lng || null,
        50
      );

      if (error) {
        throw new Error(error);
      }

      const transformed = (data || []).map((donor) => {
        let distanceKm = donor.distance_km;
        const coords = extractCoordinates(donor.location);

        if (distanceKm === undefined && seekerLocation && coords) {
          distanceKm = calculateDistance(seekerLocation.lat, seekerLocation.lng, coords.lat, coords.lng);
        }

        return {
          id: donor.id,
          name: donor.name || donor.user?.username || 'Donor',
          bloodGroup: donor.bloodGroup || donor.blood_group,
          phone: donor.phone,
          city: donor.city,
          age: donor.age,
          available: donor.available,
          location: coords ? { coordinates: [coords.lng, coords.lat] } : null,
          distanceKm,
        };
      });

      const filtered = seekerLocation
        ? transformed.filter((donor) => donor.distanceKm === undefined || donor.distanceKm === null || donor.distanceKm <= radiusKm)
        : transformed;

      setDonors(filtered);

      if (filtered.length === 0) {
        setMessage('No close matches found. Try a wider radius or broadcast a request.');
      } else {
        setMessage(`Found ${filtered.length} donor${filtered.length === 1 ? '' : 's'} ready to review.`);
      }
    } catch (err) {
      setDonors([]);
      setMessage(err.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7f7_0%,#f6f7fb_24%,#f6f7fb_100%)]">
      <section className="border-b border-red-100 bg-linear-to-br from-red-700 via-red-700 to-red-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-50">
              <Heart className="h-4 w-4" />
              Find help fast
            </div>
            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Find a donor without wasting time.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-red-100 sm:text-lg">
              Search by blood type, city, or both. We keep the screen simple so a stressed user can act quickly.
            </p>
          </div>

          <div className="mt-8 rounded-3xl bg-white p-4 text-gray-900 shadow-2xl sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_0.75fr_0.8fr]">
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">Blood group</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => setBloodGroup('')}
                    className={`rounded-2xl border px-3 py-3 text-sm font-bold ${bloodGroup === '' ? 'border-red-600 bg-red-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-red-300'}`}
                  >
                    Any
                  </button>
                  {BLOOD_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setBloodGroup(type.value)}
                      className={`rounded-2xl border px-3 py-3 text-sm font-bold ${bloodGroup === type.value ? 'border-red-600 bg-red-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-red-300'}`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">City</p>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Karachi"
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-4 text-sm font-medium text-gray-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">Radius</p>
                <select
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
                >
                  {[5, 10, 15, 20, 30, 40, 50].map((km) => (
                    <option key={km} value={km}>{km} km</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={loading || geoLoading}
                  fullWidth
                  className="min-h-12 rounded-2xl bg-red-600 px-5 py-3 text-base font-black text-white shadow-xl hover:bg-red-700"
                >
                  <Search className="h-5 w-5" />
                  {loading ? 'Searching...' : geoLoading ? 'Locating...' : 'Search now'}
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 font-medium">
                <Shield className="h-4 w-4 text-red-600" />
                Phone-first contact
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 font-medium">
                <Clock className="h-4 w-4 text-red-600" />
                Emergency results first
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 font-medium">
                <Droplets className="h-4 w-4 text-red-600" />
                Search by exact blood type
              </span>
            </div>

            {message && (
              <AlertMessage
                type={message.toLowerCase().includes('found') ? 'success' : message.toLowerCase().includes('failed') ? 'error' : 'info'}
                message={message}
                className="mt-4 mb-0"
              />
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Results</p>
            <h2 className="mt-1 text-2xl font-black text-gray-900">Call the closest matching donors</h2>
          </div>

          <Link to="/request" className="hidden rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white shadow-lg hover:bg-red-700 sm:inline-flex">
            Broadcast request
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <SkeletonCard key={item} />
            ))}
          </div>
        ) : donors.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-red-200 bg-white p-6 text-center shadow-sm sm:p-10">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-2xl font-black text-gray-900">No donors listed yet</h3>
            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              Try widening the radius, changing the city, or broadcasting an urgent request so more people can help.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/request" className="rounded-2xl bg-red-600 px-5 py-4 text-base font-black text-white shadow-xl hover:bg-red-700">
                Broadcast urgent request
              </Link>
              <button
                type="button"
                onClick={() => setRadiusKm((value) => Math.min(50, value + 10))}
                className="rounded-2xl border border-red-200 bg-white px-5 py-4 text-base font-bold text-red-700 hover:bg-red-50"
              >
                Expand radius
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {donors.map((donor) => (
              <article key={donor.id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-black text-gray-900">{donor.name || 'Donor'}</h3>
                      <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-black text-red-700">
                        {donor.bloodGroup}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${donor.available ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                        {donor.available ? 'Available now' : 'May be unavailable'}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-red-500" />
                        {donor.city || 'City not shared'}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-red-500" />
                        {donor.age ? `${donor.age} years` : 'Age shared on profile'}
                      </span>
                      {typeof donor.distanceKm === 'number' && (
                        <span className="inline-flex items-center gap-1.5">
                          <Heart className="h-4 w-4 text-red-500" />
                          {donor.distanceKm.toFixed(1)} km away
                        </span>
                      )}
                    </div>
                  </div>

                  {donor.phone && (
                    <a
                      href={`tel:${donor.phone}`}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-base font-black text-white shadow-lg hover:bg-green-700"
                    >
                      <Phone className="h-5 w-5" />
                      Call now
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Find;