// Header.jsx
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react" // hamburger & close icon

function Header() {
  const [token, setToken] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    setToken(savedToken)
  }, [])

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
          <Link to="/" className="text-sm font-medium text-black hover:text-red-600">
            Home
          </Link>
          <Link to="/donate" className="text-sm font-medium text-gray-600 hover:text-red-600">
            Donate
          </Link>
          <Link to="/find" className="text-sm font-medium text-gray-600 hover:text-red-600">
            Find Donors
          </Link>
          <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-red-600">
            About Us
          </Link>
          <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-red-600">
            Contact
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-4">
          {!token ? (
            <>
              <Link to="/login" className="border px-3 py-1 rounded text-sm">
                Login
              </Link>
              <Link to="/signup" className="bg-red-600 text-white px-3 py-1 rounded text-sm">
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="border px-3 py-1 rounded text-sm">
                Profile
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token")
                  setToken(null)
                }}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
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
          <Link
            to="/"
            className="block text-sm font-medium text-black hover:text-red-600"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/donate"
            className="block text-sm font-medium text-gray-600 hover:text-red-600"
            onClick={() => setIsOpen(false)}
          >
            Donate
          </Link>
          <Link
            to="/find"
            className="block text-sm font-medium text-gray-600 hover:text-red-600"
            onClick={() => setIsOpen(false)}
          >
            Find Donors
          </Link>
          <Link
            to="/about"
            className="block text-sm font-medium text-gray-600 hover:text-red-600"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="block text-sm font-medium text-gray-600 hover:text-red-600"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          {/* Mobile Auth Buttons */}
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
                    localStorage.removeItem("token")
                    setToken(null)
                    setIsOpen(false)
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
  )
}

export default Header
