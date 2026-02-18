import { Link } from "react-router-dom";
import Button from "../components/Button";
import { Droplet, Heart, Users, Clock, Shield, Activity, ChevronRight } from "lucide-react";

function Homepage() {
  // Stats data
  const stats = [
    { icon: Users, label: "Registered Donors", value: "5,200+" },
    { icon: Droplet, label: "Donations Made", value: "12,800+" },
    { icon: Heart, label: "Lives Saved", value: "38,400+" },
  ];

  // Reasons data
  const reasons = [
    {
      icon: Clock,
      title: "Takes Only an Hour",
      description: "The entire donation process takes about an hour of your time, from check-in to refreshments."
    },
    {
      icon: Shield,
      title: "Safe & Regulated",
      description: "All procedures follow strict medical guidelines. Sterile equipment is used once and discarded."
    },
    {
      icon: Activity,
      title: "Health Check Included",
      description: "Get a mini health check-up before every donation—blood pressure, hemoglobin, and pulse."
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "I was nervous at first, but the staff made me feel comfortable. Knowing I helped save a child's life is indescribable.",
      name: "Priya K.",
      role: "Regular Donor"
    },
    {
      quote: "My father needed blood during surgery. Strangers donated—now I donate regularly to pay it forward.",
      name: "Rahul M.",
      role: "Donor since 2022"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2083&q=80" 
            alt="Medical professional preparing blood donation equipment in a clean, modern clinic" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 to-red-700/80"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          {/* Awareness Badge (static, non‑deceptive) */}
          <div 
            className="inline-flex items-center bg-red-500/30 backdrop-blur-sm px-4 py-2 rounded-full border border-red-400/50 mb-8"
            style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
          >
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-medium">Every donation matters – find a center near you</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Your <span className="text-red-300">Blood</span> Can Save a Life Today
          </h1>
          
          {/* Subheadline (shortened) */}
          <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto mb-10">
            Join thousands of heroes. Every drop counts—your donation could save a mother, father, or child.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/find">
              <Button
                variant="primary"
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-2xl hover:shadow-red-500/30 transition-all transform hover:scale-105 w-full sm:w-auto focus:ring-4 focus:ring-red-300"
              >
                🩸 Find Blood Now
              </Button>
            </Link>
            <Link to="/donate">
              <Button
                variant="secondary"
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold text-lg px-10 py-4 rounded-xl transition-all transform hover:scale-105 w-full sm:w-auto focus:ring-4 focus:ring-white/50"
              >
                Become a Donor
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom fade (remains for visual transition, but stats are now in their own section) */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats Section (clean, no overlap) */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-red-50 rounded-2xl p-8 text-center border border-red-100 shadow-lg hover:shadow-xl transition-shadow"
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-red-600" />
                <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-lg text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Donate Section (white background with subtle top border) */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Donate Blood?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every two seconds someone needs blood. Your donation can make all the difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow group">
                <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors">
                  <reason.icon className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section (consistent white background with divider) */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to becoming a lifesaver.
            </p>
          </div>

          {/* Timeline without arrows – uses numbers and clear spacing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[ 
              { step: 1, title: "Register", description: "Create your account in under 2 minutes. Tell us your blood type and location." },
              { step: 2, title: "Get Notified", description: "Receive alerts when someone near you needs your blood type. We match you instantly." },
              { step: 3, title: "Donate & Save", description: "Visit a nearby donation center and give the gift of life. Feel the joy of saving lives." }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA – both actions */}
          <div className="text-center mt-16 space-x-4">
            <Link to="/donate">
              <Button
                variant="primary"
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Join as Donor
              </Button>
            </Link>
            <Link to="/find">
              <Button
                variant="secondary"
                size="lg"
                className="border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold text-lg px-8 py-4 rounded-xl transition-all transform hover:scale-105"
              >
                Find Blood Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section (social proof) */}
      <section className="py-20 bg-red-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real Stories, Real Impact</h2>
            <p className="text-xl text-gray-600">Hear from donors and recipients in our community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="text-red-600 text-6xl leading-none mr-2">“</div>
                  <p className="text-gray-700 italic text-lg">{testimonial.quote}</p>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center text-red-700 font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Add CSS for reduced motion */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-ping, [style*="animation"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Homepage;