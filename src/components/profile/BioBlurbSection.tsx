
import React, { useState, useRef, useEffect } from 'react';

interface BioBlurbSectionProps {
  initialBio?: string;
  onSave?: (bio: string) => void;
}

const BioBlurbSection: React.FC<BioBlurbSectionProps> = ({
  initialBio = "",
  onSave,
}) => {
  const [showBioEditModal, setShowBioEditModal] = useState(false);
  const [currentBio, setCurrentBio] = useState(initialBio);
  const [uploadedResumeFile, setUploadedResumeFile] = useState<File | null>(null);
  const [resumePreviewUrl, setResumePreviewUrl] = useState<string | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentBio(initialBio);
    return () => {
      // Clean up the object URL when the component unmounts or file changes
      if (resumePreviewUrl) {
        URL.revokeObjectURL(resumePreviewUrl);
      }
    };
  }, [initialBio, resumePreviewUrl]);

  const handleEditClick = () => {
    setShowBioEditModal(true);
  };

  const handleSaveBio = () => {
    if (onSave) {
      onSave(currentBio);
    }
    setShowBioEditModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentBio(e.target.value);
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (uploadedResumeFile && resumePreviewUrl) {
        URL.revokeObjectURL(resumePreviewUrl);
      }

      if (file) {
        const newPreviewUrl = URL.createObjectURL(file);
        setUploadedResumeFile(file);
        setResumePreviewUrl(newPreviewUrl);
        console.log("Resume uploaded:", file.name);
        // In a real application, you would handle the file upload here.
      }
    }
  };

  return (
    <section className="mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bio</h2>
      <div className="flex justify-between items-start bg-pink-hippo p-4 rounded-md">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap flex-grow">
          {initialBio || "No bio yet. Click edit to add one."}
        </p>
        <button
          onClick={handleEditClick}
          className="ml-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
        >
          Edit
        </button>
      </div>

      <div className="mt-4 flex space-x-2">
        {!uploadedResumeFile ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Upload Resume
          </button>
        ) : (
          <>
            <button
              onClick={() => setShowResumeModal(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Show Resume ({uploadedResumeFile.name})
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
            >
              Reupload Resume
            </button>
          </>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleResumeUpload}
          className="hidden"
          accept=".pdf,.doc,.docx"
        />
      </div>

      {showBioEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4">Edit Bio</h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={5}
              value={currentBio}
              onChange={handleChange}
            ></textarea>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowBioEditModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBio}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showResumeModal && uploadedResumeFile && resumePreviewUrl && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-4/5 h-4/5 flex flex-col">
            <h3 className="text-xl font-bold mb-4">{uploadedResumeFile.name}</h3>
            <div className="flex-grow mb-4">
              <iframe src={resumePreviewUrl} width="100%" height="100%" title="Resume Preview"></iframe>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowResumeModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BioBlurbSection;
