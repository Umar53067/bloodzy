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
        dispatch(login({
          user: {
            id: user.id,
            email: user.email,
            username: user.user_metadata?.username || email.split('@')[0],
          },
          token: session.access_token
        }));

        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4 py-8">
      <Card className="max-w-md w-full">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Login to Your Account</h2>
        <p className="text-gray-600 mb-6">Enter your credentials to access your account</p>

        {error && (
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError('')}
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
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            aria-label="Login to account"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 space-y-3 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-red-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-gray-600">
            Forgot your password?{' '}
            <Link to="/forgot-password" className="text-blue-600 font-semibold hover:underline">
              Reset it
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default Login;