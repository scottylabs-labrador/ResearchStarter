import React, { useState } from "react";
import { useEffect } from "react";

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null); // State for storing the profile image

  useEffect(() => {
    const fetchResearches = async () => {
      try {
        const res = await fetch("http://localhost:8000/research");
        const data = await res.json();
      } catch {
        console.log("Error Fetching Data");
      } finally {
      }
    };

    fetchResearches();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file); // Create a preview URL for the image
      setProfileImage(imageURL);
    }
  };

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      {/* Profile Header */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={
                profileImage ||
                "https://via.placeholder.com/150?text=Upload+Image"
              }
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-300"
            />
            {/* Upload Button */}
            <label
              htmlFor="imageUpload"
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer"
            >
              📷
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Name and Headline */}
          <h1 className="text-2xl md:text-3xl font-bold mt-4">Your Name</h1>
          <p className="text-gray-600 text-lg">Your Headline (e.g., Software Engineer)</p>
        </div>
      </section>

      {/* Interests Section */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Interests</h2>
        <textarea
          placeholder="Share your interests..."
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </section>

      {/* Education Section */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Education</h2>
        <textarea
          placeholder="Add your education details..."
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </section>

      {/* Work Experience Section */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Work Experience</h2>
        <textarea
          placeholder="Add your work experience..."
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </section>

      {/* Skills Section */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Skills</h2>
        <textarea
          placeholder="List your skills..."
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </section>

      {/* Additional Information Section */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Additional Information</h2>
        <textarea
          placeholder="Add any other relevant details..."
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </section>
    </main>
  );
};

export default ProfilePage;
