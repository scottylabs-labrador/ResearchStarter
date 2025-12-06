import React from "react";
import { SignInButton } from "@clerk/clerk-react";
import Logo from "../assets/logo.png";
import TartanLogo from "../assets/tartan_logo.png";

const SignInPage = () => {
  return (
    // Main container covering the full screen
    <main className="absolute w-full h-full flex flex-col justify-center items-center bg-white">
      <img src={Logo} alt="Research Logo" className="h-40 mb-16" />

      {/* Sign in section */}
      <section className="text-center flex flex-col justify-center items-center gap-y-10 p-12 md:p-20 border-transparent-white-md shadow-lg w-3/4 h-3/5 md:w-1/3 bg-gradient-to-b from-violet-300 to-violet-100">
        <h2 className="text-3xl md:text-3xl font-medium leading-relaxed text-black font-roboto">
          <b>Sign in to your CMU Account</b>
        </h2>
        {/* CMU Mascot Image - enlarged for emphasis */}
        <img
          src={TartanLogo}
          alt="Carnegie Mellon Mascot"
          className="w-40 h-40 md:w-52 md:h-52 mb-3"
        />

        {/* Sign-in button styled to match the theme */} 
        <button className="py-4 px-20 bg-brand-300 shadow-md shadow-shadow-color text-white rounded-xl text-lg font-bold 
                         transition-all duration-300 ease-in-out hover:bg-brand-400 hover:scale-[1.05]">
          <SignInButton aria-label="Sign in to your CMU account" />
        </button>
      </section>
    </main>
  );
};

export default SignInPage;
