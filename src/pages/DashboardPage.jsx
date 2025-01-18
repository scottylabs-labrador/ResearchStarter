import React from "react";
import { SignInButton } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    // Main container covering the full screen with a dark red background
    <main className="absolute w-full h-full flex flex-col justify-center items-center bg-red-800">
      {/* Large bold header at the top */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8">
        CMU Research!
      </h1>
      
      {/* White-centered section for the content */}
      <section className="text-center flex flex-col justify-center items-center gap-y-10 p-12 md:p-20 bg-white border-4 border-transparent-white-md rounded-lg shadow-lg w-4/5 md:w-2/5 h-3/5">
        {/* CMU Mascot Image - enlarged for emphasis */}
        <img 
          src="https://www.cmu.edu/brand/brand-guidelines/images/mascot-3-color-600x600-min.jpg" 
          alt="Carnegie Mellon Mascot" 
          className="w-40 h-40 md:w-56 md:h-56 mb-6"
        />
        
        {/* Subheader text prompting users to sign in */}
        <h2 className="text-3xl md:text-4xl font-bold leading-relaxed text-black">
          Sign in <br /> to your CMU Account
        </h2>
        
        {/* Sign-in button styled to match the theme */}
        <SignInButton 
          className="py-4 px-10 bg-red-600 text-white rounded-xl text-lg font-bold hover:bg-red-700"
          aria-label="Sign in to your CMU account"
        />
      </section>
    </main>
  );
};

export default SignInPage;
