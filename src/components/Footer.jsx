import { Facebook, Twitter, Instagram } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 - Logo + About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-red-600"></div>
              <span className="text-xl font-bold text-red-600">Bloodzy</span>
            </div>
            <p className="text-sm text-gray-500">
              Connecting blood donors with those in need, saving lives one donation at a time.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-500 hover:text-gray-900">Home</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900">Find Donors</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900">Become a Donor</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900">Blood Banks</a></li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-500 hover:text-gray-900">Blood Types</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900">Donation Process</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900">FAQs</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900">Blog</a></li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>123 Blood St, City</li>
              <li>info@bloodzy.org</li>
              <li>+1 (555) 123-4567</li>
            </ul>
            <div className="mt-4 flex gap-4 text-gray-500">
              <a href="#"><Facebook className="h-5 w-5 hover:text-gray-900" /></a>
              <a href="#"><Twitter className="h-5 w-5 hover:text-gray-900" /></a>
              <a href="#"><Instagram className="h-5 w-5 hover:text-gray-900" /></a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 border-t pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Bloodzy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;