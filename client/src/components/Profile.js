import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user data');
        }
        setName(data.name);
        setMobile(data.mobile);
        setEmail(data.email);
        setNewEmail(data.email);
      } catch (error) {
        setError(error.message);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email: newEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update email');
      }
      setEmail(newEmail);
      setEditMode(false);
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="card p-4 w-50">
      <h2>Hello, {name.toLocaleUpperCase()}</h2>
      <hr/>
      <p>Name: {name}</p>
      <p>Mobile: {mobile}</p>
      <p>Email :  {email}</p>
      {editMode ? (
        <form onSubmit={handleUpdateEmail}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="New Email"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary me-2">Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
        </form>
      ) : (
        <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit Email</button>
      )}
      <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;