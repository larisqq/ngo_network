import * as React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="container py-5">
      <div className="jumbotron bg-light p-5 rounded">
        <h1 className="display-4">Welcome on ONG Network</h1>
        <p className="lead">
          The platform that connects non-governmental organizations with Erasmus+ projects
        </p>
        <hr className="my-4" />
        <p>
          Discover collaboration opportunities and educational projects.
        </p>
        <div className="d-grid gap-2 d-md-flex">
          <Link to="/organisations" className="btn btn-primary btn-lg me-md-2">
            See Organisations
          </Link>
          <Link to="/projects" className="btn btn-outline-primary btn-lg">
            Available Projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;