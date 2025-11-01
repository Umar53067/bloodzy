import { Heart, Users, Droplet } from "lucide-react"

function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Bloodzy</h1>
          <p className="max-w-2xl mx-auto text-lg">
            We are committed to connecting voluntary blood donors with patients in need. Together, we can save millions
            of lives by making blood accessible to everyone, everywhere.
          </p>
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
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-10">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <Heart className="h-10 w-10 text-red-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Compassion</h3>
              <p className="text-gray-600">
                Every drop of blood carries the gift of life. We believe in humanity and helping others selflessly.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <Users className="h-10 w-10 text-red-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Community</h3>
              <p className="text-gray-600">
                Building a strong network of donors and recipients where support and care come first.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <Droplet className="h-10 w-10 text-red-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Trust</h3>
              <p className="text-gray-600">
                We ensure safe, verified, and genuine connections between donors and patients in need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-red-600 text-center mb-10">Meet Our Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Team member"
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="font-bold text-lg">John Smith</h3>
            <p className="text-gray-600">Founder & CEO</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Team member"
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="font-bold text-lg">Sarah Johnson</h3>
            <p className="text-gray-600">Medical Advisor</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <img
              src="https://randomuser.me/api/portraits/men/76.jpg"
              alt="Team member"
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="font-bold text-lg">Michael Lee</h3>
            <p className="text-gray-600">Tech Lead</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
