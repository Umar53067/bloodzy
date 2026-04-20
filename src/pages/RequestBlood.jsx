import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useBloodRequest } from '../hooks/useBloodRequest';
import FormInput from '../components/FormInput';
import AlertMessage from '../components/AlertMessage';
import Button from '../components/Button';
import { BLOOD_TYPES } from '../constants';
import { AlertTriangle, ArrowLeft, ChevronDown, ChevronUp, MapPin, Phone, Send, Shield } from 'lucide-react';

function RequestBlood() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { createRequest, loading } = useBloodRequest();

  const [formData, setFormData] = useState({
    bloodGroup: '',
    city: '',
    contactPhone: '',
    patientName: '',
    hospital: '',
    contactEmail: '',
  });
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBloodGroupSelect = (bloodGroup) => {
    setFormData((prev) => ({ ...prev, bloodGroup }));
  };

  const validate = () => {
    if (!formData.bloodGroup) return 'Choose the blood type first.';
    if (!formData.city.trim()) return 'Enter the city so donors know where to go.';
    if (!formData.contactPhone.trim()) return 'Add a phone number so donors can reach you.';

    const digits = formData.contactPhone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 14) {
      return 'Enter a valid phone number with 10 to 14 digits.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setSuccess('');

    try {
      const { error: requestError } = await createRequest(user?.id || null, {
        ...formData,
        city: formData.city.trim(),
        contactPhone: formData.contactPhone.trim(),
        patientName: formData.patientName.trim() || null,
        hospital: formData.hospital.trim() || null,
        contactEmail: formData.contactEmail.trim() || user?.email || null,
        urgency: 'urgent',
        units: 1,
        description: null,
      });

      if (requestError) {
        throw new Error(requestError);
      }

      setSuccess('Your request is live. Nearby donors can now see it and contact you directly.');
      setTimeout(() => navigate('/find'), 2200);
    } catch (err) {
      setError(err.message || 'We could not send the request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7f7_0%,#f6f7fb_38%,#f6f7fb_100%)] py-6 px-4 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate('/')}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        <div className="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-xl">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <aside
              className="p-6 text-white sm:p-8 lg:p-10"
              style={{ backgroundImage: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)' }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-50">
                <AlertTriangle className="h-4 w-4" />
                Emergency request
              </div>

              <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
                Request blood in under a minute.
              </h1>

              <p className="mt-4 max-w-md text-base leading-7 text-red-100">
                Keep it simple. Choose the blood type, share your city and phone, and we broadcast it to nearby donors immediately.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <Shield className="mt-0.5 h-5 w-5 text-red-100" />
                  <div>
                    <p className="font-semibold">Fast and private</p>
                    <p className="text-sm text-red-100">Only the details needed to contact you are shared.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <Phone className="mt-0.5 h-5 w-5 text-red-100" />
                  <div>
                    <p className="font-semibold">Direct call first</p>
                    <p className="text-sm text-red-100">Donors can call you without extra steps or chat delays.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <MapPin className="mt-0.5 h-5 w-5 text-red-100" />
                  <div>
                    <p className="font-semibold">Location-aware</p>
                    <p className="text-sm text-red-100">City helps donors understand where help is needed immediately.</p>
                  </div>
                </div>
              </div>
            </aside>

            <section className="p-6 sm:p-8 lg:p-10">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Step 1</p>
                  <h2 className="mt-1 text-2xl font-black text-gray-900">Share the minimum needed</h2>
                </div>
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                  Urgent mode
                </span>
              </div>

              {error && <AlertMessage type="error" message={error} className="mb-5" />}
              {success && <AlertMessage type="success" message={success} className="mb-5" />}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-800">
                    Blood group needed
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {BLOOD_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleBloodGroupSelect(type.value)}
                        className={`min-h-14 rounded-2xl border px-3 py-4 text-lg font-black transition focus:outline-none focus:ring-4 focus:ring-red-200 ${
                          formData.bloodGroup === type.value
                            ? 'border-red-600 bg-red-600 text-white shadow-lg'
                            : 'border-gray-200 bg-white text-gray-800 hover:border-red-300 hover:bg-red-50'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput
                    name="city"
                    label="City"
                    placeholder="e.g. Karachi"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    autoComplete="address-level2"
                  />

                  <FormInput
                    name="contactPhone"
                    type="tel"
                    label="Phone number"
                    placeholder="03xx xxxxxxx"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                  <button
                    type="button"
                    onClick={() => setShowDetails((value) => !value)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Add more details</p>
                      <p className="text-sm text-gray-600">Optional, but helpful for donors and hospitals.</p>
                    </div>
                    {showDetails ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                  </button>

                  {showDetails && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <FormInput
                        name="patientName"
                        label="Patient name"
                        placeholder="Who needs the blood?"
                        value={formData.patientName}
                        onChange={handleChange}
                        autoComplete="name"
                      />
                      <FormInput
                        name="hospital"
                        label="Hospital / clinic"
                        placeholder="Where should donors go?"
                        value={formData.hospital}
                        onChange={handleChange}
                        autoComplete="organization"
                      />
                      <FormInput
                        name="contactEmail"
                        type="email"
                        label="Email for updates"
                        placeholder="Optional"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        autoComplete="email"
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  className="min-h-14 rounded-2xl bg-red-600 px-6 py-4 text-lg font-black text-white shadow-xl hover:bg-red-700 hover:shadow-2xl"
                >
                  <Send className="h-5 w-5" />
                  {loading ? 'Sending request...' : 'Broadcast request now'}
                </Button>

                <p className="text-center text-sm leading-6 text-gray-500">
                  Donors will see the blood type, your city, and the number to call. If you do not know the hospital yet, that is okay.
                </p>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestBlood;