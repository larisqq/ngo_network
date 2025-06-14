
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md bg-primary navbar-dark">
      <div className="container-fluid">
        {/* Partea stângă - Logo */}
        <a className="navbar-brand me-auto" href="#">
          ONG NETWORK
        </a>

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
              <a className="nav-link active" href="#">
                HOME
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                OPPORTUNITIES
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                ORGANISATIONS
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                ABOUT ERASMUS+
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;