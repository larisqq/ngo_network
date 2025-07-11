import { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Project } from "@/types/models";

interface Partner {
  instagram: string;
  baseCountry: string;
  name?: string;
}

interface ProjectProps {
  instagram: string;
}

const AddProjectPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    deadline: "",
    country: "RO",
    domain: [] as string[],
    infoPackUrl: "",
    coverImageUrl: "",
    targetAudience: "",
    applyUrl: "",
    host: "",
    objectives: [""],
    location: "",
    partners: [] as Partner[],
    period: {
      start: "",
      end: "",
    },
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [partnerType, setPartnerType] = useState<"country" | "organisation">(
    "organisation"
  );

  const DOMAIN_OPTIONS = [
    "education ",
    "Environment & sustainability",
    "Well-being & mental health ",
    "digital & innovation",
    "youth ",
    "Inclusion & social integration",
    "health and fitness ",
    "entrepreneurship ",
    "mobility ",
    "community development ",
    "training course",
    "yputh exchange",
  ];
  const toggleDomain = (domain: string) => {
    setFormData((prev) => {
      const isSelected = prev.domain.includes(domain);
      return {
        ...prev,
        domain: isSelected
          ? prev.domain.filter((d) => d !== domain)
          : [...prev.domain, domain],
      };
    });
  };

  const uploadCoverImage = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("image", file);

    const res = await fetch("http://localhost:5000/api/uploads", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to upload cover image");
    return data.url;
  };

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

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({ ...prev, domain: selected }));
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
      partners: [...prev.partners, { instagram: "", baseCountry: "" }],
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
        coverImageUrl = await uploadCoverImage(coverImage);
      }

      const payload = {
        ...formData,
        coverImageUrl,
        objectives: formData.objectives,
        partners: formData.partners,
        period: {
          start: formData.period.start,
          end: formData.period.end,
        },
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
        domain: [],
        infoPackUrl: "",
        coverImageUrl: "",
        targetAudience: "",
        applyUrl: "",
        host: formData.host,
        location: "",
        objectives: [""],
        partners: [],
        period: {
          start: "",
          end: "",
        },
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
        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            name="location"
            value={formData.location}
            onChange={handleChange}
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
        {/* Period Start */}
        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            value={formData.period.start}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                period: { ...prev.period, start: e.target.value },
              }))
            }
            required
          />
        </Form.Group>

        {/* Period End */}
        <Form.Group className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            value={formData.period.end}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                period: { ...prev.period, end: e.target.value },
              }))
            }
            required
          />
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
            <option value="PT">Portugal</option>
            <option value="GR">Greece</option>
            <option value="BG">Bulgaria</option>
            <option value="PL">Poland</option>
            <option value="HU">Hungary</option>
            <option value="CZ">Czech Republic</option>
            <option value="SK">Slovakia</option>
            <option value="AT">Austria</option>
            <option value="NL">Netherlands</option>
            <option value="BE">Belgium</option>
            <option value="SE">Sweden</option>
            <option value="DK">Denmark</option>
            <option value="FI">Finland</option>
            <option value="NO">Norway</option>
          </Form.Select>
        </Form.Group>

        {/* Domain */}
        <Form.Group className="mb-3">
          <Form.Label>Domains</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {DOMAIN_OPTIONS.map((domain) => {
              const isSelected = formData.domain.includes(domain);
              return (
                <Button
                  key={domain}
                  variant={isSelected ? "primary" : "outline-primary"}
                  onClick={() => toggleDomain(domain)}
                  size="sm"
                  className="rounded-pill"
                >
                  {domain}
                </Button>
              );
            })}
          </div>
        </Form.Group>

        {/* Partners */}
        <Form.Group className="mb-3">
          <Form.Label>Type of Partners</Form.Label>
          <Form.Select
            value={partnerType}
            onChange={(e) =>
              setPartnerType(e.target.value as "country" | "organisation")
            }
          >
            <option value="organisation">Partner Organisations</option>
            <option value="country">Partner Countries</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Partners</Form.Label>

          {formData.partners.map((partner, index) => (
            <div
              key={index}
              className="mb-2 d-flex gap-2 align-items-center flex-wrap"
            >
              {partnerType === "organisation" && (
                <>
                  <Form.Control
                    type="text"
                    placeholder="Partner Name (optional)"
                    value={partner.name || ""}
                    onChange={(e) =>
                      updatePartner(index, "name", e.target.value)
                    }
                    className="me-2"
                  />
                  <Form.Control
                    type="text"
                    placeholder="Instagram"
                    value={partner.instagram}
                    onChange={(e) =>
                      updatePartner(index, "instagram", e.target.value)
                    }
                    className="me-2"
                  />
                </>
              )}
              <Form.Control
                type="text"
                placeholder="Base Country"
                value={partner.baseCountry}
                onChange={(e) =>
                  updatePartner(index, "baseCountry", e.target.value)
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
          {coverImage && (
            <div className="mb-3">
              <img
                src={URL.createObjectURL(coverImage)}
                alt="Cover preview"
                style={{ maxHeight: "200px", borderRadius: "0.5rem" }}
              />
            </div>
          )}
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
