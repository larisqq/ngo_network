import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, Spinner, Form, Button } from "react-bootstrap";

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    description: "",
    domains: "",
    phone: "",
    website: "",
    facebook: "",
    instagram: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Verificarea token-ului
  useEffect(() => {
    if (!token) {
      setError("No token provided.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/auth/verify?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");

        setTokenValid(true);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Redirecționează la login după 3 secunde
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message, navigate]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Finalizează înregistrarea
  const handleRegister = async () => {
    if (!token) {
      setError("Missing token.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        description: formData.description,
        domains: formData.domains.split(",").map((d) => d.trim()),
        phone: formData.phone,
        socialMedia: {
          website: formData.website || null,
          facebook: formData.facebook || null,
          instagram: formData.instagram,
        },
      };

      const response = await fetch(
        `http://localhost:5000/api/auth/finalize?token=${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Final registration failed");

      setMessage("Organisation successfully verified and registered!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Afișări condiționale
  if (loading) return <Spinner animation="border" className="m-5" />;
  if (error)
    return (
      <Alert variant="danger" className="m-5">
        {error}
      </Alert>
    );
  if (message)
    return (
      <Alert variant="success" className="m-5">
        {message}
        <div className="mt-2 text-muted">Redirecting to login...</div>
      </Alert>
    );
  if (!tokenValid)
    return (
      <Alert variant="danger" className="m-5">
        Invalid or expired verification token.
      </Alert>
    );

  // Form pentru completarea profilului
  return (
    <div className="container my-5">
      <h2>Complete Organisation Profile</h2>
      <p>Please fill in the rest of the details to complete registration.</p>

      <Form>
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
          <Form.Label>Domains (comma-separated)</Form.Label>
          <Form.Control
            name="domains"
            value={formData.domains}
            onChange={handleChange}
            placeholder="e.g. education, health"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+40 x xxx xxx xxx"
            pattern="^\+?\d{0,3}\s?\d{1,4}\s?\d{1,4}\s?\d{1,4}\s?\d{1,4}$"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Website</Form.Label>
          <Form.Control
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Facebook</Form.Label>
          <Form.Control
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            Instagram <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" onClick={handleRegister}>
          Finalize Registration
        </Button>
      </Form>
    </div>
  );
};

export default VerifyPage;
