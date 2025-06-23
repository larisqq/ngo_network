// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Project, Organisation } from "../types/models";
import ProjectCard from "../components/ProjectCard";
import OrganisationCard from "../components/OrganisationCard";
import * as AOS from "aos";
import "aos/dist/aos.css";
import "../App.css";

const HomePage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    AOS.init({ duration: 1000, once: true });

    const fetchInitialData = async () => {
      try {
        const [projectsRes, orgsRes] = await Promise.all([
          fetch("http://localhost:5000/api/projects"),
          fetch("http://localhost:5000/api/organisations"),
        ]);
        const [projectData, orgData] = await Promise.all([
          projectsRes.json(),
          orgsRes.json(),
        ]);

        setProjects(projectData.slice(0, 6));
        setOrganisations(orgData.slice(0, 6));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInitialData();

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-fluid px-0">
      {/* Hero */}
      <section
        className="hero-section d-flex align-items-center justify-content-center text-white"
        style={{
          height: "70vh",
          backgroundImage: `url('${images[currentImageIndex]}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          className="overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(42, 103, 119, 0.5)",
          }}
        />
        <div className="text-center position-relative" data-aos="fade-up">
          <h1 className="display-3 fw-bold text-white">
            Welcome to NGO Network
          </h1>
          <p className="lead text-light">
            Connecting NGOs across Europe through Erasmus+ projects
          </p>
          <Link to="/about" className="btn btn-outline-light mt-3">
            Learn About Erasmus+
          </Link>
        </div>
      </section>

      {/* Mission */}
      <section className="container py-5">
        <h2 className="mb-4 text-center" data-aos="fade-up">
          Our Mission
        </h2>
        <p className="lead text-center mb-5" data-aos="fade-up">
          We want to facilitate transformative change through non-formal
          education, critical thinking and artistic expression.
        </p>
        <div className="row text-center">
          {[
            {
              icon: "bi-person-circle",
              title: "Inclusion",
              text: "We believe in creating opportunities for everyone, fostering a culture of inclusion...",
            },
            {
              icon: "bi-tree",
              title: "Sustainability",
              text: "Promoting sustainable practices is at the heart of what we do...",
            },
            {
              icon: "bi-lightbulb",
              title: "Non-Formal Education",
              text: "We support the development of critical thinking...",
            },
          ].map((item, idx) => (
            <div
              className="col-md-4 mb-4"
              key={item.title}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <div className="mission-card">
                <i className={`bi ${item.icon} mission-icon`}></i>
                <h5 className="mt-3">{item.title}</h5>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="container py-5">
        <h2 className="mb-4 text-center" data-aos="fade-up">
          Featured Projects
        </h2>
        <div className="row">
          {projects.map((project, index) => (
            <div
              className="col-md-4 mb-4"
              key={project._id}
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
        <div className="text-end">
          <Link to="/projects" className="btn btn-outline-primary">
            See All Projects
          </Link>
        </div>
      </section>

      {/* NGOs */}
      <section className="bg-light py-5">
        <div className="container">
          <h2
            className="mb-4"
            style={{ color: "#2b6777" }}
            data-aos="fade-right"
          >
            Our NGOs
          </h2>
          <div className="row">
            {organisations.map((org, index) => (
              <div
                className="col-md-4 mb-4"
                key={org._id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
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
      </section>

      {/* Gallery */}
      <section className="container py-5">
        <h2 className="mb-4" style={{ color: "#352ab9" }} data-aos="fade-up">
          Gallery
        </h2>
        <div className="row">
          {images.map((img, index) => (
            <div
              className="col-md-4 mb-3"
              key={index}
              data-aos="zoom-in"
              data-aos-delay={(index % 3) * 100}
            >
              <img
                src={img}
                alt={`Gallery ${index + 1}`}
                className="img-fluid rounded shadow-sm"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
