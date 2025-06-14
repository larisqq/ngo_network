import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spinner, Button, Badge } from 'react-bootstrap';

interface Project {
  id: string;
  title: string;
  description: string;
  infoPackUrl?: string;
  startDate: string;
  endDate: string;
  deadline?: string;
  country: string;
  domain: string;
  location?: string;
  host: {
    id: string;
    name: string;
  };
}

const ProjectProfilePage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${id}`);
        const data = await res.json();
        const mapped = {
          id: data._id,
          title: data.name,
          description: data.description,
          infoPackUrl: data.infoPackUrl,
          startDate: data.startDate,
          endDate: data.endDate,
          deadline: data.deadline,
          location: data.location,
          country: data.country,
          domain: data.domain,
          host: {
            id: data.host?._id,
            name: data.host?.name,
          },
        };
        setProject(mapped);
      } catch (err) {
        console.error('Failed to load project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (!project) return <div className="text-center text-danger">Project not found</div>;

  const isBeforeDeadline = project.deadline && new Date(project.deadline) > new Date();

  return (
    <div className="container py-5">
      <h1>{project.title}</h1>

      <p className="text-muted">
        <strong>Domain:</strong> {project.domain} &nbsp;
        <Badge bg="secondary">{project.country}</Badge>
      </p>

      <p>{project.description}</p>

      {project.infoPackUrl && (
        <div className="mb-4">
          <h5>InfoPack</h5>
          <iframe
            src={project.infoPackUrl}
            title="InfoPack"
            width="100%"
            height="600px"
            style={{ border: '1px solid #ccc', borderRadius: '8px' }}
          />
        </div>
      )}

      <div className="mb-3">
        <p><strong>Location:</strong> {project.location || '—'}</p>
        <p>
          <strong>Period:</strong> {new Date(project.startDate).toLocaleDateString()} –{' '}
          {new Date(project.endDate).toLocaleDateString()}
        </p>
        {project.deadline && (
          <p>
            <strong>Apply before:</strong>{' '}
            {new Date(project.deadline).toLocaleDateString()}
          </p>
        )}
      </div>

      {isBeforeDeadline ? (
        <Button variant="success" size="lg">Apply now</Button>
      ) : (
        <Button variant="secondary" size="lg" disabled>
          Application closed
        </Button>
      )}
    </div>
  );
};

export default ProjectProfilePage;
