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
    socialLinks: { facebook: "", instagram: "", website: "" },
    coordinators: [{ name: "", photo: "", role: "", email: "" }],
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/organisations/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/organisations/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /> Loading profile...</div>;

  return (
    <div className="container my-5">
      <h2>Edit Organisation Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" value={formData.name || ""} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Logo (URL)</Form.Label>
          <Form.Control name="logo" value={formData.logo || ""} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="description" value={formData.description || ""} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control name="email" value={formData.contact.email || ""} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control name="phone" value={formData.contact.phone || ""} onChange={handleContactChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>WhatsApp</Form.Label>
          <Form.Control name="whatsapp" value={formData.contact.whatsapp || ""} onChange={handleContactChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Website</Form.Label>
          <Form.Control name="website" value={formData.socialLinks.website || ""} onChange={handleSocialChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Facebook</Form.Label>
          <Form.Control name="facebook" value={formData.socialLinks.facebook || ""} onChange={handleSocialChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Instagram</Form.Label>
          <Form.Control name="instagram" value={formData.socialLinks.instagram || ""} onChange={handleSocialChange} />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Save Changes"}
        </Button>
      </Form>
    </div>
  );
};

export default EditProfilePage;
