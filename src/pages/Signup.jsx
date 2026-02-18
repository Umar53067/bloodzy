import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import Card from '../components/Card';
import { signUp, getCurrentUser } from '../lib/authService';

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await getCurrentUser();
      if (user) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please fix the errors below');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Sign up with Supabase
      const { user, error: authError } = await signUp(email, password, {
        username,
      });

      if (authError) {
        setError(authError);
        setLoading(false);
        return;
      }

      if (user) {
        // Dispatch login action
        dispatch(
          login({
            user: {
              id: user.id,
              email: user.email,
              username: username,
            },
            token: user.id, // Use user ID as temporary token until session is established
          })
        );

        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        // Show success and redirect
        setError(''); // Clear any errors
        setTimeout(() => navigate('/'), 500);
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800 px-4 py-8 relative overflow-hidden">
      {/* Abstract background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 max-w-6xl w-full bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Hero section */}
          <div className="lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-red-700 to-red-900 text-white flex flex-col justify-between">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Give the gift of life</h1>
              <p className="text-xl text-red-100 mb-6">
                Join our community of heroes and help save lives through blood donation.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-2 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Quick & easy registration
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-2 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Get notified for urgent needs
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-2 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Track your donation history
                </li>
              </ul>
            </div>
            <div className="mt-8 lg:mt-0">
              <p className="text-sm text-red-200">
                Already a donor?{' '}
                <Link to="/login" className="font-semibold text-white underline hover:text-red-100 transition">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="lg:w-1/2 p-8 lg:p-12 bg-white">
            <Card className="max-w-md mx-auto w-full bg-transparent shadow-none p-0">
              <h2 className="text-3xl font-bold mb-2 text-gray-900">Create your account</h2>
              <p className="text-gray-600 mb-6">Join us to donate and save lives</p>

              {error && (
                <AlertMessage
                  type="error"
                  message={error}
                  onClose={() => setError('')}
                  className="mb-6"
                />
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <FormInput
                  id="username"
                  name="username"
                  type="text"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                  error={errors.username}
                  autoComplete="username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />

                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  error={errors.email}
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />

                <FormInput
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  error={errors.password}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />

                <FormInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  aria-label="Create account"
                  className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200 transform hover:-translate-y-0.5"
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>

              <p className="mt-6 text-center text-gray-600 text-sm">
                By signing up, you agree to our{' '}
                <a href="/terms" className="text-red-600 hover:underline">
                  Terms
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-red-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;