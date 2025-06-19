// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Project, Organisation } from "../types/models";
import ProjectCard from "../components/ProjectCard";
import OrganisationCard from "../components/OrganisationCard";
import "../App.css";

const HomePage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);

  // State pentru a schimba pozele dinamic
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array cu imagini
  const images = [
    "/assets/gallery1.jpg",
    "/assets/gallery3.jpg",
    "/assets/gallery4.jpg",
    "/assets/gallery5.jpg",
    "/assets/gallery6.jpg",
    "/assets/gallery7.jpg",
    "/assets/gallery8.jpg",
    "/assets/gallery9.jpg",
    "/assets/gallery10.jpg",
    "/assets/gallery11.jpg",
    "/assets/gallery12.jpg",
    "/assets/gallery13.jpg",
    "/assets/gallery14.jpg",
    "/assets/gallery15.jpg",
    "/assets/gallery16.jpg",
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const projectRes = await fetch("http://localhost:5000/api/projects");
        const projectData: Project[] = await projectRes.json();
        setProjects(projectData.slice(0, 6));

        const orgRes = await fetch("http://localhost:5000/api/organisations");
        const orgData: Organisation[] = await orgRes.json();
        setOrganisations(orgData.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch data for homepage:", error);
      }
    };

    fetchInitialData();

    // Setăm intervalul pentru a schimba imaginea la fiecare 5 secunde
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    // Curățăm intervalul la dezasamblarea componentelor
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-fluid px-0">
      {/* Hero Section */}
      <div
        className="hero-section d-flex align-items-center justify-content-center text-white"
        style={{
          height: "70vh",
          backgroundImage: `url('${images[currentImageIndex]}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* Overlay pentru text mai vizibil */}
        <div
          className="overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(42, 103, 119, 0.5)", // Folosim culoarea #2b6777 ca overlay
          }}
        ></div>
        <div className="text-center position-relative">
          <h1 className="display-3 fw-bold" style={{ color: "#ffffff" }}>
            Welcome to NGO Network
          </h1>
          <p className="lead" style={{ color: "#f2f2f2" }}>
            Connecting NGOs across Europe through Erasmus+ projects
          </p>
          <Link
            to="/about"
            className="btn btn-outline-light mt-3"
            style={{ borderColor: "#c8d8e4", color: "#c8d8e4" }}
          >
            Learn About Erasmus+
          </Link>
        </div>
      </div>
      {/* Our Mission Section */}
      <div className="container py-5">
        <h2 className="mb-4 text-center">Our Mission</h2>
        <p className="lead text-center mb-5">
          We want to facilitate transformative change through non-formal
          education, critical thinking and artistic expression.
        </p>
        <div className="row text-center">
          {/* Includere */}
          <div className="col-md-4 mb-4">
            <div className="mission-card">
              <i className="bi bi-person-circle mission-icon"></i>
              <h5 className="mt-3">Inclusion</h5>
              <p>
                We believe in creating opportunities for everyone, fostering a
                culture of inclusion where diverse voices are heard and
                respected.
              </p>
            </div>
          </div>

          {/* Sustenabilitate */}
          <div className="col-md-4 mb-4">
            <div className="mission-card">
              <i className="bi bi-tree mission-icon"></i>
              <h5 className="mt-3">Sustainability</h5>
              <p>
                Promoting sustainable practices is at the heart of what we do.
                We aim to ensure a better future for all through environmentally
                responsible actions.
              </p>
            </div>
          </div>

          {/* Educatie Nonformala */}
          <div className="col-md-4 mb-4">
            <div className="mission-card">
              <i className="bi bi-lightbulb mission-icon"></i>
              <h5 className="mt-3">Non-Formal Education</h5>
              <p>
                We support the development of critical thinking through
                non-formal education, empowering individuals to think creatively
                and act confidently.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Highlights */}
      <div className="container py-5">
        <h2 className="mb-4" style={{ color: "#352ab9" }}>
          Featured Projects
        </h2>
        <div className="row">
          {projects.map((project) => (
            <div className="col-md-4 mb-4" key={project._id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
        <div className="text-end">
          <Link
            to="/projects"
            className="btn btn-outline-primary"
            style={{ borderColor: "#352ab9", color: "#352ab9" }}
          >
            See All Projects
          </Link>
        </div>
      </div>

      {/* Organisation Highlights */}
      <div className="bg-light py-5" style={{ backgroundColor: "#f2f2f2" }}>
        <div className="container">
          <h2 className="mb-4" style={{ color: "#2b6777" }}>
            Our NGOs
          </h2>
          <div className="row">
            {organisations.map((org) => (
              <div className="col-md-4 mb-4" key={org._id}>
                <OrganisationCard organisation={org} />
              </div>
            ))}
          </div>
          <div className="text-end">
            <Link
              to="/organisations"
              className="btn btn-outline-primary"
              style={{ borderColor: "#352ab9", color: "#352ab9" }}
            >
              See All Organisations
            </Link>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container py-5">
        <h2 className="mb-4" style={{ color: "#352ab9" }}>
          Gallery
        </h2>
        <div className="row">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((i) => (
            <div className="col-md-4 mb-3" key={i}>
              <img
                src={`/assets/gallery${i}.jpg`}
                alt={`Gallery ${i}`}
                className="img-fluid rounded shadow-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
