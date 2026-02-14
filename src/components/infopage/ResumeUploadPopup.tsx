import React, { useState } from 'react';

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">Upload Resume</h2>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100 mb-4"
        />
        {selectedFile && (
          <p className="text-sm text-gray-700 mb-4">Selected file: {selectedFile.name}</p>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedFile}
            className={"px-4 py-2 rounded-lg text-white font-semibold " +
              (selectedFile ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed') +
            " transition-colors"}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadPopup;
