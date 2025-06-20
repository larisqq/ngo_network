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
    deadline: "",
    country: "RO",
    domain: "education",
    infoPackUrl: "",
    coverImageUrl: "",
    targetAudience: "",
    applyUrl: "",
    host: "",
    objectives: [""],
    partners: [] as Partner[],
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchOrganisation = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/organisations/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        setFormData((prev) => ({ ...prev, host: data._id }));
      } catch {
        setIsLoggedIn(false);
      }
    };

    fetchOrganisation();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleObjectiveChange = (idx: number, value: string) => {
    const updated = [...formData.objectives];
    updated[idx] = value;
    setFormData({ ...formData, objectives: updated });
  };

  const addObjective = () => {
    setFormData((prev) => ({ ...prev, objectives: [...prev.objectives, ""] }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      let coverImageUrl = formData.coverImageUrl;

      if (coverImage) {
        const imgData = new FormData();
        imgData.append("image", coverImage);

        const res = await fetch("http://localhost:5000/api/uploads", {
          method: "POST",
          body: imgData,
        });

        const img = await res.json();
        if (!res.ok) throw new Error("Cover upload failed");
        coverImageUrl = img.url;
      }

      const payload = {
        ...formData,
        coverImageUrl,
        objectives: formData.objectives,
        partners: formData.partners,
      };

      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error creating project");
      const data = await res.json();

      setSuccessMsg(`Project "${data.name}" created successfully!`);
      setFormData({
        name: "",
        description: "",
        deadline: "",
        country: "RO",
        domain: "education",
        infoPackUrl: "",
        coverImageUrl: "",
        targetAudience: "",
        applyUrl: "",
        host: formData.host,
        objectives: [""],
        partners: [],
      });
      setCoverImage(null);
    } catch (err: any) {
      setErrorMsg(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Alert variant="danger">You must be logged in to add a project.</Alert>
    );
  }

  return (
    <div className="container my-5">
      <h2>Add New Erasmus+ Project</h2>
      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Name */}
        <Form.Group className="mb-3">
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Description */}
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

        {/* Objectives */}
        <Form.Group className="mb-3">
          <Form.Label>Objectives</Form.Label>
          {formData.objectives.map((obj, idx) => (
            <Form.Control
              key={idx}
              value={obj}
              onChange={(e) => handleObjectiveChange(idx, e.target.value)}
              className="mb-2"
              placeholder={`Objective ${idx + 1}`}
              required
            />
          ))}
          <Button variant="secondary" type="button" onClick={addObjective}>
            + Add Objective
          </Button>
        </Form.Group>

        {/* Deadline */}
        <Form.Group className="mb-3">
          <Form.Label>Deadline</Form.Label>
          <Form.Control
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Target Audience */}
        <Form.Group className="mb-3">
          <Form.Label>Target Audience</Form.Label>
          <Form.Control
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Apply URL */}
        <Form.Group className="mb-3">
          <Form.Label>Apply URL</Form.Label>
          <Form.Control
            name="applyUrl"
            value={formData.applyUrl}
            onChange={handleChange}
          />
        </Form.Group>

        {/* InfoPack URL */}
        <Form.Group className="mb-3">
          <Form.Label>InfoPack URL</Form.Label>
          <Form.Control
            name="infoPackUrl"
            value={formData.infoPackUrl}
            onChange={handleChange}
            placeholder="https://example.com/infopack.pdf"
          />
        </Form.Group>

        {/* Country */}
        <Form.Group className="mb-3">
          <Form.Label>Country</Form.Label>
          <Form.Select
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="">-- Select country --</option>
            <option value="RO">Romania</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
            <option value="ES">Spain</option>
            <option value="IT">Italy</option>
          </Form.Select>
        </Form.Group>

        {/* Domain */}
        <Form.Group className="mb-3">
          <Form.Label>Domain</Form.Label>
          <Form.Select
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            required
          >
            <option value="education">Education</option>
            <option value="environment">Environment</option>
            <option value="well-being">Well-being</option>
            <option value="digital">Digital</option>
            <option value="culture">Culture</option>
          </Form.Select>
        </Form.Group>

        {/* Partners */}
        <Form.Group className="mb-3">
          <Form.Label>Partners</Form.Label>
          {formData.partners.map((partner, index) => (
            <div key={index} className="border p-3 mb-2 rounded">
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

        {/* Cover Image */}
        <Form.Group className="mb-3">
          <Form.Label>Cover Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCoverImage((e.target as HTMLInputElement).files?.[0] || null)
            }
          />
        </Form.Group>

        {/* Submit */}
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
