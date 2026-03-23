import { Facebook, Twitter, Instagram } from "lucide-react";

function Footer() {
  return (
    <footer className="site-footer bg-gray-900 text-gray-300">
      <div className="ui-container max-w-7xl mx-auto px-4 py-10">
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left pt-7">
          
          {/* Column 1 */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 mb-4 ">
              <div className="brand-mark"></div>
              <span className="brand-text text-white font-semibold text-lg ">
                Bloodzy
              </span>
            </div>
            <p className="footer-copy text-sm leading-relaxed max-w-xs">
              Connecting blood donors with those in need, saving lives one donation at a time.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="footer-heading text-white font-semibold mb-3">
              Quick Links
            </h3>
            <ul className="footer-list space-y-2">
              <li><a href="#" className="footer-link hover:text-white">Home</a></li>
              <li><a href="#" className="footer-link hover:text-white">Find Donors</a></li>
              <li><a href="#" className="footer-link hover:text-white">Become a Donor</a></li>
              <li><a href="#" className="footer-link hover:text-white">Blood Banks</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="footer-heading text-white font-semibold mb-3">
              Resources
            </h3>
            <ul className="footer-list space-y-2">
              <li><a href="#" className="footer-link hover:text-white">Blood Types</a></li>
              <li><a href="#" className="footer-link hover:text-white">Donation Process</a></li>
              <li><a href="#" className="footer-link hover:text-white">FAQs</a></li>
              <li><a href="#" className="footer-link hover:text-white">Blog</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="footer-heading text-white font-semibold mb-3">
              Contact
            </h3>
            <ul className="footer-contact space-y-2 text-sm">
              <li>123 Blood St, City</li>
              <li>info@bloodzy.org</li>
              <li>+1 (555) 123-4567</li>
            </ul>

            {/* Social Icons */}
            <div className="social-list flex gap-4 mt-4">
              <a href="#" className="social-link hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="social-link hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="social-link hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="site-footer-bottom mt-10 border-t border-gray-700 pt-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Bloodzy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;