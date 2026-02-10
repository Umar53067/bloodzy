import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import AlertMessage from "../components/AlertMessage";
import { SPACING, TYPOGRAPHY, CONTACT_INFO } from "../constants";

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      
      // Auto-dismiss success message
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className={`${TYPOGRAPHY.h1} mb-4`}>Contact Us</h1>
          <p className={`${TYPOGRAPHY.body} text-red-100 max-w-2xl mx-auto`}>
            We're here to help you with blood donation queries, volunteering,
            partnerships, or any other support you may need.
          </p>
        </div>
      </section>

      {/* Contact Details + Form */}
      <main className="flex-1 container mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
        {/* Left Side - Contact Info */}
        <div>
          <h2 className={`${TYPOGRAPHY.h2} mb-8`}>Get in Touch</h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Our Office</p>
                <p className="text-gray-600">{CONTACT_INFO.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Phone</p>
                <p className="text-gray-600">
                  <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-red-600">
                    {CONTACT_INFO.phone}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <p className="text-gray-600">
                  <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-red-600">
                    {CONTACT_INFO.email}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Working Hours</p>
                <p className="text-gray-600">{CONTACT_INFO.hours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div>
          <h2 className={`${TYPOGRAPHY.h2} mb-8`}>Send Us a Message</h2>
          
          {errors.submit && (
            <AlertMessage 
              type="error" 
              message={errors.submit}
              onClose={() => setErrors(prev => ({ ...prev, submit: '' }))}
            />
          )}
          
          {success && (
            <AlertMessage 
              type="success" 
              message="Thank you for your message! We'll get back to you soon."
              onClose={() => setSuccess(false)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <FormInput
              id="name"
              name="name"
              type="text"
              label="Your Name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              error={errors.name}
            />

            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              error={errors.email}
              autoComplete="email"
            />

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Message
                <span className="text-red-600 ml-1">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                required
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition resize-none ${
                  errors.message
                    ? 'border-red-500 focus:ring-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-red-500 focus:border-transparent'
                }`}
              />
              {errors.message && (
                <p id="message-error" className="text-red-600 text-sm mt-1">
                  {errors.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              aria-label="Send message"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </main>

      {/* Google Map Section */}
      <section className="w-full h-72 md:h-96">
        <iframe
          title="Bloodzy Office Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13617.956350665777!2d74.3441!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190c8f84b9a4cd%3A0xabcde123456789!2sLahore!5e0!3m2!1sen!2s!4v1693214356789!5m2!1sen!2s"
          className="w-full h-full border-0"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
}

export default Contact;
