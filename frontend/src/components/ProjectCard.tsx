import { Project } from "../types/models";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link
      to={`/projects/${project._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
      data-aos="zoom-in"
    >
      <Card className="h-100 shadow-sm rounded overflow-hidden project-card border-0">
        {/* Cover Image */}
        {project.coverImageUrl && (
          <div style={{ height: "180px", overflow: "hidden" }}>
            <Card.Img
              src={project.coverImageUrl}
              alt={`${project.name} cover`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        <Card.Body className="d-flex flex-column">
          {/* Host Logo */}
          {project.host?.logo && (
            <div className="text-center mb-2">
              <img
                src={project.host.logo}
                alt={project.host.name}
                style={{ height: "40px", objectFit: "contain" }}
              />
            </div>
          )}

          {/* Title */}
          <Card.Title className="text-primary fw-bold mb-2 text-center">
            {project.name}
          </Card.Title>

          {/* Description */}
          <Card.Text className="text-muted mb-2 text-center small">
            {truncateText(project.description, 100)}
          </Card.Text>

          {/* Info */}
          <div className="text-muted small mb-2">
            <div>
              <strong>Domain:</strong> {project.domain}
            </div>
            <div>
              <strong>Country:</strong> {project.country}
            </div>
            <div>
              <strong>Period:</strong>{" "}
              {new Date(project.period.start).toLocaleDateString()} –{" "}
              {new Date(project.period.end).toLocaleDateString()}
            </div>
          </div>

          {/* Host */}
          {project.host && (
            <Card.Text className="text-muted small mb-1">
              <strong>Host:</strong> {project.host.name}
            </Card.Text>
          )}

          {/* Partners */}
          {Array.isArray(project.partners) && project.partners.length > 0 && (
            <div className="mt-2">
              <strong>Partners:</strong>
              {project.partners.map((partner, idx) => {
                const partnerName =
                  "organisationRef" in partner && partner.organisationRef
                    ? partner.organisationRef.name
                    : "name" in partner && partner.name
                    ? partner.name
                    : "Unknown Partner";

                return (
                  <div key={idx} className="text-muted small">
                    • {partnerName}
                  </div>
                );
              })}
            </div>
          )}
        </Card.Body>
      </Card>
    </Link>
  );
};

export default ProjectCard;
