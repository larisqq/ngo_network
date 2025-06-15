// src/pages/ProjectsPage.tsx
import { useEffect, useState } from 'react';
import { Project } from '../types/models'; 
import ProjectCard from '../components/ProjectCard'; 
import '../App.css'; 

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProjects = async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/projects?page=${page}`);

      const data: Project[] = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setProjects(prev => {
          const newProjects = data.filter(newP => !prev.some(p => p.id === newP.id));
          return [...prev, ...newProjects];
        });
      }
    } catch (err) {
      console.error('Eroare la fetch proiecte:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (page > 1) fetchProjects();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading && hasMore) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="container my-5">
      <h1 className="mb-4">Available Projects</h1>
      {projects.length > 0 ? (
        <div className="row">
          {projects.map(project => (
            <div className="col-md-6 mb-4" key={project.id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : !loading ? (
        <div className="text-center">No projects found.</div>
      ) : null}

      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;