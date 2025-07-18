import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logoImage from '../images/logo.png';

function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logoImage}
            alt="Logo"
            height="40"
            className="me-2"
          />
          {/* <span className="fw-bold">User Authentication</span> */}
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link px-3" to="/">Home</Link>
            </li>

            {token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link px-3" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-primary me-2" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-secondary" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
