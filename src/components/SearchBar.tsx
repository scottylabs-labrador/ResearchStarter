import React, { useState } from 'react'
import InputBar from './InputBar'
import { ResearchKeysType, ResearchType } from "../DataTypes";

interface searchBarPropt {
    data: ResearchType[];
    input: string;
    handleChange: (value: string) => "";
}

const SearchBar = ({data, input, handleChange}: searchBarPropt) => {
    return (
        <div className='w-11/12 h-4/6'>
            <InputBar data={data} input={input} handleChange={handleChange}/>
            {/* <div>Search Results</div> */}
        </div>
    )
}

export default SearchBar