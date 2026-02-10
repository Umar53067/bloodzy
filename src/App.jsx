import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useAuthStateSync from './hooks/useAuthStateSync'
import Homepage from './pages/Homepage.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Profile from './pages/Profile.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Donate from './pages/Donate.jsx'
import Find from './pages/Find.jsx'
import Hospitals from './pages/Hospitals.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'

function RequireAuth({ children }) {
  const token = useSelector((state) => state.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  // Sync Supabase auth state with Redux
  const { loading } = useAuthStateSync();

  // Show loading spinner while auth state is being synced
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Loading..." size="lg" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<RequireAuth><Homepage/></RequireAuth>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/reset-password/:token' element={<ResetPassword/>} />
        <Route path='/profile' element={<RequireAuth><Profile/></RequireAuth>} />
        <Route path='/admin' element={<RequireAuth><AdminDashboard/></RequireAuth>} />
        <Route path="/donate" element={<RequireAuth><Donate /></RequireAuth>} />
        <Route path='/find' element={<RequireAuth><Find/></RequireAuth>} />
        <Route path='/hospitals' element={<RequireAuth><Hospitals/></RequireAuth>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App
