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
  const userLinks = [
    { to: "/", label: "Home" },
    { to: "/request", label: "Request Blood" },
    { to: "/find", label: "Find Donors" },
    { to: "/donate", label: "Donate" },
    { to: "/hospitals", label: "Hospitals" },
  ];

  const guestLinks = [
    { to: "/request", label: "Request Blood" },
    { to: "/find", label: "Find Donors" },
    { to: "/about", label: "About" },
  ];

  const linksToShow = token ? userLinks : guestLinks;

  return (
    <header className="site-header">
      <div className="ui-container site-header-inner">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="brand-mark"></div>
          <div>
            <span className="brand-text">Bloodzy</span>
            <p className="brand-subtext">Fast blood help for Pakistan</p>
          </div>
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
          <Link to="/request" className="btn btn-danger btn-sm emergency-nav-btn">Need Blood</Link>
          <Link to="/find" className="btn btn-secondary btn-sm">Find Donors</Link>
          {!token ? (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Join</Link>
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
        <div className="site-mobile-emergency">
          <Link to="/request" className="btn btn-danger btn-md btn-full text-center" onClick={() => setIsOpen(false)}>
            Need Blood Now
          </Link>
          <Link to="/find" className="btn btn-secondary btn-md btn-full text-center" onClick={() => setIsOpen(false)}>
            Find Donors Near Me
          </Link>
        </div>

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
              <Link to="/signup" className="btn btn-primary btn-md btn-full text-center" onClick={() => setIsOpen(false)}>Join</Link>
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
