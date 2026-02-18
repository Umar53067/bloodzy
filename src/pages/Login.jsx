import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../features/auth/authSlice.js';
import { useDispatch } from 'react-redux';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import Card from '../components/Card';
import { signIn, getCurrentUser } from '../lib/authService';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) newErrors.password = 'Password is required';
    if (password && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // Sign in with Supabase
      const { user, session, error: authError } = await signIn(email, password);

      if (authError) {
        setError(authError);
        setLoading(false);
        return;
      }

      if (user && session) {
        // Dispatch login action
        dispatch(
          login({
            user: {
              id: user.id,
              email: user.email,
              username: user.user_metadata?.username || email.split('@')[0],
            },
            token: session.access_token,
          })
        );

        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
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
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Welcome back, hero</h1>
              <p className="text-xl text-red-100 mb-6">
                Access your donor dashboard and continue saving lives.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-red-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View your donation history
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-red-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Schedule your next donation
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-red-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Receive urgent need alerts
                </li>
              </ul>
            </div>
            <div className="mt-8 lg:mt-0">
              <p className="text-sm text-red-200">
                New to our community?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-white underline hover:text-red-100 transition"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="lg:w-1/2 p-8 lg:p-12 bg-white">
            <Card className="max-w-md mx-auto w-full bg-transparent shadow-none p-0">
              <h2 className="text-3xl font-bold mb-2 text-gray-900">Login to your account</h2>
              <p className="text-gray-600 mb-6">Enter your credentials to access your dashboard</p>

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
                  placeholder="Enter your password"
                  required
                  error={errors.password}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />

                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-red-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  aria-label="Login to account"
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200 transform hover:-translate-y-0.5"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>

              <p className="mt-6 text-center text-gray-600 text-sm">
                By logging in, you agree to our{' '}
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

export default Login;