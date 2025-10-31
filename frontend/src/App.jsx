import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
import Admin from './pages/Admin.jsx'
import Donate from './pages/Donate.jsx'
import { useSelector } from 'react-redux'
import Find from './pages/Find.jsx'

function RequireAuth({ children }) {
  const token = useSelector((state) => state.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
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
        <Route path='/admin' element={<RequireAuth><Admin/></RequireAuth>} />
        <Route path="/donate" element={<RequireAuth><Donate /></RequireAuth>} />
        <Route path='/find' element={<RequireAuth><Find/></RequireAuth>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
