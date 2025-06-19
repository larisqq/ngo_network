// src/pages/TestUploadPage.tsx
import { useState } from "react";
import { Button, Form, Spinner, Alert } from "react-bootstrap";

const TestUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:5000/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setUrl(data.url);
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Test Image Upload</h2>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Select an image to upload</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Form.Group>

      <Button variant="primary" onClick={handleUpload} disabled={loading}>
        {loading ? <Spinner size="sm" animation="border" /> : "Upload"}
      </Button>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {url && (
        <div className="mt-4">
          <p>
            <strong>Uploaded Image:</strong>
          </p>
          <img src={url} alt="Uploaded" className="img-fluid rounded shadow" />
        </div>
      )}
    </div>
  );
};

export default TestUploadPage;
