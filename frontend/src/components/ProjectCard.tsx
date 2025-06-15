import { Card } from 'react-bootstrap';

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  country: string; // e.g., 'RO', 'MD'
  domain: string; // e.g., 'education', 'well-being'
  host: {
    id: string;
    name: string;
    logo?: string;
  };
  partners?: Array<{
    id: string;
    name: string;
  }>;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title>{project.name}</Card.Title>

        <Card.Text className="text-muted">
          <strong>Domain:</strong> {project.domain}
        </Card.Text>

        <Card.Text className="text-muted">
          <strong>Period:</strong>{' '}
          {new Date(project.startDate).toLocaleDateString()} – {new Date(project.endDate).toLocaleDateString()}
        </Card.Text>

        <Card.Text className="text-muted">
          <strong>Country:</strong> {project.country}
        </Card.Text>

        <Card.Text>{project.description}</Card.Text>

        {project.host && (
          <Card.Text className="text-muted small">
            <strong>Host organisation:</strong> {project.host.name}
          </Card.Text>
        )}

        {project.partners && project.partners.length > 0 && (
          <Card.Text className="text-muted small">
            <strong>Partners:</strong> {project.partners.map(p => p.name).join(', ')}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProjectCard;