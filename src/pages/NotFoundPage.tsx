import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div className="absolute h-full w-full top-30 text-center flex flex-col justify-center items-center gap-y-10">
      <FaExclamationTriangle className="text-8xl text-yellow-400" />
      <p className="text-3xl leading-relaxed m-4">
        womp womp this page doesn't exist...
      </p>
    </div>
  );
};

export default NotFoundPage;
