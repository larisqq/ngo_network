import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instagram: "",
    password: "",
    confirmPassword: "",
    baseCountry: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isStrongPassword = (password: string) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!isStrongPassword(formData.password)) {
      setErrorMsg(
        "Password must be at least 8 characters long and include a capital letter, lowercase letter, number and symbol."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          instagram: formData.instagram || formData.email, // fallback logic
          password: formData.password,
          baseCountry: formData.baseCountry,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setSuccessMsg("Verification email sent! Please check your inbox.");
      setFormData({
        name: "",
        email: "",
        instagram: "",
        password: "",
        confirmPassword: "",
        baseCountry: "",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2>Sign Up as NGO</h2>

      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Organisation Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            isInvalid={errorMsg.toLowerCase().includes("email")}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Instagram Handle (optional)</Form.Label>
          <Form.Control
            type="text"
            name="instagram"
            placeholder="e.g. @yourngo"
            value={formData.instagram}
            onChange={handleChange}
            isInvalid={errorMsg.toLowerCase().includes("instagram")}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Country Code</Form.Label>
          <Form.Control
            type="text"
            name="baseCountry"
            placeholder="e.g. RO, IT, DE"
            value={formData.baseCountry}
            onChange={handleChange}
            required
            isInvalid={errorMsg.toUpperCase().includes("COUNTRY")}
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

        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Register"}
        </Button>
      </Form>
    </div>
  );
};

export default SignUpPage;
