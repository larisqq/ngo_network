import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Spinner, Alert, Badge, ListGroup } from "react-bootstrap";

interface ProjectPreview {
  id: string;
  name: string;
  deadline: string;
  country?: string;
}

interface Organisation {
  id: string;
  name: string;
  logo: string;
  description: string;
  domains: string[];
  hostedProjects: ProjectPreview[];
  partnerIn: ProjectPreview[];
}

const OrganisationProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [org, setOrg] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrganisation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/organisations/${id}`
        );
        setOrg(response.data);
      } catch (err) {
        console.error("Error loading organisation:", err);
        setError("Could not load organisation details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisation();
  }, [id]);

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto my-5" />;

  if (error)
    return (
      <Alert variant="danger" className="text-center my-4">
        {error}
      </Alert>
    );

  if (!org)
    return (
      <Alert variant="warning" className="text-center my-4">
        Organisation not found
      </Alert>
    );

  return (
    <div className="container py-5">
      <div className="row">
        {/* LEFT: Organisation Info */}
        <div className="col-md-4 mb-4">
          <div className="card sticky-top" style={{ top: "20px" }}>
            <img
              src={org.logo}
              alt={`${org.name} logo`}
              className="card-img-top p-3"
            />
            <div className="card-body">
              <h2 className="h4">{org.name}</h2>
              <div className="mb-3">
                {org.domains.map((domain) => (
                  <Badge key={domain} bg="primary" className="me-1">
                    {domain}
                  </Badge>
                ))}
              </div>
              <p className="card-text">{org.description}</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Projects */}
        <div className="col-md-8">
          {/* Hosted Projects */}
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="h5 mb-0">Projects Organised by This NGO</h3>
            </div>
            <ListGroup variant="flush">
              {org.hostedProjects.length > 0 ? (
                org.hostedProjects.map((project) => (
                  <ListGroup.Item
                    key={project.id}
                    as={Link}
                    to={`/projects/${project.id}`}
                    action
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{project.name}</strong>
                        {project.country && (
                          <span className="ms-2 badge bg-light text-dark">
                            {project.country}
                          </span>
                        )}
                      </div>
                      <small className="text-muted">
                        Deadline:{" "}
                        {project.deadline
                          ? new Date(project.deadline).toLocaleDateString()
                          : "—"}
                      </small>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-muted">
                  No hosted projects
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>

          {/* Partner Projects */}
          <div className="card mb-4">
            <div className="card-header bg-secondary text-white">
              <h3 className="h5 mb-0">Projects Where This NGO is a Partner</h3>
            </div>
            <ListGroup variant="flush">
              {org.partnerIn.length > 0 ? (
                org.partnerIn.map((project) => (
                  <ListGroup.Item
                    key={project.id}
                    as={Link}
                    to={`/projects/${project.id}`}
                    action
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{project.name}</strong>
                        {project.country && (
                          <span className="ms-2 badge bg-light text-dark">
                            {project.country}
                          </span>
                        )}
                      </div>
                      <small className="text-muted">
                        Deadline:{" "}
                        {project.deadline
                          ? new Date(project.deadline).toLocaleDateString()
                          : "—"}
                      </small>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-muted">
                  No partner projects
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganisationProfile;
