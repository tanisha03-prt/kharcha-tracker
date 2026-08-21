import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5001/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // Save login information
      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        localStorage.setItem(
          "userName",
          data.user.name ||
            data.user.username ||
            ""
        );

        localStorage.setItem(
          "userEmail",
          data.user.email ||
            email
        );
      }

      // Go to dashboard
      window.location.href = "/";

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          ₹
        </div>

        <p className="eyebrow">
          KHARCHA TRACKER
        </p>

        <h1>
          Welcome back
        </h1>

        <p className="login-subtitle">
          Login to manage your money smarter.
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="login-field">

            <label>
              EMAIL
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          <div className="login-field">

            <label>
              PASSWORD
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login →"}
          </button>

        </form>

        <p className="login-footer">
          Your finances. Your control.
        </p>

      </div>

    </div>
  );
};

export default Login;