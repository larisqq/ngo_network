import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import  api  from '../api/client'; 
import { Spinner, Alert, Badge, ListGroup } from 'react-bootstrap';

interface Organisation {
  id: string;
  name: string;
  logo: string;
  description: string;
  domains: string[];
  projects: {
    id: string;
    title: string;
    deadline: string;
  }[];
}

const OrganisationProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [org, setOrg] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrganisation = async () => {
      try {
        const response = await api.get(`/organisations/${id}`);
        setOrg(response.data);
      } catch (err) {
        setError('Could not load organisation details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisation();
  }, [id]);

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!org) return <Alert variant="warning">Organisation not found</Alert>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <img
              src={org.logo}
              alt={`${org.name} logo`}
              className="card-img-top p-3"
            />
            <div className="card-body">
              <h2 className="h4">{org.name}</h2>
              <div className="mb-3">
                {org.domains.map((domain) => (
                  <Badge key={domain} bg="primary" className="me-1">
                    {domain}
                  </Badge>
                ))}
              </div>
              <p className="card-text">{org.description}</p>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="h5 mb-0">Active Projects</h3>
            </div>
            <ListGroup variant="flush">
              {org.projects.map((project) => (
                <ListGroup.Item key={project.id} action>
                  <div className="d-flex justify-content-between">
                    <span>{project.title}</span>
                    <small className="text-muted">
                      Deadline: {new Date(project.deadline).toLocaleDateString()}
                    </small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganisationProfile;