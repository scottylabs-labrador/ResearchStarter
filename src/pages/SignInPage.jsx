import React from "react";
import { SignInButton } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="absolute w-full h-full text-center flex flex-col justify-center items-center bg-pink-200 object-contain">
      <div className="text-center flex flex-col justify-center items-center gap-y-10 p-8 border-4 bg-white border-transparent-white-md rounded-lg">
        <p className="text-1xl font-bold">
          Sign in <br></br> to your CMU Account
        </p>
        <SignInButton className="p-3 bg-magenta-hippo text-white rounded-lg"></SignInButton>
      </div>
    </div>
  );
};

export default SignInPage;
