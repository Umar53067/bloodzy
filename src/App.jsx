import React, { Suspense } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useAuthStateSync from './hooks/useAuthStateSync'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'

// Lazy loaded pages to reduce initial bundle size
const Homepage = React.lazy(() => import('./pages/Homepage.jsx'));
const Login = React.lazy(() => import('./pages/Login.jsx'));
const Signup = React.lazy(() => import('./pages/Signup.jsx'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword.jsx'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword.jsx'));
const About = React.lazy(() => import('./pages/About.jsx'));
const Contact = React.lazy(() => import('./pages/Contact.jsx'));
const Profile = React.lazy(() => import('./pages/Profile.jsx'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard.jsx'));
const Donate = React.lazy(() => import('./pages/Donate.jsx'));
const RequestBlood = React.lazy(() => import('./pages/RequestBlood.jsx'));
const Find = React.lazy(() => import('./pages/Find.jsx'));
const Hospitals = React.lazy(() => import('./pages/Hospitals.jsx'));

// Fallback loader for lazy loading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner message="Loading..." size="md" />
  </div>
);

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background)' }}>
        <LoadingSpinner message="Loading..." size="lg" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Header/>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/about' element={<About/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forgot-password' element={<ForgotPassword/>} />
          <Route path='/reset-password' element={<ResetPassword/>} />
          <Route path='/profile' element={<RequireAuth><Profile/></RequireAuth>} />
          <Route path='/admin' element={<RequireAuth><AdminDashboard/></RequireAuth>} />
          <Route path="/donate" element={<RequireAuth><Donate /></RequireAuth>} />
          <Route path="/request" element={<RequestBlood />} />
          <Route path='/find' element={<Find/>} />
          <Route path='/hospitals' element={<Hospitals/>} />
        </Routes>
      </Suspense>
      <Footer/>
    </BrowserRouter>
  );
}

export default App
