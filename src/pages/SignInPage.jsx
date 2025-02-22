import React from "react";
import { SignInButton } from "@clerk/clerk-react";
import Logo from "../assets/logo.png"
import TartanLogo from "../assets/tartan_logo.png"

const SignInPage = () => {
  return (
    // Main container covering the full screen with a dark red background
    <main className="absolute w-full h-full flex flex-col justify-center items-center bg-white">
      {/* Large bold header at the top */}
      <img src={Logo} alt="Research Logo" className="h-48 mb-16" />

      {/* White-centered section for the content */}
      <section className="text-center flex flex-col justify-center items-center gap-y-10 p-12 md:p-20  border-transparent-white-md rounded-lg shadow-lg w-4/5 md:w-2/5 h-1/2 bg-light-color">
        <h2 className="text-3xl md:text-3xl font-medium leading-relaxed text-black font-roboto">
          Sign in to your CMU Account
        </h2>
        {/* CMU Mascot Image - enlarged for emphasis */}
        <img
          src={TartanLogo}
          alt="Carnegie Mellon Mascot"
          className="w-40 h-40 md:w-52 md:h-52 mb-3"
        />

        {/* Subheader text prompting users to sign in */}

        {/* Sign-in button styled to match the theme */}
        <SignInButton
          className="py-4 px-20 bg-dark-color shadow-md shadow-shadow-color  text-black rounded-xl text-lg font-bold hover:bg-shadow-color"
          aria-label="Sign in to your CMU account"
        />
      </section>
    </main>
  );
};

export default SignInPage;
