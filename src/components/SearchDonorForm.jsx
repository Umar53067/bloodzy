import React from 'react';
import { BLOOD_TYPES } from '../constants';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import Button from './Button';

/**
 * SearchDonorForm component
 * Reusable form for searching donors by blood group, city, and radius
 * Used in both Homepage and Find pages
 */
function SearchDonorForm({
  bloodGroup,
  setBloodGroup,
  city,
  setCity,
  radius,
  setRadius,
  onSearch,
  onGetLocation,
  loading = false,
  locationLoading = false,
  errors = {},
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (bloodGroup && radius) {
      onSearch();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6"
      aria-label="Search donors form"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-900">Find Blood Donors</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <FormSelect
          id="bloodGroup"
          name="bloodGroup"
          label="Blood Group"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          options={BLOOD_TYPES}
          required
          error={errors.bloodGroup}
          placeholder="Select blood group"
        />

        <FormInput
          id="city"
          name="city"
          type="text"
          label="City"
          value={city || ''}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          required
          error={errors.city}
        />

        <FormInput
          id="radius"
          name="radius"
          type="number"
          label="Radius (km)"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          placeholder="Search radius"
          min="1"
          max="100"
          required
          error={errors.radius}
        />

        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onGetLocation}
            loading={locationLoading}
            aria-label="Get current location"
          >
            📍 My Location
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        aria-label="Search for donors"
      >
        {loading ? 'Searching...' : 'Search Donors'}
      </Button>
    </form>
  );
}

export default SearchDonorForm;
