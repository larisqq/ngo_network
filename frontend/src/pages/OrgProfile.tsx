import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Spinner,
  Alert,
  Badge,
  ListGroup,
  Card,
  Button,
} from "react-bootstrap";
import { BsInstagram, BsFacebook, BsGlobe } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import DeleteModal from "@/components/DeleteModal";
import { Organisation } from "../types/models";

const OrganisationProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentOrg, setCurrentOrg } = useAuth();

  const [org, setOrg] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleDeleteProfile = async (password: string) => {
    if (!id) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await axios.delete(`http://localhost:5000/api/organisations/${id}`, {
        data: { password },
        withCredentials: true,
      });
      setCurrentOrg(null);
      navigate("/");
    } catch (err: any) {
      console.error("Delete error:", err);
      setDeleteError(
        err?.response?.data?.error || "Failed to delete organisation."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

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
      {/* Card cu detalii ONG */}
      <Card className="mb-4 p-3">
        <div className="d-flex align-items-start">
          {org.logo && (
            <img
              src={org.logo}
              alt={`${org.name} logo`}
              className="img-fluid me-3"
              style={{ maxWidth: "120px", borderRadius: "0.5rem" }}
            />
          )}
          <div>
            <h2 className="h5">{org.name}</h2>
            <p>{org.description}</p>

            <div className="mb-3">
              {org.domains.map((domain) => (
                <Badge key={domain} bg="primary" className="me-1">
                  {domain}
                </Badge>
              ))}
            </div>

            <div className="d-flex gap-2 flex-wrap">
              {org.socialMedia?.instagram && (
                <a
                  href={`https://instagram.com/${org.socialMedia.instagram.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-danger btn-sm d-flex align-items-center"
                >
                  <BsInstagram className="me-1" />
                  Instagram
                </a>
              )}
              {org.socialMedia?.facebook && (
                <a
                  href={`https://facebook.com/${org.socialMedia.facebook.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm d-flex align-items-center"
                >
                  <BsFacebook className="me-1" />
                  Facebook
                </a>
              )}
              {org.socialMedia?.website && (
                <a
                  href={org.socialMedia.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                >
                  <BsGlobe className="me-1" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Proiecte gazduite */}
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          Projects Organised by This NGO
        </Card.Header>
        <ListGroup variant="flush">
          {(org.hostedProjects ?? []).length > 0 ? (
            org.hostedProjects!.map((project: any) => (
              <ListGroup.Item
                key={project._id}
                as={Link}
                to={`/projects/${project._id}`}
                action
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{project.name}</strong>
                    {project.baseCountry && (
                      <span className="ms-2 badge bg-light text-dark">
                        {project.baseCountry}
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
      </Card>

      {/* Proiecte parteneriate */}
      <Card className="mb-4">
        <Card.Header className="bg-secondary text-white">
          Projects Where This NGO is a Partner
        </Card.Header>
        <ListGroup variant="flush">
          {(org.partnerIn ?? []).length > 0 ? (
            org.partnerIn!.map((project: any) => (
              <ListGroup.Item
                key={project._id}
                as={Link}
                to={`/projects/${project._id}`}
                action
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{project.name}</strong>
                    {project.baseCountry && (
                      <span className="ms-2 badge bg-light text-dark">
                        {project.baseCountry}
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
      </Card>

      {/* Buton ștergere - doar dacă e profilul propriu */}
      {currentOrg?._id === org._id && (
        <div className="text-center mt-4">
          <Button
            variant="outline-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Organisation Profile
          </Button>
        </div>
      )}

      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProfile}
        loading={deleteLoading}
        error={deleteError}
        title="Delete Organisation Profile"
        message="This will delete your entire account and hosted projects. This action is irreversible."
        confirmLabel="Delete Profile"
      />
    </div>
  );
};

export default OrganisationProfile;
