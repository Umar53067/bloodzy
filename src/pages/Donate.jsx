import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import { BLOOD_TYPES, GENDERS } from '../constants';
import { useDonor } from '../hooks/useDonor';
import { CheckCircle, Edit3, Heart, Droplet, ChevronLeft, ChevronRight, LocateFixed, Shield } from 'lucide-react';

function Donate() {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const { createDonor, getDonor } = useDonor();

  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    age: '',
    gender: '',
    phone: '',
    city: '',
    available: true,
  });
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [isAlreadyDonor, setIsAlreadyDonor] = useState(false);
  const [checkingDonorStatus, setCheckingDonorStatus] = useState(true);
  const [existingDonor, setExistingDonor] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const checkDonorStatus = async () => {
      try {
        setCheckingDonorStatus(true);

        if (!user?.id) {
          return;
        }

        const { data, error: donorError } = await getDonor(user.id);

        if (!donorError && data) {
          setIsAlreadyDonor(true);
          setExistingDonor(data);
        }
      } catch (err) {
        console.error('Error checking donor status:', err);
      } finally {
        setCheckingDonorStatus(false);
      }
    };

    checkDonorStatus();
  }, [token, user, getDonor, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateStepOne = () => {
    const newErrors = {};

    if (!formData.bloodGroup) newErrors.bloodGroup = 'Choose your blood group.';
    if (!formData.phone.trim()) newErrors.phone = 'Add a phone number so hospitals can reach you.';
    if (!formData.city.trim()) newErrors.city = 'Add your city.';

    if (formData.phone.trim()) {
      const digits = formData.phone.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 14) {
        newErrors.phone = 'Enter a valid phone number.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Add your name.';
    if (!formData.age) newErrors.age = 'Age is required.';
    else if (Number(formData.age) < 18 || Number(formData.age) > 65) newErrors.age = 'Age must be between 18 and 65.';
    if (!formData.gender) newErrors.gender = 'Select a gender.';
    if (!location.lat || !location.lng) newErrors.location = 'Capture your location before submitting.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Location access is not supported on this device.');
      return;
    }

    setGettingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setSuccess('Location captured. You can finish registration now.');
        setGettingLocation(false);
      },
      () => {
        setGettingLocation(false);
        setError('Please allow location access so people can find you nearby.');
      }
    );
  };

  const handleNextStep = (e) => {
    e.preventDefault();

    if (!validateStepOne()) {
      setError('Please fix the highlighted fields.');
      return;
    }

    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStepTwo()) {
      setError('Please complete the remaining details.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!user?.id) {
        setError('User information not found. Please login again.');
        return;
      }

      const { error: donorError } = await createDonor(user.id, {
        name: formData.name.trim(),
        bloodGroup: formData.bloodGroup,
        age: Number(formData.age),
        gender: formData.gender,
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        available: formData.available,
        location: {
          latitude: location.lat,
          longitude: location.lng,
        },
      });

      if (donorError) {
        throw new Error(donorError);
      }

      setSuccess('You are now registered as a donor. Thank you for helping save lives.');

      setFormData({
        name: '',
        bloodGroup: '',
        age: '',
        gender: '',
        phone: '',
        city: '',
        available: true,
      });
      setLocation({ lat: '', lng: '' });
      setStep(1);

      setTimeout(() => navigate('/profile'), 1600);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7f7_0%,#f6f7fb_38%,#f6f7fb_100%)] px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate('/')}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to home
        </button>

        <div className="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-xl">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <aside
              className="p-6 text-white sm:p-8 lg:p-10"
              style={{ backgroundImage: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)' }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-50">
                <Heart className="h-4 w-4" />
                Donate blood
              </div>

              <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
                Become a donor in two short steps.
              </h1>

              <p className="mt-4 max-w-md text-base leading-7 text-red-100">
                Keep the form calm and easy to finish. We ask for the essentials first, then the rest only when you are ready.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <Droplet className="mt-0.5 h-5 w-5 text-red-100" />
                  <div>
                    <p className="font-semibold">Step 1 is short</p>
                    <p className="text-sm text-red-100">Blood group, phone, and city.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <LocateFixed className="mt-0.5 h-5 w-5 text-red-100" />
                  <div>
                    <p className="font-semibold">Location stays useful</p>
                    <p className="text-sm text-red-100">People nearby can reach you when blood is urgently needed.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <Shield className="mt-0.5 h-5 w-5 text-red-100" />
                  <div>
                    <p className="font-semibold">Clear and private</p>
                    <p className="text-sm text-red-100">Only the information needed to contact you is shared.</p>
                  </div>
                </div>
              </div>
            </aside>

            <section className="p-6 sm:p-8 lg:p-10">
              {checkingDonorStatus ? (
                <div className="flex flex-col items-center justify-center gap-4 text-center" style={{ minHeight: '420px' }}>
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />
                  <p className="text-gray-600">Checking your donor status...</p>
                </div>
              ) : isAlreadyDonor && existingDonor ? (
                <div className="mx-auto max-w-xl">
                  <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 inline-flex rounded-full bg-green-100 p-4">
                      <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900">You are already registered</h2>
                    <p className="mt-2 text-gray-600">Thank you for being part of the donor network.</p>
                  </div>

                  <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5 sm:p-6">
                    <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Blood group</p>
                        <p className="mt-2 text-xl font-black text-red-600">{existingDonor.blood_group || 'N/A'}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">City</p>
                        <p className="mt-2 text-lg font-bold text-gray-900">{existingDonor.city || 'N/A'}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Phone</p>
                        <p className="mt-2 text-lg font-bold text-gray-900">{existingDonor.phone || 'N/A'}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Status</p>
                        <p className={`mt-2 text-lg font-black ${existingDonor.available ? 'text-green-600' : 'text-amber-600'}`}>
                          {existingDonor.available ? 'Available' : 'Unavailable'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Button
                      variant="primary"
                      fullWidth
                      size="lg"
                      onClick={() => navigate('/profile')}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      <Edit3 size={18} />
                      Update profile
                    </Button>
                    <Button
                      variant="secondary"
                      fullWidth
                      size="lg"
                      onClick={() => navigate('/')}
                    >
                      Back to home
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mx-auto max-w-2xl">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Step {step} of 2</p>
                      <h2 className="mt-1 text-2xl font-black text-gray-900">
                        {step === 1 ? 'Share the essentials' : 'Finish your donor profile'}
                      </h2>
                    </div>
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                      {step === 1 ? 'Fast start' : 'Final details'}
                    </span>
                  </div>

                  {error && <AlertMessage type="error" message={error} className="mb-5" />}
                  {success && <AlertMessage type="success" message={success} className="mb-5" />}

                  <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-5" noValidate>
                    {step === 1 ? (
                      <>
                        <FormSelect
                          id="bloodGroup"
                          name="bloodGroup"
                          label="Blood group"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                          options={BLOOD_TYPES}
                          required
                          error={errors.bloodGroup}
                          placeholder="Select your blood group"
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormInput
                            id="phone"
                            name="phone"
                            type="tel"
                            label="Phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="03xx xxxxxxx"
                            required
                            error={errors.phone}
                            autoComplete="tel"
                            inputMode="tel"
                          />

                          <FormInput
                            id="city"
                            name="city"
                            type="text"
                            label="City"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="e.g. Lahore"
                            required
                            error={errors.city}
                            autoComplete="address-level2"
                          />
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Next, we ask for your name, age, and location.</p>
                            <p className="text-sm text-gray-600">This keeps the first screen short.</p>
                          </div>
                          <Button type="submit" className="min-h-12 rounded-2xl bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700">
                            Continue
                            <ChevronRight size={18} />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <FormInput
                          id="name"
                          name="name"
                          type="text"
                          label="Full name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                          error={errors.name}
                          autoComplete="name"
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormInput
                            id="age"
                            name="age"
                            type="number"
                            label="Age"
                            value={formData.age}
                            onChange={handleChange}
                            min="18"
                            max="65"
                            required
                            error={errors.age}
                            autoComplete="off"
                          />

                          <FormSelect
                            id="gender"
                            name="gender"
                            label="Gender"
                            value={formData.gender}
                            onChange={handleChange}
                            options={GENDERS}
                            required
                            error={errors.gender}
                            placeholder="Select gender"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={gettingLocation}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-base font-bold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed"
                        >
                          <MapPin className="h-5 w-5" />
                          {gettingLocation ? 'Capturing location...' : 'Use my current location'}
                        </button>
                        {errors.location && <p className="-mt-2 text-sm font-medium text-red-600">{errors.location}</p>}

                        <div className="rounded-2xl bg-gray-50 p-4">
                          <label className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                            <input
                              type="checkbox"
                              name="available"
                              checked={formData.available}
                              onChange={handleChange}
                              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            I am available to donate when needed
                          </label>
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-red-600"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Back
                          </button>

                          <Button type="submit" loading={loading} className="min-h-12 rounded-2xl bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700">
                            <CheckCircle size={18} />
                            {loading ? 'Saving...' : 'Register as donor'}
                          </Button>
                        </div>
                      </>
                    )}
                  </form>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Donate;