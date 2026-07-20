import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo/dav_logo.png";
import "./ParentSignup.css";

export default function ParentSignup() {
  const navigate = useNavigate();

const [admissionNo, setAdmissionNo] =
  useState("");

const [parentName, setParentName] =
  useState("");

const [email, setEmail] =
  useState("");

const [mobile, setMobile] =
  useState("");

const [password, setPassword] =
  useState("");

const [confirmPassword, setConfirmPassword] =
  useState("");

const registerParent = async () => {

  if (password !== confirmPassword) {

    alert("Password does not match");

    return;

  }

  try {

    const response = await fetch(

      "/api/parents/signup",

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          admission_no: admissionNo,

          parent_name: parentName,

          mobile,

          email,

          password,

        }),

      }

    );

    const result = await response.json();

    if (result.success) {

      alert("Registration Successful");

      navigate("/parent/login");

    } else {

      alert(result.message);

    }

  }

  catch (err) {

    console.log(err);

    alert("Server Error");

  }

};
  return (
    <div className="signup-container">
      <div className="signup-card">

        <img
          src={logo}
          alt="DAV Logo"
          className="signup-logo"
        />

        <h1>Parent Registration</h1>

        <p>
          DAV PUBLIC SCHOOL
          <br />
          Hansraj Nagar, Admapur, Sasaram
        </p>

        <div className="form-grid">

          <input
  placeholder="Admission Number"
  value={admissionNo}
  onChange={(e) =>
    setAdmissionNo(e.target.value)
  }
/>
          <input
  placeholder="Parent Name"
  value={parentName}
  onChange={(e) =>
    setParentName(e.target.value)
  }
/>

          <input
  type="email"
  placeholder="Gmail Address"
  value={email}
  onChange={(e) =>
    setEmail(e.target.value)
  }
/>

          <input
  placeholder="Mobile Number"
  value={mobile}
  onChange={(e) =>
    setMobile(e.target.value)
  }
/>

          <input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) =>
    setPassword(e.target.value)
  }
/>

          <input
  type="password"
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) =>
    setConfirmPassword(e.target.value)
  }
/>

        </div>

        <button
  className="signup-btn"
  onClick={registerParent}
>
  Verify & Register
</button>
<p
  style={{
    textAlign: "center",
    marginTop: "20px",
  }}
>
  Already have an account?
</p>

<button
  style={{
    background: "none",
    border: "none",
    color: "#0F4C81",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  }}
  onClick={() => navigate("/parent/login")}
>
  Login Here
</button>

      </div>
    </div>
  );
}