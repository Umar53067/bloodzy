import { Mail, Phone, MapPin, Clock } from "lucide-react";

function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-red-600 text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          We’re here to help you with blood donation queries, volunteering,
          partnerships, or any other support you may need.
        </p>
      </section>

      {/* Contact Details + Form */}
      <main className="flex-1 container mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
        {/* Left Side - Contact Info */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Get in Touch
          </h2>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <p className="font-semibold">Our Office</p>
                <p className="text-gray-600">
                  Lahore, Pakistan
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-gray-600">+92 (300) 123-4567</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-600">support@bloodzy.org</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <p className="font-semibold">Working Hours</p>
                <p className="text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Side - Contact Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Send Us a Message
          </h2>
          <form className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-1"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                rows="5"
                placeholder="Write your message..."
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </main>

      {/* Google Map Section */}
      <section className="w-full h-72">
        <iframe
          title="BloodConnect Office Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13617.956350665777!2d74.3441!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190c8f84b9a4cd%3A0xabcde123456789!2sLahore!5e0!3m2!1sen!2s!4v1693214356789!5m2!1sen!2s"
          className="w-full h-full border-0"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
}

export default Contact;
