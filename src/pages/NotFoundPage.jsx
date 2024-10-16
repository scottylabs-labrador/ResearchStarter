import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div className="absolute top-60 text-center flex flex-col justify-center items-center gap-y-10">
      <FaExclamationTriangle className="text-8xl text-yellow-400" />
      <h1 className="text-7xl font-bold">404 Not Found</h1>
      <p className="text-3xl leading-relaxed mr-4 ml-4">
        This page does not exist. Check your url link again or click{" "}
        <Link
          to="/"
          className="bg-magenta-hippo text-white hover:bg-magenta-dark-hippo rounded-md p-1"
        >
          this
        </Link>{" "}
        to go back to the home page.
      </p>
    </div>
  );
};

export default NotFoundPage;
