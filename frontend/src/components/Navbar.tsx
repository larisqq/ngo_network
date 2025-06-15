import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md bg-primary navbar-dark">
      <div className="container-fluid">
        {/* Partea stângă - Logo */}
        <Link className="navbar-brand me-auto" to="/">
          ONG NETWORK
        </Link>

        {/* Buton pentru mobil */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Partea dreaptă - Meniu */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto"> {/* ms-auto = aliniere dreapta */}
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                HOME
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/projects">
                OPPORTUNITIES
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/organisations">
                ORGANISATIONS
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                ABOUT ERASMUS+
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
