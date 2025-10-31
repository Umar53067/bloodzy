import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },

    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },

    age: {
      type: Number,
      required: true,
      min: 18,
      max: 65,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    // GeoJSON location (for distance-based queries)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    // optional: last donation date or auto timestamps
    lastDonation: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Create 2dsphere index to enable geospatial queries
donorSchema.index({ location: "2dsphere" });

export default mongoose.model("Donor", donorSchema);
