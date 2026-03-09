import { Facebook, Twitter, Instagram } from "lucide-react";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="ui-container site-footer-inner">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 - Logo + About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="brand-mark"></div>
              <span className="brand-text">Bloodzy</span>
            </div>
            <p className="footer-copy">
              Connecting blood donors with those in need, saving lives one donation at a time.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Home</a></li>
              <li><a href="#" className="footer-link">Find Donors</a></li>
              <li><a href="#" className="footer-link">Become a Donor</a></li>
              <li><a href="#" className="footer-link">Blood Banks</a></li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Blood Types</a></li>
              <li><a href="#" className="footer-link">Donation Process</a></li>
              <li><a href="#" className="footer-link">FAQs</a></li>
              <li><a href="#" className="footer-link">Blog</a></li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="footer-heading">Contact</h3>
            <ul className="footer-contact space-y-2">
              <li>123 Blood St, City</li>
              <li>info@bloodzy.org</li>
              <li>+1 (555) 123-4567</li>
            </ul>
            <div className="social-list">
              <a href="#" className="social-link" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="social-link" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="social-link" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="site-footer-bottom">
          <p>© {new Date().getFullYear()} Bloodzy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;