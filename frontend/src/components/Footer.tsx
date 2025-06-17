import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6}>
            <h5>NGO Network</h5>
            <p className="small mb-0">
              A platform dedicated to connecting Erasmus+ organizations across Europe.
            </p>
          </Col>

          <Col md={3}>
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/projects" className="text-light">Projects</a></li>
              <li><a href="/organisations" className="text-light">Organisations</a></li>
              <li><a href="/login" className="text-light">Login</a></li>
              <li><a href="/signup" className="text-light">Sign Up</a></li>
            </ul>
          </Col>

          <Col md={3}>
            <h6>Contact</h6>
            <p className="mb-1">Email: contact@ongnetwork.org</p>
          </Col>
        </Row>

        <hr className="border-light mt-4" />
        <p className="text-center mb-0 small">
          &copy; {currentYear} ONG Network. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
