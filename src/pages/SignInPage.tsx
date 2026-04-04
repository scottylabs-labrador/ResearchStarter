import React from "react";
import { signIn } from "../lib/authClient";
import Logo from "../assets/logo.png";
import TartanLogo from "../assets/tartan_logo.png";
import BackgroundImage from "../assets/login_background.png";

const SignInPage = () => {
  const handleSignIn = () => {
    signIn.oauth2({ providerId: "keycloak", callbackURL: `${window.location.origin}/` });
  };

  return (
    // Main container covering the full screen
    <main
      className="absolute w-full h-full flex flex-col justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <img src={Logo} alt="Research Logo" className="h-40 mb-16" />

      {/* Sign in section */}
      <section className="text-center flex flex-col justify-center items-center gap-y-10 rounded-2xl shadow-[0_8px_32px_rgba(30,30,30,0.6)] w-3/4 h-3/5 md:w-1/3 bg-gray-100/80">
        <h2 className="text-3xl md:text-3xl font-medium leading-relaxed text-black font-roboto">
          <b>Sign into your CMU Account</b>
        </h2>
        {/* CMU Mascot Image - enlarged for emphasis */}
        <img
          src={TartanLogo}
          alt="Carnegie Mellon Mascot"
          className="w-40 h-40 md:w-52 md:h-52 mb-3"
        />

        {/* Sign-in button styled to match the theme */}
        <button
          onClick={handleSignIn}
          aria-label="Sign in to your CMU account"
          className="w-1/2 py-4 px-20 bg-violet-400 shadow-md shadow-shadow-color text-black rounded-xl text-lg font-bold
                         transition-all duration-300 ease-in-out hover:bg-dark-color hover:scale-[1.05]"
        >
          Sign in
        </button>
      </section>
    </main>
  );
};

export default SignInPage;
