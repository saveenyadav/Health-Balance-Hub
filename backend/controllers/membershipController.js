import Membership from "../models/Membership.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

export const saveMembershipData = async (req, res) => {
  try {
    console.log("saveMembershipData called", req.body);

    if (!req.body?.email || !req.body?.planName) {
      return res.status(400).json({ success: false, message: "Email and planName are required." });
    }

    // Prevent duplicate pending/active membership for the same plan
    const existingMembership = await Membership.findOne({
      email: req.body.email,
      planName: req.body.planName,
      status: { $in: ["pending", "active"] }
    });

    if (existingMembership) {
      return res.status(400).json({
        success: false,
        message: `You already have a ${req.body.planName} membership.`
      });
    }

    // Create user if doesn't exist
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      user = new User({
        email: req.body.email,
        profile: { membershipPlan: "trial" }, // default
        password: "temporary",
      });
      await user.save();
    }

    // Save membership data
    const membership = new Membership({
      fullName: req.body.fullName || "",
      email: req.body.email,
      phone: req.body.phone || "",
      street: req.body.street || "",
      city: req.body.city || "",
      postalCode: req.body.postalCode || "",
      gender: req.body.gender || "",
      dob: req.body.dob || "",
      planName: req.body.planName,
      price: req.body.price || 0,
      paymentMethod: req.body.paymentMethod || "",
      status: "pending",
    });

    await membership.save();
    return res.status(200).json({ success: true, message: "Membership data saved." });
  } catch (err) {
    console.error("saveMembershipData error:", err.message, err.stack);
    return res.status(500).json({ success: false, message: "Error saving membership data.", error: err.message });
  }
};

export const processPayment = async (req, res) => {
  try {
    console.log("processPayment called", req.body);

    if (!req.body?.email || !req.body?.planName) {
      return res.status(400).json({ success: false, message: "Email and planName are required." });
    }

    // Prevent buying the same plan again
    const existingActive = await Membership.findOne({
      email: req.body.email,
      planName: req.body.planName,
      status: "active",
    });

    if (existingActive) {
      return res.status(400).json({
        success: false,
        message: `You already have the ${req.body.planName} plan active.`
      });
    }

    // Update user's plan in DB using proper enum
    const allowedPlans = ["trial", "basic", "premium"];
    const selectedPlan = allowedPlans.includes(req.body.planName) ? req.body.planName : "trial";

    const userUpdate = await User.findOneAndUpdate(
      { email: req.body.email },
      { $set: { "profile.membershipPlan": selectedPlan } },
      { new: true }
    );

    if (!userUpdate) {
      console.warn("processPayment: user not found for email:", req.body.email);
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Update or create membership doc
    let membershipUpdate = await Membership.findOneAndUpdate(
      { email: req.body.email },
      { $set: { status: "active", planName: req.body.planName } },
      { new: true }
    );

    if (!membershipUpdate) {
      membershipUpdate = new Membership({
        fullName: req.body.fullName || "",
        email: req.body.email,
        planName: req.body.planName,
        price: req.body.price || 0,
        status: "active",
      });
      await membershipUpdate.save();
    }

    // Send congratulatory email
    if (process.env.DISABLE_EMAILS !== "true") {
      try {
        await sendCongratsEmail(req.body.email, req.body.planName);
      } catch (emailErr) {
        console.error("sendCongratsEmail failed (non-fatal):", emailErr.message || emailErr);
      }
    } else {
      console.log("Emails disabled via DISABLE_EMAILS=true. Skipping sendCongratsEmail.");
    }

    // Always respond with JSON, never redirect
    return res.status(200).json({ success: true, message: "Payment processed and plan upgraded." });
  } catch (err) {
    console.error("processPayment error:", err.message, err.stack);
    return res.status(500).json({ success: false, message: "Payment failed.", error: err.message });
  }
};

async function sendCongratsEmail(to, planName) {
  const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587;
  const secure = port === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.verify();
  console.log("Email transporter verified OK");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e2e2; padding: 20px; border-radius: 10px; background-color: #fefefe;">
      <img src="http://localhost:5173/images/hbhLogo.png" alt="Health Balance Hub" style="width:150px; display:block; margin:auto;" />
      <h1 style="color: #ff8c00; text-align: center;">🎉 Congratulations!</h1>
      <p style="font-size: 16px;">Hi there,</p>
      <p style="font-size: 16px;">
        You are now successfully enrolled in the <strong style="color:#ff8c00;">${planName}</strong> membership plan.
      </p>
      <p style="font-size: 16px;">
        Here's what you can look forward to:
      </p>
      <ul style="font-size: 16px; line-height: 1.6;">
        <li>💪 Exclusive access to premium features</li>
        <li>📅 Personalized training & support</li>
        <li>⚡ Priority customer service</li>
      </ul>
      <p style="text-align: center; margin-top: 30px;">
        <a href="${process.env.FRONTEND_URL}/profile" style="background-color: #ff8c00; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">Go to Your Profile</a>
      </p>
      <p style="font-size: 14px; color: #555; margin-top: 30px;">Thank you for being part of our community.<br/>Health Balance Hub Team</p>
    </div>
  `;

  return transporter.sendMail({
    from: `"Health Balance Hub" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Welcome to the ${planName} Plan! 🎉`,
    html: htmlContent
  });
}