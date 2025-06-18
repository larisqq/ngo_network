import { Project } from '../types/models';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link to={`/projects/${project._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card className="h-100 shadow-sm project-card">
        <Card.Body className="d-flex flex-column">
          <Card.Title>{project.name}</Card.Title>

          <Card.Text className="text-muted mb-1">
            <strong>Domain:</strong> {project.domain}
          </Card.Text>

          <Card.Text className="text-muted mb-1">
            <strong>Period:</strong>{' '}
            {new Date(project.startDate).toLocaleDateString()} – {new Date(project.endDate).toLocaleDateString()}
          </Card.Text>

          <Card.Text className="text-muted mb-1">
            <strong>Country:</strong> {project.country}
          </Card.Text>

          <Card.Text className="flex-grow-1">
            {truncateText(project.description, 150)}
          </Card.Text>

          {project.host && (
            <Card.Text className="text-muted small mb-1">
              <strong>Host organisation:</strong> {project.host.name}
            </Card.Text>
          )}

          {project.partners && project.partners.length > 0 && (
            <Card.Text className="text-muted small mb-0">
              <strong>Partners:</strong> {project.partners.map(p => p.name).join(', ')}
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </Link>
  );
};

export default ProjectCard;
