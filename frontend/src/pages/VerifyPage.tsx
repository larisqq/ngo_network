import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("No token provided.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/auth/verify/${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Verification failed");
        }
        setMessage(data.message);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  return (
    <div className="container my-5">
      <h2>Account Verification</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Alert variant="success">{message}</Alert>
      )}
    </div>
  );
};

export default VerifyPage;
