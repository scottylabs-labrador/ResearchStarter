import React from "react";

const Footer = () => {
  return (
    <div className="w-[100vw] px-14 py-8">
      <p className="text-sm">
        Designed, developed and maintained with <span className="text-red-500">&hearts;</span> by{" "}
        <a
          href="https://scottylabs.org"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline hover:opacity-80"
        >
          ScottyLabs
        </a>
        .
      </p>
    </div>
  );
};

export default Footer;
