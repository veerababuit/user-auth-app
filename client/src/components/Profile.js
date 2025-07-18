import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Profile() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch user data');

        setName(data.name);
        setMobile(data.mobile);
        setEmail(data.email);
        setNewName(data.name);
        setNewMobile(data.mobile);
        setNewEmail(data.email);
      } catch (err) {
        setError(err.message);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

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
      default:
        return '';
    }
  };

  const handleChange = (field, value) => {
    if (field === 'name') {
      setNewName(value);
      setNameError(validateField('name', value));
    } else if (field === 'mobile') {
      setNewMobile(value);
      setMobileError(validateField('mobile', value));
    } else if (field === 'email') {
      setNewEmail(value);
      setEmailError(validateField('email', value));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const nameErr = validateField('name', newName);
    const mobileErr = validateField('mobile', newMobile);
    const emailErr = validateField('email', newEmail);
    if (nameErr || mobileErr || emailErr) {
      setNameError(nameErr);
      setMobileError(mobileErr);
      setEmailError(emailErr);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          mobile: newMobile,
          email: newEmail,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.message === 'Email already in use') {
          setEmailError(data.message);
        } else {
          throw new Error(data.message || 'Failed to update user');
        }
        return;
      }

      setName(newName);
      setMobile(newMobile);
      setEmail(newEmail);
      setEditMode(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-danger text-center mt-5">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
         <h5 className='text-center'>Hello:  {name.toLocaleUpperCase()}</h5>
            <hr/>
        <div className="row align-items-center">
          {/* Profile Info */}
          <div className="col-md-6 border-end">
            <p>Name : {name}</p>
            <p className="text-muted mb-1">Email: {email}</p>
            <p className="text-muted">Mobile : {mobile}</p>
            <button className="btn btn-outline-danger mt-3" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* Editable Form */}
          <div className="col-md-6">
            <h5 className="mb-5">Account Settings</h5>
            {editMode ? (
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className={`form-control ${nameError ? 'is-invalid' : ''}`}
                    value={newName}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                  {nameError && <div className="invalid-feedback">{nameError}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Mobile</label>
                  <input
                    type="tel"
                    className={`form-control ${mobileError ? 'is-invalid' : ''}`}
                    value={newMobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                  />
                  {mobileError && <div className="invalid-feedback">{mobileError}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                    value={newEmail}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                  {emailError && <div className="invalid-feedback">{emailError}</div>}
                </div>
                <div>
                  <button type="submit" className="btn btn-primary me-2" disabled={nameError || mobileError || emailError}>
                    Save
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
