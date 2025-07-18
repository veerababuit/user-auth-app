import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import signupImage from '../images/signup.jpg';

function Signup() { 
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'mobile':
        if (!value) return 'Mobile is required';
        if (!/^\d{10}$/.test(value)) return 'Mobile must be a 10-digit number';
        return '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Invalid email format';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (field, value) => {
    switch (field) {
      case 'name':
        setName(value);
        setNameError(validateField('name', value));
        break;
      case 'mobile':
        setMobile(value);
        setMobileError(validateField('mobile', value));
        break;
      case 'email':
        setEmail(value);
        setEmailError(validateField('email', value));
        break;
      case 'password':
        setPassword(value);
        setPasswordError(validateField('password', value));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameErr = validateField('name', name);
    const mobileErr = validateField('mobile', mobile);
    const emailErr = validateField('email', email);
    const passwordErr = validateField('password', password);
    if (nameErr || mobileErr || emailErr || passwordErr) {
      setNameError(nameErr);
      setMobileError(mobileErr);
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      return;
    }

    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobile, email, password }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left side - image/text */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light">
          <div className="text-center p-5">
            <img
              src={signupImage}
              alt="Welcome"
              className="img-fluid mb-4"
              style={{ maxWidth: '400px' }}
            />
            <h2 className="fw-bold text-success">Join Us!</h2>
            <p className="text-muted">Create your account to get started.</p>
          </div>
        </div>

        {/* Right side - signup form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="card shadow p-4 w-75">
            <h3 className="mb-4 text-center">Signup</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${nameError ? 'is-invalid' : ''}`}
                  value={name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Name"
                  required
                />
                {nameError && <div className="invalid-feedback">{nameError}</div>}
              </div>
              <div className="mb-3">
                <input
                  type="tel"
                  className={`form-control ${mobileError ? 'is-invalid' : ''}`}
                  value={mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  placeholder="Mobile (10 digits)"
                  required
                />
                {mobileError && <div className="invalid-feedback">{mobileError}</div>}
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className={`form-control ${emailError ? 'is-invalid' : ''}`}
                  value={email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Email"
                  required
                />
                {emailError && <div className="invalid-feedback">{emailError}</div>}
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Password"
                  required
                />
                {passwordError && <div className="invalid-feedback">{passwordError}</div>}
              </div>
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={nameError || mobileError || emailError || passwordError}
              >
                Signup
              </button>
            </form>
            {message && <p className="mt-3 text-center text-info">{message}</p>}
            <p className="mt-3 text-center">
              Already have an account? <Link to="/login">Click here</Link> to Login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
