import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Checkout.module.css";
import { useAuth } from "../context/AuthContext";

// Icons
import { FaCreditCard, FaPaypal, FaUniversity } from "react-icons/fa";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { planName, price } = location.state || {};
  const { upgradePlan, user } = useAuth();


  // Form State
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    paymentMethod: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paypalEmail: "",
    bankAccount: "",
    gender: "",
    dob: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [submittedLeftForm, setSubmittedLeftForm] = useState(false); // ✅ enables payment section

  const activationFee = 15;
  const totalPrice = (price || 29) + activationFee;

  
  // Validation
 
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return /^[A-Za-z ]{3,}$/.test(value) ? "" : "Name must be at least 3 letters.";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Enter a valid email address.";
      case "phone":
        return /^\d{10,}$/.test(value) ? "" : "Phone must be at least 10 digits.";
      case "street":
      case "city":
        return value.trim().length >= 3 ? "" : "This field must be at least 3 characters.";
      case "postalCode":
        return /^\d{4,10}$/.test(value) ? "" : "Enter a valid postal code.";
      case "cardNumber":
        return /^\d{16}$/.test(value) ? "" : "Card number must be 16 digits.";
      case "expiryDate":
        return /^\d{2}\/\d{2}$/.test(value) ? "" : "Expiry date MM/YY.";
      case "cvv":
        return /^\d{3,4}$/.test(value) ? "" : "CVV must be 3 or 4 digits.";
      case "paypalEmail":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Enter a valid PayPal email.";
      case "bankAccount":
        return /^\d{8,20}$/.test(value) ? "" : "Bank account 8-20 digits.";
      default:
        return "";
    }
  };

  
  // Input Handler

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  
  // Form Validation

  const isLeftFormValid = () => {
    const requiredFields = ["fullName", "email", "phone", "street", "city", "postalCode"];
    return requiredFields.every(f => formData[f] && !formErrors[f]) && agreed;
  };

  const isPaymentValid = () => {
    if (!formData.paymentMethod) return false;
    if (formData.paymentMethod === "Credit Card") {
      return ["cardNumber", "expiryDate", "cvv"].every(f => formData[f] && !formErrors[f]);
    }
    if (formData.paymentMethod === "PayPal") return formData.paypalEmail && !formErrors.paypalEmail;
    if (formData.paymentMethod === "Bank Transfer") return formData.bankAccount && !formErrors.bankAccount;
    return false;
  };

  
  // Left Form Submission
  
  const handleLeftFormSubmit = async (e) => {
    e.preventDefault();
    if (!isLeftFormValid()) {
      alert("Please fill all fields correctly and agree to the terms!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/membership/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, planName, price: totalPrice }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmittedLeftForm(true); // enables payment section
        // Clear left form after submission
        setFormData({
          fullName: "",
          email: user?.email || "",
          phone: "",
          street: "",
          city: "",
          postalCode: "",
          paymentMethod: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          paypalEmail: "",
          bankAccount: "",
          gender: "",
          dob: "",
        });
        setAgreed(false);
        alert("Membership data saved! Now proceed to payment.");
      } else {
        alert(data.message || "Failed to save membership data.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  };

  
  // Payment Submission

  const handlePlaceOrder = async () => {
    if (!isPaymentValid()) {
      alert("Please fill all payment details correctly!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/membership/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, planName, price: totalPrice }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        //  Update plan in AuthContext
        upgradePlan({ planName, monthlyFee: price, totalPrice, paymentMethod: formData.paymentMethod });

        //  Clear all form fields after purchase
        setFormData({
          fullName: "",
          email: user?.email || "",
          phone: "",
          street: "",
          city: "",
          postalCode: "",
          paymentMethod: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          paypalEmail: "",
          bankAccount: "",
          gender: "",
          dob: "",
        });
        setSubmittedLeftForm(false);
        setAgreed(false);

        // Redirect to profile to show purchased plan
        navigate("/profile");

        // Email handled by backend
      } else {
        alert(data.message || "Payment failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className={styles.checkoutPage}>
      {/* Left Side - Form */}
      <div className={styles.formSection}>
        <h2>Checkout Form</h2>
        <form onSubmit={handleLeftFormSubmit} className={styles.form}>
          {/* Gender */}
          <div className={styles.formGroup}>
            <label>Gender</label>
            <div className={styles.radioGroup}>
              {["male","female","misc"].map(g => (
                <label key={g}>
                  <input type="radio" name="gender" value={g} checked={formData.gender===g} onChange={handleInputChange} /> {g.charAt(0).toUpperCase()+g.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} />
            {formErrors.fullName && <p className={styles.error}>{formErrors.fullName}</p>}
          </div>

          {/* DOB */}
          <div className={styles.formGroup}>
            <label>Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            {formErrors.email && <p className={styles.error}>{formErrors.email}</p>}
          </div>

          {/* Phone */}
          <div className={styles.formGroup}>
            <label>Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
            {formErrors.phone && <p className={styles.error}>{formErrors.phone}</p>}
          </div>

          {/* Street */}
          <div className={styles.formGroup}>
            <label>Street</label>
            <input type="text" name="street" value={formData.street} onChange={handleInputChange} />
            {formErrors.street && <p className={styles.error}>{formErrors.street}</p>}
          </div>

          {/* City */}
          <div className={styles.formGroup}>
            <label>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleInputChange} />
            {formErrors.city && <p className={styles.error}>{formErrors.city}</p>}
          </div>

          {/* Postal Code */}
          <div className={styles.formGroup}>
            <label>Postal Code</label>
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} />
            {formErrors.postalCode && <p className={styles.error}>{formErrors.postalCode}</p>}
          </div>

          {/* Terms & Conditions */}
          <div className={styles.formGroupCheckbox}>
            <label>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} /> I agree to Terms & Conditions
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={!isLeftFormValid()} className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>

      {/* Right Side - Payment */}
      <div className={styles.paymentSection}>
        <h2>Payment Section</h2>

        {/* Credit Card */}
        <div className={styles.paymentOption}>
          <label>
            <input type="radio" name="paymentMethod" value="Credit Card" checked={formData.paymentMethod==="Credit Card"} onChange={handleInputChange} disabled={!submittedLeftForm} />
            <FaCreditCard size={30}/> Credit Card
          </label>
          {formData.paymentMethod === "Credit Card" && (
            <div className={styles.paymentDetails}>
              <input type="text" name="cardNumber" placeholder="Card Number" value={formData.cardNumber} onChange={handleInputChange} />
              <input type="text" name="expiryDate" placeholder="MM/YY" value={formData.expiryDate} onChange={handleInputChange} />
              <input type="text" name="cvv" placeholder="CVV" value={formData.cvv} onChange={handleInputChange} />
            </div>
          )}
        </div>

        {/* PayPal */}
        <div className={styles.paymentOption}>
          <label>
            <input type="radio" name="paymentMethod" value="PayPal" checked={formData.paymentMethod==="PayPal"} onChange={handleInputChange} disabled={!submittedLeftForm} />
            <FaPaypal size={30}/> PayPal
          </label>
          {formData.paymentMethod === "PayPal" && (
            <div className={styles.paymentDetails}>
              <input type="email" name="paypalEmail" placeholder="PayPal Email" value={formData.paypalEmail} onChange={handleInputChange} />
            </div>
          )}
        </div>

        {/* Bank Transfer */}
        <div className={styles.paymentOption}>
          <label>
            <input type="radio" name="paymentMethod" value="Bank Transfer" checked={formData.paymentMethod==="Bank Transfer"} onChange={handleInputChange} disabled={!submittedLeftForm} />
            <FaUniversity size={30}/> Bank Transfer
          </label>
          {formData.paymentMethod === "Bank Transfer" && (
            <div className={styles.paymentDetails}>
              <input type="text" name="bankAccount" placeholder="Bank Account Number" value={formData.bankAccount} onChange={handleInputChange} />
            </div>
          )}
        </div>

        {/* Place Order */}
        <button disabled={!isPaymentValid()} onClick={handlePlaceOrder} className={styles.orderButton}>
          Place Binding Order
        </button>
      </div>
    </div>
  );
}

export default Checkout;
