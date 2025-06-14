import { Card } from 'react-bootstrap';

interface Organisation {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
  contact: {
    email: string;
    phone?: string;
  };
}

interface OrgCardProps {
  organisation: Organisation; 
}

const OrgCard = ({ organisation }: OrgCardProps) => (
  <Card className="h-100">
    {organisation.logo && (
      <Card.Img variant="top" src={organisation.logo} style={{ height: '250px', objectFit: 'cover' }} />
    )}
    <Card.Body>
      <Card.Title>{organisation.name}</Card.Title>
      <Card.Text>{organisation.description || 'No description'}</Card.Text>
      <Card.Text className="text-muted small">
        {organisation.contact.email}
      </Card.Text>
    </Card.Body>
  </Card>
);

export default OrgCard;