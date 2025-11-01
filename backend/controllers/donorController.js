import Donor from "../models/Donor.js";

// ✅ Register new donor
export const registerDonor = async (req, res) => {
  try {
    const userId = req.user.id; // extracted from JWT (authMiddleware)
    const { bloodGroup, age, gender, phone, city, available, location } = req.body;

    // 🧠 Basic validation
    if (!bloodGroup || !age || !gender || !phone || !city || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!location.lat || !location.lng) {
      return res.status(400).json({ message: "Location (lat, lng) is required" });
    }

    // 🔍 Prevent duplicate donor registration
    const existingDonor = await Donor.findOne({ user: userId });
    if (existingDonor) {
      return res.status(400).json({ message: "You are already registered as a donor" });
    }

    // 💾 Save donor
    const donor = await Donor.create({
      user: userId,
      bloodGroup,
      age,
      gender,
      phone,
      city,
      available,
      location: {
        type: "Point",
        coordinates: [location.lng, location.lat], // ⚠️ GeoJSON: [lng, lat]
      },
    });

    res.status(201).json({
      message: "✅ Donor registered successfully!",
      donor,
    });
  } catch (err) {
    console.error("❌ Donor registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Find donors nearby (with optional blood group filter)
export const findNearbyDonors = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 5000, bloodGroup } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    // 🧭 Build geospatial query
    const query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance), // meters
        },
      },
      available: true, // Only show available donors
    };

    // Optional filter by blood group
    if (bloodGroup) query.bloodGroup = bloodGroup;

    // ⚡ Execute query
    const donors = await Donor.find(query)
      .populate("user", "username email") // include user info
      .limit(50); // safety limit

    res.status(200).json({
      count: donors.length,
      donors,
    });
  } catch (err) {
    console.error("❌ Donor search error:", err);
    res.status(500).json({ message: "Failed to find donors nearby" });
  }
};

// ✅ Get current user's donor profile
export const getMyDonor = async (req, res) => {
  try {
    const userId = req.user.id;
    const donor = await Donor.findOne({ user: userId }).populate("user", "username email createdAt");
    if (!donor) {
      return res.status(404).json({ message: "Not registered as a donor" });
    }
    res.json({ donor });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update current user's donor profile
export const updateMyDonor = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bloodGroup, age, gender, phone, city, available, location } = req.body;

    const update = {};
    if (bloodGroup) update.bloodGroup = bloodGroup;
    if (age) update.age = age;
    if (gender) update.gender = gender;
    if (phone) update.phone = phone;
    if (city) update.city = city;
    if (typeof available === 'boolean') update.available = available;
    if (location && location.lat && location.lng) {
      update.location = { type: 'Point', coordinates: [location.lng, location.lat] };
    }

    const donor = await Donor.findOneAndUpdate(
      { user: userId },
      { $set: update },
      { new: true }
    );

    if (!donor) {
      return res.status(404).json({ message: "Not registered as a donor" });
    }

    res.json({ message: "Donor profile updated", donor });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
