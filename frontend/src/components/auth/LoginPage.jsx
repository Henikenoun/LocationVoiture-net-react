import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [user, setUser] = useState({ email: "", password: "" });

  const handleSave = async (e) => {
    e.preventDefault();
    const loggedInUser = await login(user.email, user.password);
    if (loggedInUser) {
      if (loggedInUser.role == "Admin") {
        navigate("/admin", { state: { user: loggedInUser } });
      } else if (loggedInUser.role == "Manager" || loggedInUser.role == "Employee") {
        navigate("/manager", { state: { user: loggedInUser } });
      }
      else {
        navigate("/");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="image-section">
          <img src="src/img/login.png" alt="Car" className="car-image" />
        </div>
        <div className="form-section">
          <h2>Welcome Back!</h2>
          <p>Please log in to access your account and manage your bookings.</p>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                required
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                required
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <div className="additional-links">
            <a href="#">Login with phone instead</a>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
          <div className="signup-link">
            New here? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;