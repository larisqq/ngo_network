import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Spinner, Alert } from "react-bootstrap";

const EditProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    period: { start: "", end: "" },
    deadline: "",
    country: "",
    domain: "",
    location: "",
    infoPackUrl: "",
    coverImageUrl: "",
    targetAudience: "",
    applyLink: "",
    objectives: [""],
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
          country: data.country || "",
          domain: data.domain || "",
          location: data.location || "",
          infoPackUrl: data.infoPackUrl || "",
          coverImageUrl: data.coverImageUrl || "",
          targetAudience: data.targetAudience || "",
          applyLink: data.applyLink || "",
          objectives: data.objectives?.length ? data.objectives : [""],
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
    setFormData((prev) => ({
      ...prev,
      objectives: [...prev.objectives, ""],
    }));
  };

  const removeObjective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
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
        headers: {
          "Content-Type": "application/json",
        },
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
      <h2 className="text-center mb-4">Edit Project</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Text inputs */}
        {[
          { label: "Project Name", name: "name" },
          {
            label: "Description",
            name: "description",
            type: "textarea",
            rows: 6,
          },
          { label: "Country", name: "country" },
          { label: "Domain", name: "domain" },
          { label: "Location", name: "location" },
          { label: "InfoPack URL", name: "infoPackUrl" },
          { label: "Target Audience", name: "targetAudience" },
          { label: "Application Link", name: "applyLink" },
        ].map(({ label, name, type, rows }) => (
          <Form.Group className="mb-3" key={name}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
              as={type === "textarea" ? "textarea" : undefined}
              rows={rows}
              name={name}
              value={(formData as any)[name]}
              onChange={handleChange}
            />
          </Form.Group>
        ))}

        {/* Image upload */}
        <Form.Group className="mb-3">
          <Form.Label>Cover Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCoverFile((e.target as HTMLInputElement).files?.[0] || null)
            }
          />
        </Form.Group>

        {(coverFile || formData.coverImageUrl) && (
          <div className="text-center mb-4">
            <img
              src={
                coverFile
                  ? URL.createObjectURL(coverFile)
                  : formData.coverImageUrl
              }
              alt="Cover preview"
              className="img-fluid rounded border"
              style={{ maxHeight: "200px", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Dates */}
        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="start"
            value={formData.period.start}
            onChange={handlePeriodChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="end"
            value={formData.period.end}
            onChange={handlePeriodChange}
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

        {/* Objectives */}
        <h5 className="mt-4">Objectives</h5>
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
        <Button variant="outline-primary" onClick={addObjective}>
          ➕ Add Objective
        </Button>

        {/* Submit */}
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
