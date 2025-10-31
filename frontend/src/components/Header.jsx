import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Directly use Redux store for auth status
  const token = useSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
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
              className="text-sm font-medium text-gray-700 hover:text-red-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-4">
          {!token ? (
            <>
              <Link to="/login" className="border px-3 py-1 rounded text-sm">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="border px-3 py-1 rounded text-sm"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-red-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-3">
          {/* Nav Links */}
          {linksToShow.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block text-sm font-medium text-gray-700 hover:text-red-600"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Auth Buttons */}
          <div className="flex flex-col gap-2 pt-3">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="border px-3 py-1 rounded text-sm text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="border px-3 py-1 rounded text-sm text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm text-center"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
