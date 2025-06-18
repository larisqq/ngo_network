import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <Container className="my-5">
      <h1 className="mb-4">About Erasmus+</h1>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>What is Erasmus+?</Card.Title>
          <Card.Text>
            Erasmus+ is the European Union’s flagship programme supporting education, training, youth, and sport. It enables mobility and cross-border cooperation projects for students, staff, and youth workers.
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Funding Overview</Card.Title>
          <Card.Text>
            Participants can receive travel grants, daily allowances, and additional support based on distance and individual needs. Green travel and inclusion measures are also available.
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>How to Estimate Your Grant</Card.Title>
          <ul>
            <li>Use the official EU Distance Calculator to determine your distance band.</li>
            <li>Check your National Agency’s funding rates (e.g., €180–€360 depending on distance).</li>
            <li>Daily allowances vary, usually €60–180/day.</li>
            <li>Green travel: get extra days and/or bonus.</li>
          </ul>
          <Button variant="primary" href="https://erasmus-plus.ec.europa.eu/resources-and-tools/distance-calculator" target="_blank" rel="noopener noreferrer">
            EU Distance Calculator
          </Button>
        </Card.Body>
      </Card>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Grant Simulator</Card.Title>
          <Card.Text>
            Use a free simulator to get an idea of your potential funding amount based on your location and project duration.
          </Card.Text>
          <Button variant="success" href="https://erasmusgeneration.org/grant-simulator" target="_blank" rel="noopener noreferrer">
            Erasmus+ Grant Simulator
          </Button>
        </Card.Body>
      </Card>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Reimbursement & Timeline</Card.Title>
          <Card.Text>
            Most projects require proof of travel and participation. Grants are usually paid in installments (e.g., 70% upfront, 30% after completion). Always coordinate with your National Agency or university.
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Useful Links</Card.Title>
          <ul>
            <li><a href="https://erasmus-plus.ec.europa.eu/resources-and-tools/distance-calculator" target="_blank" rel="noopener noreferrer">EU Distance Calculator</a></li>
            <li><a href="https://erasmus-plus.ec.europa.eu/programme-guide/part-c/financial-conditions" target="_blank" rel="noopener noreferrer">Financial Conditions</a></li>
            <li><a href="https://wikis.ec.europa.eu/spaces/NAITDOC/pages/139690832/Funded+travel+days+and+Travel+grant+or+Travel+support" target="_blank" rel="noopener noreferrer">Green Travel Info</a></li>
            <li><a href="https://erasmusgeneration.org/grant-simulator" target="_blank" rel="noopener noreferrer">Grant Simulator</a></li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AboutPage;