import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfessorPlaceholderImg from "../assets/professor_dashboard_placeholder.png";
import { useSession } from "../lib/authClient";

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const college = undefined;
  const department = undefined;

  return (
    <div className="flex flex-col items-center min-h-screen bg-white pt-32 px-8">
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
        <div className="flex flex-col pt-2 pb-16">
          <h1 className="text-5xl font-extrabold text-black mb-8 tracking-tight">
            {name}
          </h1>

          <div className="grid grid-cols-[140px_1fr] gap-y-4 text-xl">
            <span className="font-bold text-gray-900">College</span>
            <span className="text-gray-800">{college ?? "Not set"}</span>

            <span className="font-bold text-gray-900">Department</span>
            <span className="text-gray-800">{department ?? "Not set"}</span>

            <span className="font-bold text-gray-900">Email</span>
            <span className="text-gray-700">{email}</span>
          </div>
        </div>
      </div>

      <hr className="border-gray-300 w-full" />


      {/* Create new research opportunity button */}
      <div className="max-w-4xl w-full mt-8 flex justify-center">
        <button
          onClick={() => navigate("/professor-dashboard/create-opportunity")}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          + Add Research Opportunity
        </button>
      </div>
    </div>
  );
}

export default ProfessorDashboard;