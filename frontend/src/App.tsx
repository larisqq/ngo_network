import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Home'; // dacă ai o pagină de tip landing/home
import OrganisationsPage from './pages/OrganisationsPage';
import ProjectsPage from './pages/ProjectsPage';
import OrganisationProfile from './pages/OngProfile'; // pagină individuală ONG
import ProjectProfilePage from './pages/ProjectProfilePage'; // pagină individuală proiect

import './App.css';

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

        </Routes>
      </div>
    </Router>
  );
}

export default App;
