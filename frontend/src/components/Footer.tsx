// Footer.tsx
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEnvelope, FaExternalLinkAlt } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-auto">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="text-center text-md-start">
            <img
              src="/cv2.png"
              alt="NGO Logo"
              style={{ width: "80px", borderRadius: "50%" }}
              className="mb-2"
            />
            <h5 className="fw-bold">NGO Network</h5>
            <p>
              A platform dedicated to connecting Erasmus+ organizations across
              Europe.
            </p>
          </Col>

          <Col md={4}>
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/projects"
                  className="text-light text-decoration-none"
                >
                  Projects <FaExternalLinkAlt size={12} className="ms-1" />
                </Link>
              </li>
              <li>
                <Link
                  to="/organisations"
                  className="text-light text-decoration-none"
                >
                  Organisations <FaExternalLinkAlt size={12} className="ms-1" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-light text-decoration-none">
                  About Erasmus+{" "}
                  <FaExternalLinkAlt size={12} className="ms-1" />
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h6 className="fw-bold">Contact</h6>
            <p>
              <FaEnvelope className="me-2" />
              <a
                href="mailto:contact@ongnetwork.org"
                className="text-light text-decoration-none"
              >
                contact@ongnetwork.org
              </a>
            </p>
          </Col>
        </Row>

        <hr className="border-light" />
        <p className="text-center small mb-0">
          &copy; {year} NGO Network. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
