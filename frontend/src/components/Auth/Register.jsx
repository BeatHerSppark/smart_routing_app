import React, { useState } from "react";
import "./reglog.css";
import { Link, useNavigate } from "react-router";
import { register } from "./api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    password2: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(form.username, form.password, form.password2);
    if (res.ok) {
      navigate("/login");
    } else {
      const err = await res.json();
      alert(err.error || JSON.stringify(err));
    }
  };

  return (
    <div className="d-flex flex-column flex-lg-row align-items-center h-100">
      <div className="mobilehead d-block d-lg-none w-100 text-center py-4">
        <h6 className="text-white mb-0">
          Find optimal routes the <span className="yellow_text">easy way</span>!
        </h6>
      </div>

      <main className="form-signin w-100 m-auto">
        <form onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal text-center">Create an account</h1>

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
          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="password2"
              name="password2"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <label htmlFor="password2">Confirm Password</label>
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
            Register
          </button>
          <Link to="/login" className="link-offset-2 text-secondary">
            Already have an account?
          </Link>
        </form>
      </main>

      <div className="sidehalf d-none d-lg-flex align-items-center">
        <div className="container d-flex gap-4 align-items-center px-5">
          <div className="sidehalf__text text-white">
            <h1 className="mb-4">
              Find optimal routes the
              <br />
              <span className="yellow_text">easy way</span>!
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

export default Register;
