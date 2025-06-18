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
  }, []);

  return (
    <div className="container-fluid px-0">
      {/* Hero Section */}
      <div
        className="hero-section d-flex align-items-center justify-content-center text-white"
        style={{
          height: "70vh",
          backgroundImage: `url('/assets/hero.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center">
          <h1 className="display-3 fw-bold">Welcome to ONG Network</h1>
          <p className="lead">
            Connecting NGOs across Europe through Erasmus+ projects
          </p>
          <Link to="/about" className="btn btn-outline-light mt-3">
            Learn About Erasmus+
          </Link>
        </div>
      </div>

      {/* Project Highlights */}
      <div className="container py-5">
        <h2 className="mb-4">Featured Projects</h2>
        <div className="row">
          {projects.map((project) => (
            <div className="col-md-4 mb-4" key={project._id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
        <div className="text-end">
          <Link to="/projects" className="btn btn-outline-primary">
            See All Projects
          </Link>
        </div>
      </div>

      {/* Organisation Highlights */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="mb-4">Our NGOs</h2>
          <div className="row">
            {organisations.map((org) => (
              <div className="col-md-4 mb-4" key={org._id}>
                <OrganisationCard organisation={org} />
              </div>
            ))}
          </div>
          <div className="text-end">
            <Link to="/organisations" className="btn btn-outline-primary">
              See All Organisations
            </Link>
          </div>
        </div>
      </div>

      {/* Gallery Section Placeholder */}
      <div className="container py-5">
        <h2 className="mb-4">Gallery</h2>
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
