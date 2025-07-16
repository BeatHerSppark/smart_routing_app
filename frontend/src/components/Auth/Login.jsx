import React, { useState } from "react";
import "./reglog.css";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import { getCookie } from "./api";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/users/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      const me = await fetch("http://localhost:8000/users/me", {
        credentials: "include",
      });
      const data = await me.json();
      setUser(data.username);
      navigate("/");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="d-flex flex-column flex-lg-row align-items-center h-100">
      <div className="mobilehead d-block d-lg-none w-100 text-center py-4">
        <h6 className="text-white mb-0">
          <span className="yellow_text">Welcome back!</span> Ready to navigate
          your day the smart way?
        </h6>
      </div>

      <main className="form-signin w-100 m-auto">
        <form onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal text-center">Login</h1>

          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
            />
            <label htmlFor="username">Username</label>
          </div>
          <div className="form-floating mb-2">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className="form-check text-start my-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="passwordToggle"
            />
            <label className="form-check-label" htmlFor="passwordToggle">
              Show password
            </label>
          </div>
          <button className="btn btn-primary w-100 py-2 mb-3" type="submit">
            Login
          </button>
          <Link to="/register" className="link-offset-2 text-secondary">
            Don't have an account?
          </Link>
        </form>
      </main>

      <div className="sidehalf d-none d-lg-flex align-items-center">
        <div className="container d-flex gap-4 align-items-center px-5">
          <div className="sidehalf__text text-white">
            <h1 className="mb-4">
              <span className="yellow_text">Welcome back!</span> Ready to
              navigate your day the smart way?
            </h1>
            <p>
              Know your way around the smartest way, save your favourite routes
              and share them with friends!
            </p>
          </div>
          <div>
            <img src="/assets/register_map.svg" alt="Map" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
