import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Spinner, Alert } from "react-bootstrap";

interface Partner {
  instagram: string;
  baseCountry: string;
  name?: string;
}

const EditProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    period: { start: "", end: "" },
    deadline: "",
    country: "RO",
    domain: "education",
    location: "",
    infoPackUrl: "",
    coverImageUrl: "",
    targetAudience: "",
    applyUrl: "",
    host: "",
    objectives: [""],
    partners: [] as Partner[],
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Project not found");

        setFormData({
          name: data.name || "",
          description: data.description || "",
          period: {
            start: data.period?.start?.slice(0, 10) || "",
            end: data.period?.end?.slice(0, 10) || "",
          },
          deadline: data.deadline?.slice(0, 10) || "",
          country: data.country || "RO",
          domain: data.domain || "education",
          location: data.location || "",
          infoPackUrl: data.infoPackUrl || "",
          coverImageUrl: data.coverImageUrl || "",
          targetAudience: data.targetAudience || "",
          applyUrl: data.applyUrl || "",
          host: data.host?._id || "",
          objectives: data.objectives?.length ? data.objectives : [""],
          partners:
            data.partners?.map((p: any) => ({
              name: p.name || p.organisationRef?.name || "",
              instagram:
                p.instagram || p.organisationRef?.socialMedia?.instagram || "",
              baseCountry:
                p.baseCountry || p.organisationRef?.baseCountry || "",
            })) || [],
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      period: { ...prev.period, [name]: value },
    }));
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const updated = [...formData.objectives];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, objectives: updated }));
  };

  const addObjective = () => {
    setFormData((prev) => ({ ...prev, objectives: [...prev.objectives, ""] }));
  };

  const removeObjective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  };

  const addPartner = () => {
    setFormData((prev) => ({
      ...prev,
      partners: [
        ...prev.partners,
        { instagram: "", baseCountry: "", name: "" },
      ],
    }));
  };

  const removePartner = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      partners: prev.partners.filter((_, i) => i !== index),
    }));
  };

  const updatePartner = (index: number, field: string, value: string) => {
    const updated = [...formData.partners];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, partners: updated }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("image", file);
    const res = await fetch("http://localhost:5000/api/uploads", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Image upload failed");
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let imageUrl = formData.coverImageUrl;
      if (coverFile) {
        imageUrl = await uploadImage(coverFile);
      }

      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, coverImageUrl: imageUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setSuccess("Project updated successfully!");
      setTimeout(() => navigate(`/projects/${id}`), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" /> Loading...
      </div>
    );

  return (
    <div className="container my-5 p-4 bg-light rounded shadow-sm">
      <h2 className="text-center mb-4">Edit Erasmus+ Project</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Standard inputs */}
        {[
          "name",
          "description",
          "location",
          "targetAudience",
          "applyUrl",
          "infoPackUrl",
        ].map((field) => (
          <Form.Group className="mb-3" key={field}>
            <Form.Label>
              {field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </Form.Label>
            <Form.Control
              as={field === "description" ? "textarea" : "input"}
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              required
            />
          </Form.Group>
        ))}

        {/* Dates */}
        {["start", "end"].map((dateField) => (
          <Form.Group className="mb-3" key={dateField}>
            <Form.Label>
              {dateField === "start" ? "Start Date" : "End Date"}
            </Form.Label>
            <Form.Control
              type="date"
              name={dateField}
              value={formData.period[dateField as "start" | "end"]}
              onChange={handlePeriodChange}
              required
            />
          </Form.Group>
        ))}

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

        {/* Country & Domain */}
        <Form.Group className="mb-3">
          <Form.Label>Country</Form.Label>
          <Form.Control
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Domain</Form.Label>
          <Form.Select
            name="domain"
            value={formData.domain}
            onChange={handleChange}
          >
            {[
              "education",
              "environment",
              "well-being",
              "digital",
              "culture",
              "youth",
              "inclusion",
              "sports",
              "health",
              "social",
            ].map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Objectives */}
        <Form.Group className="mb-3">
          <Form.Label>Objectives</Form.Label>
          {formData.objectives.map((obj, idx) => (
            <div className="d-flex mb-2" key={idx}>
              <Form.Control
                value={obj}
                onChange={(e) => handleObjectiveChange(idx, e.target.value)}
              />
              <Button
                variant="outline-danger"
                onClick={() => removeObjective(idx)}
                className="ms-2"
                disabled={formData.objectives.length === 1}
              >
                ✖
              </Button>
            </div>
          ))}
          <Button
            variant="outline-primary"
            onClick={addObjective}
            type="button"
          >
            ➕ Add Objective
          </Button>
        </Form.Group>

        {/* Partners */}
        <Form.Group className="mb-3">
          <Form.Label>Partners</Form.Label>
          {formData.partners.map((partner, idx) => (
            <div key={idx} className="d-flex gap-2 mb-2 align-items-center">
              <Form.Control
                placeholder="Name (optional)"
                value={partner.name || ""}
                onChange={(e) => updatePartner(idx, "name", e.target.value)}
              />
              <Form.Control
                placeholder="Instagram"
                value={partner.instagram}
                onChange={(e) =>
                  updatePartner(idx, "instagram", e.target.value)
                }
              />
              <Form.Control
                placeholder="Base Country"
                value={partner.baseCountry}
                onChange={(e) =>
                  updatePartner(idx, "baseCountry", e.target.value)
                }
              />
              <Button
                variant="outline-danger"
                onClick={() => removePartner(idx)}
                disabled={formData.partners.length === 1}
              >
                ✖
              </Button>
            </div>
          ))}
          <Button variant="secondary" onClick={addPartner} type="button">
            ➕ Add Partner
          </Button>
        </Form.Group>

        {/* Cover Image */}
        <Form.Group className="mb-3">
          <Form.Label>Cover Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCoverFile((e.target as HTMLInputElement).files?.[0] || null)
            }
          />
          {(coverFile || formData.coverImageUrl) && (
            <div className="text-center my-3">
              <img
                src={
                  coverFile
                    ? URL.createObjectURL(coverFile)
                    : formData.coverImageUrl
                }
                alt="Cover"
                className="img-fluid rounded shadow"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            </div>
          )}
        </Form.Group>
        <div className="text-center mt-4">
          <Button type="submit" variant="success" className="px-4">
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditProjectPage;
