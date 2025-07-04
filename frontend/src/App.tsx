import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import * as AOS from "aos";
import "aos/dist/aos.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

import HomePage from "./pages/HomePage";
import OrganisationsPage from "./pages/Orgs";
import ProjectsPage from "./pages/ProjectsPage";
import OrganisationProfile from "./pages/OrgProfile";
import ProjectProfilePage from "./pages/CrudProject/ProjectProfilePage";
import AddProjectPage from "./pages/CrudProject/AddProjectPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import LoginPage from "./pages/Auth/LoginPage";
import VerifyPage from "./pages/Auth/VerifyPage";
import EditProfile from "./pages/CrudOrganisation/EditProfilePage";
import AboutPage from "./pages/AboutPage";
import EditProjectPage from "./pages/CrudProject/EditProject";

import "./App.css";

function App() {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="container my-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/organisations" element={<OrganisationsPage />} />
          <Route path="/organisations/:id" element={<OrganisationProfile />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectProfilePage />} />
          <Route path="/add-project" element={<AddProjectPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects/:id/edit" element={<EditProjectPage />} />
        </Routes>
      </div>
      <BackToTop />
      <Footer />
    </Router>
  );
}

export default App;
