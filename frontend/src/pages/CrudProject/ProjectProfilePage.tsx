import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner, Button, Badge, Card } from "react-bootstrap";
import * as AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "@/context/AuthContext";
import { Project } from "@/types/models";
import { FiCheckSquare } from "react-icons/fi";
import { HiOutlineHome } from "react-icons/hi";
import { FaRegClock } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import DeleteModal from "@/components/DeleteModal";

import { BsGlobe, BsInstagram, BsFacebook } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";

interface ProjectCardProps {
  project: Project;
}

const normalizeUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
};

const ProjectProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentOrg } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

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

  const handleDeleteProject = async (password: string) => {
    if (!project) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${project._id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete project");
      }
      window.location.href = "/projects";
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete project");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (!project)
    return <div className="text-center text-danger">Project not found</div>;

  const objectives = project.objectives ?? [];
  const partners = project.partners ?? [];
  const isBeforeDeadline =
    project.deadline && new Date(project.deadline) > new Date();

  return (
    <>
      <div className="container py-5">
        {/* Title & Tags */}
        <div className="mb-4 text-center" data-aos="fade-up">
          <h1 className="fw-bold">{project.name}</h1>
          <p className="text-muted mb-2">
            <strong>Domain:</strong> {project.domain}
            &nbsp; <Badge bg="secondary">{project.country}</Badge>
          </p>

          {/* Butonul "Edit" vizibil doar pentru host */}

          {currentOrg?._id === project.host._id && (
            <div className="d-flex gap-3 justify-content-center">
              <Link to={`/projects/${project._id}/edit`}>
                <Button variant="primary">
                  <FaEdit /> Edit Project
                </Button>
              </Link>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                🗑 Delete Project
              </Button>
            </div>
          )}
        </div>

        {/* Cover Image */}
        {project.coverImageUrl && (
          <div className="text-center mb-4" data-aos="zoom-in">
            <img
              src={project.coverImageUrl}
              alt="Cover"
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Description */}
        <div className="mb-4" data-aos="fade-up">
          <p className="lead">{project.description}</p>
        </div>

        {/* Objectives */}
        {objectives.length > 0 && (
          <div className="mb-4" data-aos="fade-up">
            <h5 className="text-primary">Objectives</h5>
            <ul className="list-unstyled">
              {objectives.map((obj, idx) => (
                <li key={idx}>
                  {"     "}
                  <FiCheckSquare
                    style={{ fontSize: "1.3 em", verticalAlign: "middle" }}
                  />

                  {obj}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Details */}
        <div className="mb-4" data-aos="fade-up">
          <p>
            <strong>
              {" "}
              <IoLocationSharp
                style={{ fontSize: "1.3em", verticalAlign: "middle" }}
              />
              {" Location"}:{" "}
            </strong>
            {project.location || "—"}
          </p>
          <p>
            <strong>
              <FaRegCalendarAlt
                style={{ fontSize: "1.3em", verticalAlign: "middle" }}
              />{" "}
              Period:
            </strong>{" "}
            {new Date(project.period.start).toLocaleDateString()} –{" "}
            {new Date(project.period.end).toLocaleDateString()}
          </p>
          {project.deadline && (
            <p>
              <strong>
                <FaRegClock
                  style={{ fontSize: "1.3em", verticalAlign: "middle" }}
                />{" "}
                Deadline:
              </strong>{" "}
              {new Date(project.deadline).toLocaleDateString()}
            </p>
          )}
          {project.targetAudience && (
            <p>
              <strong>🎯 Target group:</strong> {project.targetAudience}
            </p>
          )}
        </div>

        {/* InfoPack */}
        {project.infoPackUrl && (
          <div className="mb-4" data-aos="fade-up">
            <Button
              variant="outline-primary"
              href={normalizeUrl(project.infoPackUrl)}
              target="_blank"
              rel="noopener noreferrer"
            >
              📄 View InfoPack
            </Button>
          </div>
        )}

        {/* Host Organisation */}
        <div className="mb-4" data-aos="fade-up">
          <h5>
            <HiOutlineHome /> Host Organisation
          </h5>
          <Card className="p-3 shadow-sm border-0">
            <Card.Body className="d-flex align-items-center">
              {project.host.logo && (
                <img
                  src={project.host.logo}
                  alt={project.host.name}
                  style={{ height: "50px", marginRight: "1rem" }}
                />
              )}
              <Card.Title className="mb-0">
                <Link to={`/organisations/${project.host._id}`}>
                  {project.host.name}
                </Link>
              </Card.Title>
            </Card.Body>
          </Card>
        </div>

        {/* Partners Section */}
        {partners.length > 0 && (
          <div className="mb-4" data-aos="fade-up">
            <h5>🤝 Project Partners</h5>
            {partners.map((partner, idx) => {
              // ✅ Tip 1: ONG înregistrat
              if ("organisationRef" in partner && partner.organisationRef) {
                return (
                  <Link
                    key={idx}
                    to={`/organisations/${partner.organisationRef._id}`}
                    className="text-decoration-none text-dark"
                  >
                    <Card className="mb-2 p-2 shadow-sm border-0">
                      <Card.Body>
                        <h6 className="mb-1">
                          {partner.organisationRef.name}
                          <Badge bg="success" className="ms-2">
                            Registered NGO
                          </Badge>
                        </h6>
                        {partner.instagram && (
                          <p className="mb-1">
                            <strong>
                              <BsInstagram /> Instagram:
                            </strong>{" "}
                            {partner.instagram}
                          </p>
                        )}
                        <p className="mb-0">
                          <strong>Country:</strong>{" "}
                          {partner.organisationRef.baseCountry}
                        </p>
                      </Card.Body>
                    </Card>
                  </Link>
                );
              }

              // ✅ Tip 2: ONG neînregistrat (are `name`, `instagram`)
              if ("name" in partner && partner.name) {
                return (
                  <Card key={idx} className="mb-2 p-2 shadow-sm border-0">
                    <Card.Body>
                      <h6 className="mb-1">
                        {partner.name}
                        <Badge bg="warning" text="dark" className="ms-2">
                          Not Registered
                        </Badge>
                      </h6>
                      {partner.instagram && (
                        <p className="mb-1">
                          <strong>
                            <BsInstagram /> Instagram:
                          </strong>{" "}
                          {partner.instagram}
                        </p>
                      )}
                      <p className="mb-0">
                        <strong>Country:</strong> {partner.baseCountry}
                      </p>
                    </Card.Body>
                  </Card>
                );
              }

              // ✅ Tip 3: Țară parteneră (doar `baseCountry`)
              return (
                <Card key={idx} className="mb-2 p-2 shadow-sm border-0">
                  <Card.Body>
                    <h6 className="mb-1">
                      🌍 {partner.baseCountry}
                      <Badge bg="info" className="ms-2">
                        Partner Country
                      </Badge>
                    </h6>
                    <p className="mb-0 text-muted">
                      No associated organisation
                    </p>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        )}

        {/* Apply Button */}
        <div className="text-center mt-4" data-aos="fade-up">
          {isBeforeDeadline && project.applyLink ? (
            <Button
              variant="success"
              size="lg"
              href={project.applyLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              ✅ Apply Now
            </Button>
          ) : (
            <Button variant="secondary" size="lg" disabled>
              ❌ Application Closed
            </Button>
          )}
        </div>
      </div>
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProject}
        loading={deleteLoading}
        error={deleteError}
        title="Delete Project"
        message="Are you sure you want to permanently delete this project? This action cannot be undone."
        confirmLabel="Delete Project"
      />
    </>
  );
};

export default ProjectProfilePage;
