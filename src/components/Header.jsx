import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { signOut } from "../lib/authService";
import Button from "./Button";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Directly use Redux store for auth status
  const token = useSelector((state) => state.auth.token);

  const handleLogout = async () => {
    try {
      // Sign out from Supabase first
      const { error } = await signOut();
      if (error) {
        console.error("Logout error:", error);
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Clear Redux state
      dispatch(logout());
      setIsOpen(false);
      // Navigate to login page
      navigate("/login");
    }
  };

  // 🌍 Define links for each user type
  const guestLinks = [
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ];

  const userLinks = [
    { to: "/", label: "Home" },
    { to: "/donate", label: "Donate" },
    { to: "/find", label: "Find Donors" },
  ];

  const linksToShow = token ? userLinks : guestLinks;

  return (
    <header className="sticky top-0 bg-white border-b z-30">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-red-600 rounded-full"></div>
          <span className="text-xl font-bold text-red-600">Bloodzy</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {linksToShow.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-gray-700 hover:text-red-600 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-3">
          {!token ? (
            <>
              <Button variant="secondary" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="primary" size="sm">
                <Link to="/signup" className="text-white">Signup</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="sm">
                <Link to="/profile">Profile</Link>
              </Button>
              <Button variant="primary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-red-600 p-2 hover:bg-gray-100 rounded transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${
        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      } fixed top-16 left-0 right-0 bg-white border-t shadow-lg transition-all duration-200 z-40 max-h-[calc(100vh-64px)] overflow-y-auto md:hidden`}>
        {/* Nav Links */}
        <nav className="flex flex-col px-4 py-4 space-y-2">
          {linksToShow.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-base font-medium text-gray-700 hover:text-red-600 py-2 px-3 rounded hover:bg-red-50 transition"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="border-t px-4 py-4 space-y-3">
          {!token ? (
            <>
              <Button variant="secondary" fullWidth size="md">
                <Link to="/login" className="w-full block text-center">Login</Link>
              </Button>
              <Button variant="primary" fullWidth size="md">
                <Link to="/signup" className="w-full block text-center text-white">Sign Up</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" fullWidth size="md">
                <Link to="/profile" className="w-full block text-center">Profile</Link>
              </Button>
              <Button variant="primary" fullWidth size="md" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
