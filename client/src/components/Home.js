import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import welcomeImage from '../images/welcome.jpg';

function Home() {
  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
         <h3 className="text-muted">User Authentication System</h3>
        <p className="text-secondary">
          Securely login or register to access your account.
        </p>
        <img
          src={welcomeImage}
          alt="Welcome"
          className="img-fluid"
          style={{ maxHeight: '600px' }}
        />
        {/* <h1 className="display-4 fw-bold text-primary">Welcome</h1> */}
        {/* <h3 className="text-muted">User Authentication System</h3>
        <p className="text-secondary">
          Securely login or register to access your account.
        </p> */}
        {/* <div className="mt-4">
          <a href="/login" className="btn btn-primary me-2">
            Login
          </a>
          <a href="/register" className="btn btn-outline-secondary">
            Register
          </a>
        </div> */}
      </div>
    </div>
  );
}

export default Home;
