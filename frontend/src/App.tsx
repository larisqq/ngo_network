import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import * as AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import OrganisationsPage from "./pages/Orgs";
import ProjectsPage from "./pages/ProjectsPage";
import OrganisationProfile from "./pages/OrgProfile";
import ProjectProfilePage from "./pages/ProjectProfilePage";
import AddProjectPage from "./pages/AddProjectPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import VerifyPage from "./pages/VerifyPage";
import EditProfile from "./pages/EditProfilePage";
import AboutPage from "./pages/AboutPage";

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
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
