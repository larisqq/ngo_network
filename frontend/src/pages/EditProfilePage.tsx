import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Spinner, Alert } from "react-bootstrap";

const EditProfilePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    description: "",
    domains: [],
    contact: { email: "", phone: "", whatsapp: "" },
    socialMedia: { facebook: "", instagram: "", website: "" },
    coordinators: [{ name: "", photo: "", role: "", email: "" }],
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/organisations/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load profile");
        setFormData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [name]: value },
    }));
  };

  const uploadLogo = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("image", file);

    const res = await fetch("http://localhost:5000/api/uploads", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to upload logo");
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      let logoUrl = formData.logo;

      if (logoFile) {
        logoUrl = await uploadLogo(logoFile);
      }

      const res = await fetch(
        "http://localhost:5000/api/organisations/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ...formData, logo: logoUrl }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setSuccess("Profile updated successfully!");
      setFormData((prev) => ({ ...prev, logo: logoUrl }));
      setLogoFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" /> Loading profile...
      </div>
    );

  return (
    <div className="container my-5">
      <h2>Edit Organisation Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
          />
        </Form.Group>

        {/* ✅ Logo */}
        <Form.Group className="mb-3">
          <Form.Label>Logo</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) =>
              setLogoFile((e.target as HTMLInputElement).files?.[0] || null)
            }
          />
        </Form.Group>

        {formData.logo && !logoFile && (
          <div className="mb-3">
            <img
              src={formData.logo}
              alt="Current logo"
              style={{ maxHeight: "150px" }}
            />
          </div>
        )}

        {logoFile && (
          <div className="mb-3">
            <img
              src={URL.createObjectURL(logoFile)}
              alt="New logo preview"
              style={{ maxHeight: "150px" }}
            />
          </div>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            value={formData.contact.email || ""}
            disabled
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            name="phone"
            value={formData.contact.phone || ""}
            onChange={handleContactChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>WhatsApp</Form.Label>
          <Form.Control
            name="whatsapp"
            value={formData.contact.whatsapp || ""}
            onChange={handleContactChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Website</Form.Label>
          <Form.Control
            name="website"
            value={formData.socialMedia.website || ""}
            onChange={handleSocialChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Facebook</Form.Label>
          <Form.Control
            name="facebook"
            value={formData.socialMedia.facebook || ""}
            onChange={handleSocialChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Instagram</Form.Label>
          <Form.Control
            name="instagram"
            value={formData.socialMedia.instagram || ""}
            onChange={handleSocialChange}
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Save Changes"}
        </Button>
      </Form>
    </div>
  );
};

export default EditProfilePage;
