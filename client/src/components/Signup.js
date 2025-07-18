import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobile, email, password }),
    });
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="card p-4 w-50">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        </div>
        <div className="mb-3">
          <input type="tel" className="form-control" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile" required />
        </div>
        <div className="mb-3">
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        </div>
        <button type="submit" className="btn btn-primary">Signup</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
      <p className="mt-3">If user already registered? <Link to="/login">Click here</Link> to Login.</p>
    </div>
  );
}

export default Signup;