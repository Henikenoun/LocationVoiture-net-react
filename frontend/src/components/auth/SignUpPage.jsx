import React, { useState } from "react";
import "./LoginPage.css"; // Import a CSS file for custom styles
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    firstname: "",
    lastname: "",
    telephone: "",
    email: "",
    password: "",
    password_confirmation: "",
    address: "",
    dateNaiss: "",
  });

  const handleSave = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
  
    // Mapper les données envoyées au format attendu par l'API
    const userToSend = {
      nom: newUser.firstname.trim(),
      prenom: newUser.lastname.trim(),
      adresse: newUser.telephone.trim(),
      dateNaiss: new Date().toISOString(), // Fournir une date valide en ISO
      dateInscription: new Date().toISOString(), // Date actuelle
      email: newUser.email.trim(),
      phoneNumber: newUser.telephone.trim(),
      password: newUser.password,
    };
  
    console.log("Data sent to API:", userToSend); // Debugging
  
    try {
      const response = await axios.post(
        "http://localhost:5074/api/Account/RegisterClient",
        userToSend
      );
      if (response.status === 200 || response.status === 201) {
        alert("Registration successful. Please check your email to verify your account.");
        navigate("/login"); // Rediriger après l'inscription
      } else {
        alert("Registration failed. Please check your details.");
      }
    } catch (error) {
      console.error("Error during registration:", error.response?.data || error);
      alert("An error occurred. Please try again later.");
    }
  };
  

  return (
    <div className="login-container" style={{width:'180% !important'}}>
      <div className="login-card" style={{marginTop:'500px',marginBottom:'200px'}}>
        {/* Left Section: Image */}
        <div className="image-section">
          <img
            src="src/img/login.png"
            alt="Car"
            className="car-image"
          />
        </div>

        {/* Right Section: Form */}
        <div className="form-section my-5">
          <h2>Create an Account</h2>
          <p>
            Since this is your first trip, you'll need to provide us with some
            information before you can check out.
          </p>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <input
                type="text"
                placeholder="First Name"
                required
                value={newUser.firstname}
                onChange={(e) =>
                  setNewUser({ ...newUser, firstname: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Last Name"
                required
                value={newUser.lastname}
                onChange={(e) =>
                  setNewUser({ ...newUser, lastname: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Address"
                required
                value={newUser.address}
                onChange={(e) =>
                  setNewUser({ ...newUser, address: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="date"
                placeholder="Date of Birth"
                required
                value={newUser.dateNaiss}
                onChange={(e) =>
                  setNewUser({ ...newUser, dateNaiss: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Phone Number"
                required
                value={newUser.telephone}
                onChange={(e) =>
                  setNewUser({ ...newUser, telephone: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                required
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                required
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={newUser.password_confirmation}
                onChange={(e) =>
                  setNewUser({ ...newUser, password_confirmation: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="login-button"
            >
              Sign Up
            </button>
            <div className="signup-link">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
