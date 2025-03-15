import React, { useState } from "react";
import InputBar from "./InputBar";
import { ResearchKeysType, ResearchType } from "../DataTypes";

interface searchBarPropt {
  input: string;
  handleChange: (value: string) => void;
}

const SearchBar = ({ input, handleChange }: searchBarPropt) => {
  return (
    <div className="w-full h-[5vh] ">
      <InputBar input={input} handleChange={handleChange} />
    </div>
  );
};

export default SearchBar;
