import { React, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const response = await axios.post(
          "http://localhost:3000/authenticate",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        if (response.data.userId) {
          localStorage.setItem("userId", response.data.userId);
          navigate(`/tasks/${response.data.userId}`);
        }
      } else {
        const response = await axios.post("http://localhost:3000/users", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (response.data.id) {
          localStorage.setItem("userId", response.data.id);
          navigate(`/tasks/${response.data.id}`);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
    });
    setError("");
  };

  return (
    <div className="app">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">
            📝 {isLogin ? "Welcome Back" : "Join To-Do Manager"}
          </h1>
          <p className="auth-subtitle">
            {isLogin ? "Sign in to manage your tasks" : "Sign up to get started"}
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
                minLength="6"
              />
            </div>

            <button
              type="submit"
              className={`auth-button ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "🔑 Sign In" : "🚀 Sign Up"}
            </button>
          </form>

          <div className="auth-toggle">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="toggle-button"
                onClick={toggleMode}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
