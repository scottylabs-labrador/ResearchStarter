import React, { useState } from 'react'
import InputBar from './InputBar'

const SearchBar = ({data, input,handleChange}) => {
    return (
        <div className='w-11/12 h-5/6'>
            <InputBar data={data} input={input} handleChange={handleChange}/>
            <div>Search Results</div>
        </div>
    )
}

export default SearchBar