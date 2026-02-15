import React, { useState } from 'react';
import SearchDonorForm from '../components/SearchDonorForm';
import DonorList from '../components/DonorList';
import DonorCard from '../components/DonorCard';
import AlertMessage from '../components/AlertMessage';
import { useDonor } from '../hooks/useDonor';

function Find() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [radius, setRadius] = useState('5');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [radiusHistory, setRadiusHistory] = useState([]); // Track radius expansion
  const { searchNearbyDonors } = useDonor();

  const validateForm = () => {
    const newErrors = {};
    if (!bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!radius) newErrors.radius = 'Radius is required';
    if (radius && (radius < 1 || radius > 100)) {
      newErrors.radius = 'Radius must be between 1 and 100 km';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Search for donors: retrieves all donors matching blood group and city
   * Shows multiple donors from the same location
   */
  const handleSearch = async () => {
    if (!validateForm()) {
      setMessage('Please fix the errors below');
      return;
    }

    setLoading(true);
    setMessage('Searching for donors...');
    setRadiusHistory([]);
    let foundDonors = [];

    try {
      // Search Supabase for ALL donors with matching blood group and city
      // This will return multiple donors from the same location
      const { data, error } = await searchNearbyDonors(bloodGroup, city, 500);

      if (error) {
        console.error('Error searching donors:', error);
        const errorMsg = error.includes('RLS')
          ? 'Access denied: Check database permissions'
          : error;
        setMessage(`Error searching donors: ${errorMsg}`);
        setDonors([]);
        setLoading(false);
        return;
      }

      console.log('Search results:', { bloodGroup, city, count: data?.length || 0 });

      if (data && data.length > 0) {
        foundDonors = data;
        setMessage(
          `✓ Found ${data.length} donor${data.length !== 1 ? 's' : ''} matching your criteria`
        );
      } else {
        setMessage(
          `No donors found for ${bloodGroup} blood type in ${city}. Try a different city or blood group.`
        );
        setDonors([]);
        setLoading(false);
        return;
      }

      // Transform Supabase data to match DonorCard format
      const transformedDonors = foundDonors.map((donor) => ({
        id: donor.id,
        name: donor.user?.username || 'Anonymous Donor',
        bloodGroup: donor.blood_group,
        age: donor.age,
        gender: donor.gender,
        phone: donor.phone,
        city: donor.city,
        available: donor.available,
        distance: `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 9)} km`, // Simulated distance
        email: donor.user?.email,
      }));

      setDonors(transformedDonors);
      setLoading(false);
    } catch (err) {
      console.error('Search error:', err);
      setMessage(`Error searching donors: ${err.message}`);
      setDonors([]);
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setMessage('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMessage('');
        setLocationLoading(false);
      },
      () => {
        setMessage('Could not get your location. Please allow location access.');
        setLocationLoading(false);
      }
    );
  };

  const handleContact = (donor) => {
    alert(`Contact info for ${donor.name}: ${donor.phone}`);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8"
      role="main"
      aria-label="Find blood donors page"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Blood Donors</h1>
        <p className="text-gray-600 mb-8">
          Search for blood donors near you based on blood group and distance
        </p>

        {message && (
          <AlertMessage
            type={message.startsWith('Could not') ? 'error' : 'info'}
            message={message}
            onClose={() => setMessage('')}
          />
        )}

        <div className="mb-8">
          <SearchDonorForm
            bloodGroup={bloodGroup}
            setBloodGroup={setBloodGroup}
            city={city}
            setCity={setCity}
            radius={radius}
            setRadius={setRadius}
            onSearch={handleSearch}
            onGetLocation={handleGetLocation}
            loading={loading}
            locationLoading={locationLoading}
            errors={errors}
          />
        </div>

        <DonorList
          donors={donors}
          emptyMessage={loading ? 'Searching for donors...' : 'No donors found. Try adjusting your search criteria.'}
        >
          {(donor) => (
            <DonorCard
              donor={donor}
              onContact={handleContact}
            />
          )}
        </DonorList>
      </div>
    </div>
  );
}

export default Find;
