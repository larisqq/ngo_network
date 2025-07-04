// src/components/DeleteModal.tsx
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface DeleteModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  loading: boolean;
  error?: string | null;
  title?: string;
  message?: string;
  confirmLabel?: string;
}

const DeleteModal = ({
  show,
  onClose,
  onConfirm,
  loading,
  error,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmLabel = "Delete",
}: DeleteModalProps) => {
  const [password, setPassword] = useState("");

  const handleConfirm = () => {
    onConfirm(password);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
        <Form.Group className="mt-3">
          <Form.Label>Enter your password to confirm:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>
        {error && <div className="text-danger mt-2">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={loading}>
          {loading ? "Deleting..." : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
