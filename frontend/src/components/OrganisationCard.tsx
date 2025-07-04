import { Organisation } from "../types/models";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

interface OrganisationCardProps {
  organisation: Organisation;
}

// (optional) Truncate descrierea
const truncateText = (text: string, maxLength: number) =>
  text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

const OrganisationCard = ({ organisation }: OrganisationCardProps) => (
  <Link
    to={`/organisations/${organisation._id}`}
    style={{ textDecoration: "none", color: "inherit" }}
  >
    <Card className="h-100 shadow-sm organisation-card">
      {organisation.logo && (
        <Card.Img
          variant="top"
          src={organisation.logo}
          style={{ height: "250px", objectFit: "cover" }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{organisation.name}</Card.Title>

        <Card.Text className="flex-grow-1">
          {organisation.description
            ? truncateText(organisation.description, 150)
            : "No description"}
        </Card.Text>

        <Card.Text className="text-muted small">
          {organisation.socialMedia?.instagram
            ? `Instagram: ${organisation.socialMedia.instagram}`
            : ""}
        </Card.Text>
      </Card.Body>
    </Card>
  </Link>
);

export default OrganisationCard;
