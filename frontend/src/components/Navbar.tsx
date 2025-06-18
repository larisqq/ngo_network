import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const logo = localStorage.getItem("orgLogo");
    setIsLoggedIn(!!token);
    setLogoUrl(logo || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("orgLogo");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-md navbar-dark"
      style={{ backgroundColor: "#2b6777" }}
    >
      <div className="container-fluid">
        <Link
          className="navbar-brand me-auto d-flex align-items-center gap-2"
          to="/"
        >
          <img
            src="/cv2.png"
            alt="Globe Logo"
            style={{
              height: "50px",
              width: "50px",
              borderRadius: "70%",
              objectFit: "contain",
            }}
          />
          <span className="fw-bold text-light">NGO NETWORK</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/">
                HOME
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/projects">
                OPPORTUNITIES
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/organisations">
                ORGANISATIONS
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/about">
                ABOUT ERASMUS+
              </Link>
            </li>

            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/signup">
                    Sign Up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/login">
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <div
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Profile"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <i className="bi bi-person-circle fs-3 text-light"></i>
                  )}
                </div>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/edit-profile">
                      Edit Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/add-project">
                      Add Project
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
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
