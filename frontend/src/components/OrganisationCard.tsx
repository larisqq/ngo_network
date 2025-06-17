import { Organisation } from '../types/models';

import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';


interface OrganisationCardProps {
  organisation: Organisation; 
}

const OrganisationCard = ({ organisation }: OrganisationCardProps) => (
  <Link to={`/organisations/${organisation._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <Card className="h-100 shadow-sm">
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
  </Link>
);

export default OrganisationCard;
