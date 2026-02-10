import { Heart, Users, Droplet } from "lucide-react"

function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section - Enhanced with gradient and design */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">About Bloodzy</h1>
          <p className="max-w-3xl mx-auto text-xl text-red-100 leading-relaxed">
            We are committed to connecting voluntary blood donors with patients in need. Together, we can save millions
            of lives by making blood accessible to everyone, everywhere.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-red-100 font-medium border border-white/20">
              <span className="font-bold text-white">10K+</span> Donors
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-red-100 font-medium border border-white/20">
              <span className="font-bold text-white">500+</span> Lives Saved
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-red-100 font-medium border border-white/20">
              <span className="font-bold text-white">24/7</span> Support
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
            alt="Mission"
            className="rounded-lg shadow-lg"
          />
          <div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              At Bloodzy, our mission is simple yet powerful: to make safe and voluntary blood donation accessible for
              all. We aim to eliminate the struggle of finding blood during emergencies by building a community of
              compassionate donors and recipients.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Built on compassion, community, and trust</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border-t-4 border-red-600">
              <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Compassion</h3>
              <p className="text-gray-600 leading-relaxed">
                Every drop of blood carries the gift of life. We believe in humanity and helping others selflessly.
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border-t-4 border-blue-600">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Building a strong network of donors and recipients where support and care come first.
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border-t-4 border-green-600">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Droplet className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Trust</h3>
              <p className="text-gray-600 leading-relaxed">
                We ensure safe, verified, and genuine connections between donors and patients in need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600">Dedicated professionals working to save lives</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="relative mb-6">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Team member"
                className="w-24 h-24 mx-auto rounded-full border-4 border-red-600 shadow-lg"
              />
            </div>
            <h3 className="font-bold text-lg text-gray-900">John Smith</h3>
            <p className="text-red-600 font-medium">Founder & CEO</p>
          </div>
          <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="relative mb-6">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Team member"
                className="w-24 h-24 mx-auto rounded-full border-4 border-blue-600 shadow-lg"
              />
            </div>
            <h3 className="font-bold text-lg text-gray-900">Sarah Johnson</h3>
            <p className="text-blue-600 font-medium">Medical Advisor</p>
          </div>
          <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="relative mb-6">
              <img
                src="https://randomuser.me/api/portraits/men/76.jpg"
                alt="Team member"
                className="w-24 h-24 mx-auto rounded-full border-4 border-green-600 shadow-lg"
              />
            </div>
            <h3 className="font-bold text-lg text-gray-900">Michael Lee</h3>
            <p className="text-green-600 font-medium">Tech Lead</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
