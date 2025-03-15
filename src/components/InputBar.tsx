import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface InputBarPropt {
  input: string;
  handleChange: (value: string) => void;
}

const InputBar = ({ input, handleChange }: InputBarPropt) => {
  return (
    <div className=" w-full rounded-xl px-4 py-1 h-full flex items-center shadow-sm bg-search-bar-color">
      <input
        type="text"
        className="px-4 bg-transparent w-full text-black border-none h-full text-xl focus:outline-none"
        placeholder="Search for ..."
        value={input}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
      ></input>
      <FaSearch className="inline-block text-grey-blue-color" />
    </div>
  );
};

export default InputBar;
