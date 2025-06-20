import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner, Button, Badge, Card } from "react-bootstrap";

interface Project {
  _id: string;
  name: string;
  description: string;
  infoPackUrl?: string;
  coverImageUrl?: string;
  startDate: string;
  endDate: string;
  deadline?: string;
  location?: string;
  country: string;
  domain: string;
  targetAudience?: string;
  applyUrl?: string;
  objectives?: string[];
  host: {
    _id: string;
    name: string;
    logo?: string;
  };
  partners?: Array<{
    instagram: string;
    country: string;
    organisationRef?: {
      _id: string;
      name: string;
    };
  }>;
}

const ProjectProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${id}`);
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error("Failed to load project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (!project)
    return <div className="text-center text-danger">Project not found</div>;

  const isBeforeDeadline =
    project.deadline && new Date(project.deadline) > new Date();

  return (
    <div className="container py-5">
      <h1>{project.name}</h1>

      <p className="text-muted">
        <strong>Domain:</strong> {project.domain} &nbsp;
        <Badge bg="secondary">{project.country}</Badge>
      </p>

      <p>{project.description}</p>

      {project.coverImageUrl && (
        <img
          src={project.coverImageUrl}
          alt="Cover"
          className="img-fluid rounded shadow-sm mb-4"
        />
      )}

      {project.objectives && project.objectives.length > 0 && (
        <div className="mb-3">
          <h5>Objectives</h5>
          <ul>
            {project.objectives.map((obj, idx) => (
              <li key={idx}>{obj}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-3">
        <p>
          <strong>Location:</strong> {project.location || "—"}
        </p>
        <p>
          <strong>Period:</strong>{" "}
          {new Date(project.startDate).toLocaleDateString()} –{" "}
          {new Date(project.endDate).toLocaleDateString()}
        </p>
        {project.deadline && (
          <p>
            <strong>Apply before:</strong>{" "}
            {new Date(project.deadline).toLocaleDateString()}
          </p>
        )}
        {project.targetAudience && (
          <p>
            <strong>Target group:</strong> {project.targetAudience}
          </p>
        )}
      </div>

      {project.infoPackUrl && (
        <div className="mb-4">
          <Button
            variant="outline-primary"
            href={project.infoPackUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            📄 See the InfoPack
          </Button>
        </div>
      )}

      <div className="mb-4">
        <h5>Host Organisation</h5>
        {project.host && (
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <Card.Title>
                <Link to={`/organisations/${project.host._id}`}>
                  {project.host.name}
                </Link>
              </Card.Title>
              {project.host.logo && (
                <img
                  src={project.host.logo}
                  alt={project.host.name}
                  style={{ height: "50px" }}
                />
              )}
            </Card.Body>
          </Card>
        )}
      </div>

      {project.partners && project.partners.length > 0 && (
        <div className="mb-4">
          <h5>Partners</h5>
          {project.partners.map((partner, idx) => (
            <Card key={idx} className="mb-2 p-2">
              <Card.Body>
                <p>
                  <strong>Instagram:</strong> {partner.instagram}
                </p>
                <p>
                  <strong>Country:</strong> {partner.country}
                </p>
                {partner.organisationRef && (
                  <p>
                    <strong>Organisation:</strong>{" "}
                    <Link to={`/organisations/${partner.organisationRef._id}`}>
                      {partner.organisationRef.name}
                    </Link>
                  </p>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {isBeforeDeadline && project.applyUrl ? (
        <Button
          variant="success"
          size="lg"
          href={project.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply Here
        </Button>
      ) : (
        <Button variant="secondary" size="lg" disabled>
          Application closed
        </Button>
      )}
    </div>
  );
};

export default ProjectProfilePage;
