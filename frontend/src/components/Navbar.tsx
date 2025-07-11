import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentOrg, setCurrentOrg } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    setCurrentOrg(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-dark" style={{ backgroundColor: "#2b6777" }}>
      <div className="container-fluid d-flex align-items-center justify-content-between py-2 px-3">
        {/* 🔵 Left: Logo + App Name */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img
            src="/ngo.png"
            alt="App Logo"
            style={{
              height: "45px",
              width: "45px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <span className="fw-bold text-light">NGO Network</span>
        </Link>

        {/* Center: Navigation Links */}
        <ul className="nav gap-4 mx-auto align-items-center">
          <li className="nav-item">
            <Link
              className={`nav-link fw-semibold nav-link-custom ${
                isActive("/") ? "active-link" : ""
              }`}
              to="/"
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link fw-semibold nav-link-custom ${
                isActive("/projects") ? "active-link" : ""
              }`}
              to="/projects"
            >
              Opportunities
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link fw-semibold nav-link-custom ${
                isActive("/organisations") ? "active-link" : ""
              }`}
              to="/organisations"
            >
              Organisations
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link fw-semibold nav-link-custom ${
                isActive("/about") ? "active-link" : ""
              }`}
              to="/about"
            >
              About Erasmus+
            </Link>
          </li>
        </ul>

        {/* Dark Mode Toggle */}
        <button
          className={`btn btn-sm ${darkMode ? "btn-light" : "btn-dark"} me-2`}
          onClick={() => setDarkMode((prev) => !prev)}
          title="Toggle dark mode"
        >
          <i className={`bi ${darkMode ? "bi-sun" : "bi-moon"}`}></i>
        </button>

        {/* Right: Auth Section */}
        {!currentOrg ? (
          <div className="d-flex gap-2">
            <Link to="/signup" className="btn-custom-outline me-2">
              <i className="bi bi-person-plus me-1"></i> Sign Up
            </Link>

            <Link to="/login" className="btn-custom-outline">
              <i className="bi bi-box-arrow-in-right me-1"></i> Login
            </Link>
          </div>
        ) : (
          <div className="dropdown d-flex align-items-center">
            {currentOrg.logo ? (
              <img
                src={currentOrg.logo}
                alt="Org Logo"
                className="rounded-circle me-2"
                style={{
                  height: "32px",
                  width: "32px",
                  objectFit: "cover",
                  border: "1px solid white",
                }}
              />
            ) : (
              <i className="bi bi-person-circle text-light fs-4 me-2"></i>
            )}

            <button
              className="btn btn-outline-light btn-sm dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {currentOrg.name}
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              <li>
                <Link
                  className="dropdown-item"
                  to={`/organisations/${currentOrg._id}`}
                >
                  <i className="bi bi-person me-2"></i> See Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/edit-profile">
                  <i className="bi bi-pencil-square me-2"></i> Edit Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/add-project">
                  <i className="bi bi-plus-circle me-2"></i> Add Project
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
