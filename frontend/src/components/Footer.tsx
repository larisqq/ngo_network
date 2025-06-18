import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{ backgroundColor: "#2b6777", color: "#ffffff" }}
      className="py-5 mt-auto"
    >
      <Container>
        <Row>
          <Col md={6}>
            <h5 style={{ color: "#ffffff" }}>NGO Network</h5>
            <p className="small mb-0" style={{ color: "#f2f2f2" }}>
              A platform dedicated to connecting Erasmus+ organizations across
              Europe.
            </p>
          </Col>

          <Col md={3}>
            <h6 style={{ color: "#ffffff" }}>Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/projects"
                  style={{ color: "#f2f2f2", textDecoration: "none" }}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/organisations"
                  style={{ color: "#f2f2f2", textDecoration: "none" }}
                >
                  Organisations
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  style={{ color: "#f2f2f2", textDecoration: "none" }}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  style={{ color: "#f2f2f2", textDecoration: "none" }}
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h6 style={{ color: "#ffffff" }}>Contact</h6>
            <p className="mb-1" style={{ color: "#f2f2f2" }}>
              Email: contact@ongnetwork.org
            </p>
          </Col>
        </Row>

        <hr style={{ borderColor: "#c8d8e4" }} className="mt-4" />
        <p className="text-center mb-0 small" style={{ color: "#f2f2f2" }}>
          &copy; {currentYear} ONG Network. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
