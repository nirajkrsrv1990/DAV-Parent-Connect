import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo/dav_logo.png";
import "./ParentSignup.css";

export default function ParentLogin() {

  const navigate = useNavigate();

  const [mobile, setMobile] =
    useState("");

  const [password, setPassword] =
    useState("");

  const parentLogin = async () => {

    try {

      const response = await fetch(

        "http://localhost:5000/api/parents/login",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify({

            mobile,

            password,

          }),

        }

      );

      const result = await response.json();

      if (result.success) {

        localStorage.setItem(

          "parent",

          JSON.stringify(result.parent)

        );

        navigate("/parent/dashboard");

      }

      else {

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

        <h1>Parent Login</h1>

        <p>

          DAV PUBLIC SCHOOL

          <br />

          Hansraj Nagar, Admapur, Sasaram

        </p>

        <div className="form-grid">

          <input

            placeholder="Mobile Number"

            value={mobile}

            onChange={(e)=>

              setMobile(e.target.value)

            }

          />

          <input

            type="password"

            placeholder="Password"

            value={password}

            onChange={(e)=>

              setPassword(e.target.value)

            }

          />

        </div>

        <button

          className="signup-btn"

          onClick={parentLogin}

        >

          Login

        </button>
        <div
  style={{
    textAlign: "center",
    marginTop: "20px",
  }}
>
  Don't have an account?

  <br />

  <button
    style={{
      background: "none",
      border: "none",
      color: "#0F4C81",
      cursor: "pointer",
      fontWeight: "bold",
      marginTop: "8px",
    }}
    onClick={() =>
      navigate("/parent/signup")
    }
  >
    Register Here
  </button>

</div>

      </div>

    </div>

  );

}