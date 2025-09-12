import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import styles from "../styles/Checkout.module.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Add icons (you can replace these with real SVGs or images)
import { FaCreditCard, FaPaypal, FaUniversity } from "react-icons/fa";

function Checkout() {
  const location = useLocation();
  const { planName, price } = location.state || {};

  const { upgradePlan } = useAuth();
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
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
  });

  const [formErrors, setFormErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showMessage, setShowMessage] = useState(false);
  const [agreed, setAgreed] = useState(false); // ✅ new state for Terms & Conditions checkbox

  const [submittedLeftForm, setSubmittedLeftForm] = useState(false);

  const activationFee = 15;
  const totalPrice = (price || 29) + activationFee;

  // Validation
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!/^[A-Za-z ]{3,}$/.test(value)) return "Name must be at least 3 letters and contain only alphabets.";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
        break;
      case "phone":
        if (!/^\d{10,}$/.test(value)) return "Phone number must be at least 10 digits.";
        break;
      case "street":
      case "city":
        if (value.trim().length < 3) return "This field must be at least 3 characters.";
        break;
      case "postalCode":
        if (!/^\d{4,10}$/.test(value)) return "Enter a valid postal code.";
        break;
      case "cardNumber":
        if (!/^\d{16}$/.test(value)) return "Card number must be 16 digits.";
        break;
      case "expiryDate":
        if (!/^\d{2}\/\d{2}$/.test(value)) return "Enter expiry date in MM/YY format.";
        break;
      case "cvv":
        if (!/^\d{3,4}$/.test(value)) return "CVV must be 3 or 4 digits.";
        break;
      case "paypalEmail":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid PayPal email.";
        break;
      case "bankAccount":
        if (!/^\d{8,20}$/.test(value)) return "Bank account number must be 8-20 digits.";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const isLeftFormValid = () => {
    const requiredFields = ["fullName", "email", "phone", "street", "city", "postalCode"];
    for (let field of requiredFields) {
      if (!formData[field] || formErrors[field]) return false;
    }
    return true;
  };

  const handleLeftFormSubmit = (e) => {
    e.preventDefault();
    if (isLeftFormValid()) setSubmittedLeftForm(true);
    else alert("Please fill all fields correctly!");
  };

  const isPaymentValid = () => {
    if (!formData.paymentMethod) return false;
    if (formData.paymentMethod === "Credit Card") {
      const fields = ["cardNumber", "expiryDate", "cvv"];
      return fields.every(f => formData[f] && !formErrors[f]);
    }
    if (formData.paymentMethod === "PayPal") return formData.paypalEmail && !formErrors.paypalEmail;
    if (formData.paymentMethod === "Bank Transfer") return formData.bankAccount && !formErrors.bankAccount;
    return false;
  };

  const handlePlaceOrder = () => {
    if (!isPaymentValid()) {
      alert("Please fill all payment details correctly!");
      return;
    }

     // Update user's plan in AuthContext
    upgradePlan({
    planName,
    monthlyFee: price,
    totalPrice,
    paymentMethod: formData.paymentMethod,
  });
    
    
    setShowModal(true);
    setCountdown(5);
    setShowMessage(false);
  };

  useEffect(() => {
    let timer;
    if (showModal && countdown > 0) timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    else if (showModal && countdown === 0) setShowMessage(true);
    return () => clearTimeout(timer);
  }, [showModal, countdown]);

  return (
    <div className={styles.checkoutPage}>
      {/* Left Side - Form */}
      <div className={styles.formSection}>
        <h2>Checkout Form</h2>
        <form className={styles.form} onSubmit={handleLeftFormSubmit}>
          <div className={styles.formGroup}>
            <label>Gender</label>
            <div className={styles.radioGroup}>
              <label><input type="radio" name="gender" value="male" /> Male</label>
              <label><input type="radio" name="gender" value="female" /> Female</label>
              <label><input type="radio" name="gender" value="misc" /> Miscellaneous</label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input type="text" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleInputChange} />
            {formErrors.fullName && <p className={styles.error}>{formErrors.fullName}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>Date of Birth</label>
            <input type="date" name="dob" />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} />
            {formErrors.email && <p className={styles.error}>{formErrors.email}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>Phone</label>
            <input type="tel" name="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleInputChange} />
            {formErrors.phone && <p className={styles.error}>{formErrors.phone}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>Address</label>
            <input type="text" name="street" placeholder="Street" value={formData.street} onChange={handleInputChange} />
            {formErrors.street && <p className={styles.error}>{formErrors.street}</p>}
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} />
            {formErrors.city && <p className={styles.error}>{formErrors.city}</p>}
            <input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleInputChange} />
            {formErrors.postalCode && <p className={styles.error}>{formErrors.postalCode}</p>}
          </div>

          <div className={styles.formGroupCheckbox}>
            <label>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />{" "}
              I agree to the Terms & Conditions
            </label>
          </div>


          <button type="submit" className={styles.submitButton} disabled={!isLeftFormValid() || !agreed} style={{ backgroundColor: !isLeftFormValid() || !agreed ? "#e85a2a" : "#16a34a" }}>
            Submit
          </button>
        </form>
      </div>

      {/* Right Side - Payment */}
      <div className={styles.paymentSection}>
        <h2>Payment Section</h2>
        <div className={styles.subHeading}>Overview</div>

        <div className={styles.contractRow}>
          <span>Contract</span>
          <span className={styles.changeLink}>Change ({planName || "Standard Plan"})</span>
        </div>

        <div className={styles.monthlyFee}>
          <div>Your Monthly Fee</div>
          <span className={styles.price}>€{price || 29}</span>
        </div>

        <div className={styles.contractDetails}>
          <div className={styles.subHeading}>Contract Details</div>
          <div className={styles.contractRow}><span>Minimum term:</span><span>None</span></div>
          <div className={styles.contractRow}><span>Extension:</span><span>Unlimited</span></div>
          <div className={styles.contractRow}><span>Cancellation period:</span><span>Four weeks before <br /> end of billing cycle</span></div>
        </div>

        <div className={styles.costOverview}>
          <div className={styles.subHeading}>Cost Overview</div>
          <div className={styles.costRow}><span>Membership fee:</span><span>€{price || 29}/month</span></div>
          <div className={styles.costRow}><span>Activation fee:</span><span>€15.00</span></div>
          <div className={styles.costRow}><span>Training & service fee:</span><span>€0.00</span></div>
          <div className={styles.costRow}><span>Total Price (Minimum Term):</span><span><strong>€{totalPrice}</strong></span></div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.paymentMethods}>
          <div className={styles.subHeading}>Select Payment Method</div>

          {/* Credit Card */}
          <div className={styles.paymentOption}>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Credit Card"
                disabled={!submittedLeftForm}
                checked={formData.paymentMethod === "Credit Card"}
                onChange={handleInputChange}
              />
              <FaCreditCard size={40}/> Credit Card
            </label>
            {formData.paymentMethod === "Credit Card" && (
              <div className={styles.paymentDetails}>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                />
                {formErrors.cardNumber && <p className={styles.error}>{formErrors.cardNumber}</p>}

                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
                {formErrors.expiryDate && <p className={styles.error}>{formErrors.expiryDate}</p>}

                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleInputChange}
                />
                {formErrors.cvv && <p className={styles.error}>{formErrors.cvv}</p>}
              </div>
            )}
          </div>

          {/* PayPal */}
          <div className={styles.paymentOption}>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="PayPal"
                disabled={!submittedLeftForm}
                checked={formData.paymentMethod === "PayPal"}
                onChange={handleInputChange}
              />
              <FaPaypal size={40} /> PayPal
            </label>
            {formData.paymentMethod === "PayPal" && (
              <div className={styles.paymentDetails}>
                <input
                  type="email"
                  name="paypalEmail"
                  placeholder="PayPal Email"
                  value={formData.paypalEmail}
                  onChange={handleInputChange}
                />
                {formErrors.paypalEmail && <p className={styles.error}>{formErrors.paypalEmail}</p>}
              </div>
            )}
          </div>

          {/* Bank Transfer */}
          <div className={styles.paymentOption}>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Bank Transfer"
                disabled={!submittedLeftForm}
                checked={formData.paymentMethod === "Bank Transfer"}
                onChange={handleInputChange}
              />
              <FaUniversity size={40}/> Bank Transfer
            </label>
            {formData.paymentMethod === "Bank Transfer" && (
              <div className={styles.paymentDetails}>
                <input
                  type="text"
                  name="bankAccount"
                  placeholder="Bank Account Number"
                  value={formData.bankAccount}
                  onChange={handleInputChange}
                />
                {formErrors.bankAccount && <p className={styles.error}>{formErrors.bankAccount}</p>}
              </div>
            )}
          </div>
        </div>

        <button className={styles.orderButton} disabled={!isPaymentValid()} onClick={handlePlaceOrder} style={{ backgroundColor: isPaymentValid() ? "#16a34a" : "#e85a2a" }}>
          Place Binding Order
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {!showMessage ? (
              <div className={styles.loaderSection}>
                <div className={styles.loader}></div>
                <p className={styles.countdownText}>{countdown} seconds left</p>
              </div>
            ) : (
              <div className={styles.thankYouMessage}>
                <h3>🎉 Thank you, {formData.fullName || "Customer"}!</h3>
                <p>You have selected the <strong>{planName || "Standard Plan"} (€{totalPrice}/month)</strong> with <strong>{formData.paymentMethod}</strong> payment.</p>
                <p>A confirmation email will be sent to {formData.email || "your email"}.</p>
                <button
                  className={styles.closeModalButton}
                  onClick={() => {
                    setShowModal(false);
                    navigate("/profile");
                  }}
                >
                  Close
                </button>

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
