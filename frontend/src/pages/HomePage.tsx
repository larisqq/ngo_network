// src/pages/Home.tsx
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const HomePage = () => {
  return (
    <div className="container py-5">
      <div className="jumbotron bg-light p-5 rounded">
        <h1 className="display-4">Welcome to ONG Network</h1>
        <p className="lead">
          The platform that connects NGOs with Erasmus+ collaboration opportunities.
        </p>
        <hr className="my-4" />
        <p>
          Discover educational projects, find partners, and promote your NGO.
        </p>
        <div className="d-grid gap-2 d-md-flex mb-4">
          <Link to="/organisations" className="btn btn-primary me-md-2">See Organisations</Link>
          <Link to="/projects" className="btn btn-outline-primary">Available Projects</Link>
        </div>

        {/* NEW: Auth section */}
        <div className="auth-buttons text-center">
          <h4>Are you an NGO?</h4>
          <p>Create an account or log in to post your projects.</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/signup" className="btn btn-success">Sign Up</Link>
            <Link to="/login" className="btn btn-outline-secondary">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
