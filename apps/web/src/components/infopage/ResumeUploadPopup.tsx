import React, { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface ResumeUploadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File | null) => void;
}

const ResumeUploadPopup: React.FC<ResumeUploadPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedFile);
    setSelectedFile(null); // Clear selected file after submission
    onClose();
  };

  return (
    <Modal
      title="Upload resume"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!selectedFile}>
            Upload
          </Button>
        </>
      }
    >
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        aria-label="Resume file"
        onChange={handleFileChange}
        className="block w-full text-small text-ink-secondary file:mr-3 file:h-[32px] file:cursor-pointer file:rounded-control file:border file:border-solid file:border-hairline-strong file:bg-surface file:px-3 file:text-small file:font-medium file:text-ink hover:file:bg-surface-muted"
      />
      {selectedFile ? <p className="mt-3 font-mono text-meta text-ink-muted">Selected: {selectedFile.name}</p> : null}
    </Modal>
  );
};

export default ResumeUploadPopup;
