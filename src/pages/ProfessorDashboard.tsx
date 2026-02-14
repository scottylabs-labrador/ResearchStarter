import React from 'react';
import ProfessorPlaceholderImg from "../assets/professor_dashboard_placeholder.png";

const ProfessorDashboard = () => {
  return (
    <div className="flex justify-center min-h-screen bg-white pt-32 px-8">
      <div className="flex flex-row items-start gap-24 max-w-4xl w-full">
        
        {/* Professor image */}
        <div className="w-48 h-48 flex-shrink-0">
          <img 
            src={ProfessorPlaceholderImg} 
            alt="Professor John Doe" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Professor info */}
        <div className="flex flex-col pt-2">
          <h1 className="text-5xl font-extrabold text-black mb-8 tracking-tight">
            Professor John Doe
          </h1>

          <div className="grid grid-cols-[140px_1fr] gap-y-4 text-xl">
            <span className="font-bold text-gray-900">College</span>
            <span className="text-gray-800">SCS</span>

            <span className="font-bold text-gray-900">Department</span>
            <span className="text-gray-800">Human-Computer Interaction</span>

            <span className="font-bold text-gray-900">Email</span>
            <span className="text-gray-700">jdoe23@andrew.cmu.edu</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProfessorDashboard;