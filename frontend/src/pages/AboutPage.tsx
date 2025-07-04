import { useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import * as AOS from "aos";
import "aos/dist/aos.css";

const AboutPage = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <Container className="my-5">
      <div className="text-center mb-4" data-aos="fade-up">
        <h1 className="fw-bold">Erasmus+ Essentials</h1>
        <p className="lead text-muted">
          Whether you already run an NGO, want to start one, or just want to get
          involved in Erasmus+ projects — this page is for you.
        </p>
      </div>

      {/* What is Erasmus+ */}
      <Card className="mb-4 shadow-sm border-0" data-aos="fade-up">
        <Card.Body>
          <Card.Title className="fs-4 mb-3">📘 What is Erasmus+?</Card.Title>
          <ul>
            <li>EU programme for education, training, youth, and sport.</li>
            <li>
              Open to NGOs, educational institutions, local authorities, youth
              groups, and more.
            </li>
            <li>
              Supports international mobility, job shadowing, youth exchanges,
              training, strategic partnerships, etc.
            </li>
          </ul>
        </Card.Body>
      </Card>

      {/* Why it matters for NGOs */}
      <Card className="mb-4 shadow-sm border-0" data-aos="fade-up">
        <Card.Body>
          <Card.Title className="fs-4 mb-3">🌟 Why NGOs Should Care</Card.Title>
          <ul>
            <li>Access to EU funding for impactful projects.</li>
            <li>Skill development for staff and volunteers.</li>
            <li>International networking and recognition.</li>
            <li>Opportunities to host or send participants abroad.</li>
            <li>
              Support for inclusion, digitalization, green transition, and civic
              participation.
            </li>
          </ul>
        </Card.Body>
      </Card>

      {/* Types of Actions */}
      <Card className="mb-4 shadow-sm border-0" data-aos="fade-up">
        <Card.Body>
          <Card.Title className="fs-4 mb-3">🔧 Key Erasmus+ Actions</Card.Title>
          <ul>
            <li>
              <strong>KA1</strong> – Mobility: youth exchanges, training
              courses, job shadowing.
            </li>
            <li>
              <strong>KA2</strong> – Cooperation partnerships on shared themes.
            </li>
            <li>
              <strong>ESC</strong> – European Solidarity Corps: international
              volunteering.
            </li>
            <li>
              <strong>KA3</strong> – Democratic participation and youth policy
              initiatives.
            </li>
          </ul>
        </Card.Body>
      </Card>

      {/* Who Can Apply */}
      <Card className="mb-4 shadow-sm border-0" data-aos="fade-up">
        <Card.Body>
          <Card.Title className="fs-4 mb-3">📝 Who Can Apply?</Card.Title>
          <ul>
            <li>Registered NGOs with a tax ID and bank account.</li>
            <li>Informal youth groups (with a host organization).</li>
            <li>New NGOs if administrative criteria are met.</li>
          </ul>
        </Card.Body>
      </Card>

      {/* How to Start If You Have an NGO */}
      <Card className="mb-4 shadow-sm border-0" data-aos="fade-up">
        <Card.Body>
          <Card.Title className="fs-4 mb-3">
            🚀 Getting Started with an NGO
          </Card.Title>
          <ul>
            <li>Register your NGO in the EU Funding & Tenders Portal.</li>
            <li>Get a PIC (Participant Identification Code).</li>
            <li>Look for open project calls.</li>
            <li>Build a consortium (at least 2–3 countries).</li>
            <li>Write a clear proposal aligned with Erasmus+ priorities.</li>
          </ul>
        </Card.Body>
      </Card>

      {/* How to Join Without an NGO */}
      <Card className="mb-4 shadow-sm border-0" data-aos="fade-up">
        <Card.Body>
          <Card.Title className="fs-4 mb-3">🙋 Join Without an NGO?</Card.Title>
          <ul>
            <li>Find local NGOs implementing Erasmus+ projects.</li>
            <li>Apply as a participant (form, CV, motivation).</li>
            <li>Join as an ESC volunteer or youth exchange participant.</li>
            <li>
              Start an informal youth group and create your own NGO later.
            </li>
          </ul>
        </Card.Body>
      </Card>

      {/* Resources */}
      <Card className="mb-4 shadow-sm border-0" data-aos="fade-up">
        <Card.Body>
          <Card.Title className="fs-4 mb-3">📚 Useful Resources</Card.Title>
          <ul>
            <li>
              <a
                href="https://ec.europa.eu/info/funding-tenders"
                target="_blank"
                rel="noopener noreferrer"
              >
                EU Funding & Tenders Portal
              </a>
            </li>
            <li>
              <a
                href="https://erasmus-plus.ec.europa.eu/resources-and-tools/distance-calculator"
                target="_blank"
                rel="noopener noreferrer"
              >
                EU Distance Calculator
              </a>
            </li>
            <li>
              <a
                href="https://erasmus-plus.ec.europa.eu/programme-guide"
                target="_blank"
                rel="noopener noreferrer"
              >
                Erasmus+ Programme Guide
              </a>
            </li>
            <li>
              <a
                href="https://www.salto-youth.net/"
                target="_blank"
                rel="noopener noreferrer"
              >
                SALTO Resource Portal
              </a>
            </li>
            <li>
              <a
                href="https://www.salto-youth.net/tools/otlas-partner-finding/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Otlas Partner Finding Tool
              </a>
            </li>
          </ul>
        </Card.Body>
      </Card>

      {/* Tips */}
      <Card className="mb-4 shadow-sm border-0" data-aos="fade-up">
        <Card.Body>
          <Card.Title className="fs-4 mb-3">💡 Practical Tips</Card.Title>
          <ul>
            <li>Watch deadlines! Calls are published on strict calendars.</li>
            <li>Proposals are written in English.</li>
            <li>You need a strong and engaged partnership.</li>
            <li>
              Make sure your project meets at least one Erasmus+ priority.
            </li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AboutPage;
