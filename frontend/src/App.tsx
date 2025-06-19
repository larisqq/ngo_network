import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage"; // dacă ai o pagină de tip landing/home
import OrganisationsPage from "./pages/Orgs";
import ProjectsPage from "./pages/ProjectsPage";
import OrganisationProfile from "./pages/OrgProfile"; // pagină individuală ONG
import ProjectProfilePage from "./pages/ProjectProfilePage"; // pagină individuală proiect
import AddProjectPage from "./pages/AddProjectPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import VerifyPage from "./pages/VerifyPage"; // pagină pentru verificarea contului
import Footer from "./components/Footer"; // presupunând că ai un component Footer
import EditProfile from "./pages/EditProfilePage"; // pagină pentru editarea profilului utilizatorului
import AboutPage from "./pages/AboutPage"; // pagină despre erasmus
import "./App.css";

import TestUploadPage from "./pages/TestUploadPage"; // pagină pentru testarea încărcării fișierelor

function App() {
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
          <Route path="/test-upload" element={<TestUploadPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
