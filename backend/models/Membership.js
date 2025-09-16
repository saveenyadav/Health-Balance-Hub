import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  street: String,
  city: String,
  postalCode: String,
  gender: String,
  dob: String,
  planName: { type: String, required: true },
  price: Number,
  paymentMethod: String,
  status: { type: String, default: "pending" }, // pending, active, cancelled
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Membership", membershipSchema);