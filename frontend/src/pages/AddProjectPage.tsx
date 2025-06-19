// src/pages/AddProjectPage.tsx
import { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

interface Partner {
  instagram: string;
  country: string;
}

const AddProjectPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    deadline: "",
    country: "RO",
    domain: "education",
    location: "",
    host: "",
    partners: [] as Partner[],
  });

  const [infoPackFile, setInfoPackFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    const fetchOrganisation = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/organisations/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setFormData((prev) => ({ ...prev, host: data._id }));
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    fetchOrganisation();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const payload = new FormData();
    for (const key in formData) {
      if (key === "partners") {
        payload.append("partners", JSON.stringify(formData.partners));
      } else {
        payload.append(key, (formData as any)[key]);
      }
    }

    if (infoPackFile) {
      payload.append("infoPack", infoPackFile);
    }

    if (coverImage) {
      payload.append("coverImage", coverImage);
    }

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: payload,
      });

      if (!res.ok) throw new Error("Error uploading project");
      const data = await res.json();
      setSuccessMsg(`Project "${data.name}" created successfully!`);
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        deadline: "",
        country: "RO",
        domain: "education",
        location: "",
        host: formData.host,
        partners: [],
      });
      setInfoPackFile(null);
      setCoverImage(null);
    } catch (err: any) {
      setErrorMsg(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const addPartner = () => {
    setFormData((prev) => ({
      ...prev,
      partners: [...prev.partners, { instagram: "", country: "" }],
    }));
  };

  const updatePartner = (index: number, field: string, value: string) => {
    const updated = [...formData.partners];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, partners: updated }));
  };

  if (!isLoggedIn) {
    return (
      <div className="container my-5">
        <Alert variant="danger">You must be logged in to add a project.</Alert>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2>Add New Erasmus+ Project</h2>

      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Deadline</Form.Label>
          <Form.Control
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Country</Form.Label>
          <Form.Select
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">-- Select country --</option>
            <option value="RO">Romania</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
            <option value="ES">Spain</option>
            <option value="IT">Italy</option>
            {/* add more countries as needed */}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Domain</Form.Label>
          <Form.Select
            name="domain"
            value={formData.domain}
            onChange={handleChange}
          >
            <option value="education">Education</option>
            <option value="environment">Environment</option>
            <option value="well-being">Well-being</option>
            <option value="health">Health</option>
            <option value="digital">Digital</option>
          </Form.Select>
        </Form.Group>

        {/* Cover Image Upload */}
        <Form.Group className="mb-3">
          <Form.Label>Project Cover Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setCoverImage(target.files?.[0] || null);
            }}
          />
        </Form.Group>

        {/* Partners section */}
        <Form.Group className="mb-3">
          <Form.Label>Project Partners</Form.Label>
          {formData.partners.map((partner, index) => (
            <div key={index} className="border rounded p-3 mb-2">
              <Form.Control
                placeholder="Instagram (required)"
                value={partner.instagram}
                onChange={(e) =>
                  updatePartner(index, "instagram", e.target.value)
                }
                className="mb-2"
                required
              />
              <Form.Control
                placeholder="Country (e.g. RO, FR, DE)"
                value={partner.country}
                onChange={(e) =>
                  updatePartner(index, "country", e.target.value)
                }
                required
              />
            </div>
          ))}
          <Button variant="secondary" onClick={addPartner} type="button">
            + Add Partner
          </Button>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>InfoPack (PDF)</Form.Label>
          <Form.Control
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setInfoPackFile(target.files?.[0] || null);
            }}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Create Project"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default AddProjectPage;
