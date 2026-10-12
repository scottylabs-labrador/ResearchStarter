import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface InputBarPropt {
  input: string;
  handleChange: (value: string) => void;
}

const InputBar = ({ input, handleChange }: InputBarPropt) => {
  return (
    <div className="w-full h-11 px-4 flex items-center gap-3 border border-gray-300 rounded-full bg-white transition-colors focus-within:border-brand-400">
      <FaSearch className="inline-block text-gray-400 text-sm" />
      <input
        type="text"
        className="w-full bg-transparent text-sm text-gray-900 border-none focus:outline-none"
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
