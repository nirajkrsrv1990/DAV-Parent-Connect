import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, LockKeyhole } from "lucide-react";

import logo from "@/assets/logo/dav_logo.png";
import { API_BASE_URL } from "@/config/api";

import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  /* =====================================================
     SEND OTP
  ===================================================== */

  const sendOtp = async () => {
    if (!email.trim()) {
      alert("Please enter your registered email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/parents/forgot-password/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        alert(
          "OTP has been sent to your registered email."
        );

        setStep(2);
      } else {
        alert(
          result.message ||
            "Unable to send OTP."
        );
      }
    } catch (error) {
      console.error(
        "Send OTP Error:",
        error
      );

      alert(
        "Server connection error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     VERIFY OTP
  ===================================================== */

  const verifyOtp = async () => {
    if (!otp.trim()) {
      alert("Please enter the OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/parents/forgot-password/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        alert("OTP verified successfully.");

        setStep(3);
      } else {
        alert(
          result.message ||
            "Invalid OTP."
        );
      }
    } catch (error) {
      console.error(
        "Verify OTP Error:",
        error
      );

      alert(
        "Server connection error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     RESET PASSWORD
  ===================================================== */

  const resetPassword = async () => {
    if (
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      alert(
        "Please enter and confirm your new password."
      );
      return;
    }

    if (newPassword.length < 6) {
      alert(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      alert(
        "New Password and Confirm Password do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/parents/forgot-password/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
            new_password: newPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        alert(
          "Password reset successfully. Please login with your new password."
        );

        navigate("/");
      } else {
        alert(
          result.message ||
            "Unable to reset password."
        );
      }
    } catch (error) {
      console.error(
        "Reset Password Error:",
        error
      );

      alert(
        "Server connection error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">

      <div className="forgot-overlay"></div>

      <div className="forgot-card">

        {/* =================================================
            LOGO
        ================================================= */}

        <img
          src={logo}
          alt="DAV Logo"
          className="forgot-logo"
        />

        {/* =================================================
            SCHOOL DETAILS
        ================================================= */}

        <h1>
          DAV PUBLIC SCHOOL
        </h1>

        <h3>
          Hansraj Nagar, Admapur, Sasaram
        </h3>

        <p className="forgot-managed">
          Managed By DAV CMC, New Delhi
        </p>

        <div className="forgot-session">
          Session : 2026–27
        </div>

        <div className="forgot-divider"></div>

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="forgot-heading">

          <LockKeyhole size={28} />

          <div>
            <h2>
              Forgot Password
            </h2>

            <p>
              Reset your Parent account password
            </p>
          </div>

        </div>

        {/* =================================================
            STEP INDICATOR
        ================================================= */}

        <div className="forgot-steps">

          <div
            className={
              step >= 1
                ? "forgot-step active"
                : "forgot-step"
            }
          >
            <span>1</span>
            <small>Email</small>
          </div>

          <div className="forgot-step-line"></div>

          <div
            className={
              step >= 2
                ? "forgot-step active"
                : "forgot-step"
            }
          >
            <span>2</span>
            <small>OTP</small>
          </div>

          <div className="forgot-step-line"></div>

          <div
            className={
              step >= 3
                ? "forgot-step active"
                : "forgot-step"
            }
          >
            <span>3</span>
            <small>Password</small>
          </div>

        </div>

        {/* =================================================
            STEP 1 — EMAIL
        ================================================= */}

        {step === 1 && (
          <div className="forgot-form">

            <label>
              Registered Email
            </label>

            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendOtp();
                }
              }}
            />

            <p className="forgot-help">
              An OTP will be sent to your
              registered email address.
            </p>

            <button
              type="button"
              className="forgot-btn"
              onClick={sendOtp}
              disabled={loading}
            >
              {loading
                ? "SENDING OTP..."
                : "SEND OTP"}
            </button>

          </div>
        )}

        {/* =================================================
            STEP 2 — OTP
        ================================================= */}

        {step === 2 && (
          <div className="forgot-form">

            <label>
              Enter OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  verifyOtp();
                }
              }}
            />

            <p className="forgot-help">
              OTP sent to:
              <br />
              <strong>
                {email}
              </strong>
            </p>

            <button
              type="button"
              className="forgot-btn"
              onClick={verifyOtp}
              disabled={loading}
            >
              {loading
                ? "VERIFYING..."
                : "VERIFY OTP"}
            </button>

            <button
              type="button"
              className="forgot-secondary-btn"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Change Email
            </button>

          </div>
        )}

        {/* =================================================
            STEP 3 — NEW PASSWORD
        ================================================= */}

        {step === 3 && (
          <div className="forgot-form">

            <label>
              New Password
            </label>

            <div className="forgot-password-box">

              <input
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(
                    !showNewPassword
                  )
                }
                className="forgot-eye-btn"
              >
                {showNewPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            <label>
              Confirm Password
            </label>

            <div className="forgot-password-box">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="forgot-eye-btn"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            <p className="forgot-help">
              Password must contain at least
              6 characters.
            </p>

            <button
              type="button"
              className="forgot-btn"
              onClick={resetPassword}
              disabled={loading}
            >
              {loading
                ? "RESETTING..."
                : "RESET PASSWORD"}
            </button>

          </div>
        )}

        {/* =================================================
            BACK TO LOGIN
        ================================================= */}

        <button
          type="button"
          className="back-login-btn"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} />
          Back to Login
        </button>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="forgot-footer">

          <p>
            Designed & Developed by
          </p>

          <strong>
            IT Department
          </strong>

          <p>
            DAV Public School, Sasaram
          </p>

        </div>

      </div>
    </div>
  );
}