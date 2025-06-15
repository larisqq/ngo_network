// src/pages/AddProjectPage.tsx
//http://localhost:5173/add-project#
import { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

interface Organisation {
  _id: string;
  name: string;
}

const AddProjectPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    deadline: '',
    country: 'RO',
    domain: 'education',
    location: '',
    host: '',
  });

  const [infoPackFile, setInfoPackFile] = useState<File | null>(null);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/organisations')
      .then(res => res.json())
      .then(data => setOrganisations(data))
      .catch(err => console.error('Error loading organisations:', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setInfoPackFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, (formData as any)[key]);
    }
    if (infoPackFile) {
      payload.append('infoPack', infoPackFile);
    }

    try {
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        body: payload,
      });

      if (!res.ok) throw new Error('Error uploading project');
      const data = await res.json();
      setSuccessMsg(`Project "${data.name}" created successfully!`);
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        deadline: '',
        country: 'RO',
        domain: 'education',
        location: '',
        host: '',
      });
      setInfoPackFile(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2>Add New Erasmus+ Project</h2>

      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Project Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="description" rows={3} value={formData.description} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Deadline</Form.Label>
          <Form.Control type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Country</Form.Label>
          <Form.Select name="country" value={formData.country} onChange={handleChange}>
            <option value="RO">Romania</option>
            <option value="MD">Moldova</option>
            <option value="UA">Ukraine</option>
            <option value="BG">Bulgaria</option>
            <option value="HU">Hungary</option>
            <option value="RS">Serbia</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Domain</Form.Label>
          <Form.Select name="domain" value={formData.domain} onChange={handleChange}>
            <option value="education">Education</option>
            <option value="environment">Environment</option>
            <option value="well-being">Well-being</option>
            <option value="health">Health</option>
            <option value="digital">Digital</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Host Organisation</Form.Label>
          <Form.Select name="host" value={formData.host} onChange={handleChange} required>
            <option value="">-- Select organisation --</option>
            {organisations.map(org => (
              <option key={org._id} value={org._id}>{org.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>InfoPack (PDF)</Form.Label>
          <Form.Control type="file" accept=".pdf" onChange={handleFileChange} />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Create Project'}
        </Button>
      </Form>
    </div>
  );
};

export default AddProjectPage;
