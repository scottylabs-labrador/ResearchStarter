import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <main className="min-h-screen w-full pt-32 text-center flex flex-col justify-center items-center gap-y-10">
      <FaExclamationTriangle className="text-8xl text-yellow-400" />
      <p className="text-3xl leading-relaxed m-4">
        womp womp this page doesn't exist...
      </p>
    </main>
  );
};

export default NotFoundPage;
