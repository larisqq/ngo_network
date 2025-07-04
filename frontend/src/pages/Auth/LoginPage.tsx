import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ import context

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const { setCurrentOrg } = useAuth(); // ✅ folosim setCurrentOrg

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ trimite cookie
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // ✅ actualizăm contextul cu datele primite
      setCurrentOrg({
        _id: data.id,
        name: data.name,
        logo: data.logo,
        baseCountry: data.baseCountry,
        countryCode: data.countryCode || "",
        description: data.description || "",
        domains: data.domains || [],
        contact: data.contact || { email: data.email }, // fallback
        socialMedia: data.socialMedia || {},
        coordinators: data.coordinators || [],
        hostedProjects: data.hostedProjects || [],
        partnerIn: data.partnerIn || [],
      });

      navigate("/");
    } catch (err: any) {
      if (err.message === "Please verify your email first") {
        setErrorMsg(
          "You need to verify your email address first. Please check your inbox!"
        );
      } else {
        setErrorMsg(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2>NGO Login</h2>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Login"}
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;
