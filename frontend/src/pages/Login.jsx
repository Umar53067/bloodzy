import { useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
// import { login } from '../features/auth/authSlice.js';
// import {useDispatch} from 'react-redux'

function Login() {
  //const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //const dispatch = useDispatch()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:3000/api/users/login', formData,  { withCredentials: true } ); // change URL as needed
      // Save token to localStorage (or Redux)
      localStorage.setItem('token', data.token);
      dispatch(login(data))
      
      // Optionally save user info
      localStorage.setItem('user', JSON.stringify(data.user));

      setLoading(false);
      navigate('/'); // redirect to home or dashboard
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{' '}
          <a href="/signup" className="text-red-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
