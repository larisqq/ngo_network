import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
// Update the import path below to the correct location of your AuthContext file
import { useAuth } from "../../context/AuthContext";
import { Organisation } from "../../types/models";

const EditProfilePage = () => {
  const { currentOrg, setCurrentOrg } = useAuth();

  const [formData, setFormData] = useState<Organisation>({
    _id: "",
    name: "",
    logo: "",
    baseCountry: "",
    countryCode: "+40",
    description: "",
    domains: [],
    contact: {
      email: "",
      phone: "",
      whatsapp: "",
      countryCode: "",
      rawPhone: "",
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      website: "",
    },
    coordinators: [{ name: "", photo: "", role: "", email: "" }],
    hostedProjects: [],
    partnerIn: [],
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const europeanCountries = [
    { name: "Romania", code: "+40" },
    { name: "Germany", code: "+49" },
    { name: "France", code: "+33" },
    { name: "Italy", code: "+39" },
    { name: "Spain", code: "+34" },
    { name: "Greece", code: "+30" },
    { name: "Poland", code: "+48" },
    { name: "Hungary", code: "+36" },
    { name: "Bulgaria", code: "+359" },
    { name: "Czech Republic", code: "+420" },
    { name: "Slovakia", code: "+421" },
    { name: "Croatia", code: "+385" },
    { name: "Serbia", code: "+381" },
    { name: "Austria", code: "+43" },
    { name: "Sweden", code: "+46" },
    { name: "Finland", code: "+358" },
    { name: "Denmark", code: "+45" },
    { name: "Norway", code: "+47" },
    { name: "Portugal", code: "+351" },
    { name: "Netherlands", code: "+31" },
    { name: "Belgium", code: "+32" },
    { name: "Ireland", code: "+353" },

    { name: "Switzerland", code: "+41" },
    { name: "Iceland", code: "+354" },
    { name: "Luxembourg", code: "+352" },
    { name: "Malta", code: "+356" },
    { name: "Cyprus", code: "+357" },
    { name: "Estonia", code: "+372" },
    { name: "Latvia", code: "+371" },
    { name: "Lithuania", code: "+370" },
    { name: "Slovenia", code: "+386" },
    { name: "Bosnia and Herzegovina", code: "+387" },
    { name: "North Macedonia", code: "+389" },
    { name: "Albania", code: "+355" },
    { name: "Moldova", code: "+373" },
    { name: "Ukraine", code: "+380" },
    { name: "Belarus", code: "+375" },

    // adaugă câte vrei
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/organisations/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load profile");

        setFormData(data);
        setCurrentOrg(data); // actualizezi contextul
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile(); // apelezi mereu, nu doar dacă currentOrg e null
  }, [setCurrentOrg]);

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

      // ✅ Redirecționează către pagina de profil după 2 secunde
      setTimeout(() => {
        navigate(`/organisations/${formData._id}`);
      }, 1300);
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
    <div className="container my-5 p-4 rounded shadow-sm bg-light">
      <h2 className="mb-4 text-center">Edit Your Organisation Profile</h2>

      {error && (
        <Alert variant="danger" className="fade-in">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="fade-in">
          {success}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* SECTION 1: BASIC INFO */}
        <h5 className="mt-4 mb-3">Organisation Info</h5>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Organisation name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Short description"
            rows={3}
          />
        </Form.Group>

        {/* LOGO UPLOAD */}
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

        {(formData.logo || logoFile) && (
          <div className="mb-4 text-center">
            <img
              src={logoFile ? URL.createObjectURL(logoFile) : formData.logo}
              alt="Logo preview"
              className="img-fluid rounded border"
              style={{ maxHeight: "150px", objectFit: "contain" }}
            />
          </div>
        )}

        {/* SECTION 2: CONTACT INFO */}
        <h5 className="mt-4 mb-3">Contact Info</h5>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            value={formData.contact.email || ""}
            disabled
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <div className="d-flex gap-2">
            <Form.Select
              value={formData.contact.countryCode || "+40"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: {
                    ...prev.contact,
                    countryCode: e.target.value,
                  },
                }))
              }
              style={{ maxWidth: "160px" }}
            >
              {europeanCountries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </Form.Select>

            <Form.Control
              type="text"
              placeholder="712345678"
              value={formData.contact.phone || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: {
                    ...prev.contact,
                    rawPhone: e.target.value,
                  },
                }))
              }
            />
          </div>
        </Form.Group>

        {/* SECTION 3: SOCIAL MEDIA */}
        <h5 className="mt-4 mb-3">Social Media</h5>
        <Form.Group className="mb-3">
          <Form.Label>Website Link</Form.Label>
          <Form.Control
            name="website"
            value={formData.socialMedia.website || ""}
            onChange={handleSocialChange}
            placeholder="https://..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Facebook Link</Form.Label>
          <Form.Control
            name="facebook"
            value={formData.socialMedia.facebook || ""}
            onChange={handleSocialChange}
            placeholder="@facebook"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Instagram username</Form.Label>
          <Form.Control
            name="instagram"
            value={formData.socialMedia.instagram || ""}
            onChange={handleSocialChange}
            placeholder="@instagram"
            disabled
          />
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <Button
            type="submit"
            variant="success"
            disabled={loading}
            className="px-4"
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Save Changes"
            )}
          </Button>

          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => window.location.reload()}
          >
            Reset Form
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditProfilePage;
