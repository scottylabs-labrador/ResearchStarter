import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface InputBarPropt {
  input: string;
  handleChange: (value: string) => void;
}

const InputBar = ({ input, handleChange }: InputBarPropt) => {
  return (
    <div className="w-full px-4 py-1 h-full flex items-center border rounded-full border-gray-500">
      <FaSearch className="inline-block text-black" />
      <input
        type="text"
        className="px-4 bg-transparent w-full text-black border-none h-full text-xl focus:outline-none"
        placeholder="Search for research opportunities..."
        value={input}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
      ></input>
    </div>
  );
};

export default InputBar;
