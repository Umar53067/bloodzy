import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { signOut } from "../lib/authService";

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
    { to: "/hospitals", label: "Hospitals" },
  ];

  const linksToShow = token ? userLinks : guestLinks;

  return (
    <header className="site-header">
      <div className="ui-container site-header-inner">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="brand-mark"></div>
          <span className="brand-text">Bloodzy</span>
        </div>

        {/* Desktop Nav */}
        <nav className="site-nav">
          {linksToShow.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="site-nav-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="site-auth">
          {!token ? (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Signup</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="btn btn-secondary btn-sm">Profile</Link>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-toggle icon-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${
        isOpen ? 'mobile-menu-open' : 'mobile-menu-closed'
      } site-mobile-menu`}>
        {/* Nav Links */}
        <nav className="site-mobile-nav">
          {linksToShow.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="site-mobile-link"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="site-mobile-auth">
          {!token ? (
            <>
              <Link to="/login" className="btn btn-secondary btn-md btn-full text-center" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/signup" className="btn btn-primary btn-md btn-full text-center" onClick={() => setIsOpen(false)}>Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="btn btn-secondary btn-md btn-full text-center" onClick={() => setIsOpen(false)}>Profile</Link>
              <button type="button" className="btn btn-primary btn-md btn-full" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
