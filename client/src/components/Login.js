import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import loginImage from '../images/login.jpg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateField = (field, value) => {
    switch (field) {
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
    if (field === 'email') {
      setEmail(value);
      setEmailError(validateField('email', value));
    } else if (field === 'password') {
      setPassword(value);
      setPasswordError(validateField('password', value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateField('email', email);
    const passwordErr = validateField('password', password);
    if (emailErr || passwordErr) {
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      return;
    }

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) {
      localStorage.setItem('token', data.token);
      navigate('/profile');
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left side - image or welcome text */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light">
          <div className="text-center p-5">
            <img
              src={loginImage}
              alt="Welcome"
              className="img-fluid mb-4"
              style={{ maxWidth: '400px' }}
            />
            <h2 className="fw-bold text-primary">Welcome Back!</h2>
            <p className="text-muted">Login to continue to your dashboard.</p>
          </div>
        </div>

        {/* Right side - login form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="card shadow p-4 w-75">
            <h3 className="mb-4 text-center">Login</h3>
            <form onSubmit={handleSubmit}>
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
                className="btn btn-primary w-100"
                disabled={emailError || passwordError}
              >
                Login
              </button>
            </form>
            {message && <p className="mt-3 text-center text-danger">{message}</p>}
            <p className="mt-3 text-center">
              Not registered? <Link to="/register">Click here</Link> to register.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
