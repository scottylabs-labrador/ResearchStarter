import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

const InputBar = ({data, input, setInput, handleChange}) => {
  return (
    <div className='bg-white w-full rounded-xl px-4 py-1 h-full flex items-center shadow-sm'>
        <FaSearch className='inline-block text-pink-800'/>
        <input className='px-4 bg-transparent border-none h-full text-xl focus:outline-none' placeholder="Search Opportunities"
        value={input} onChange={(e) => {handleChange(e.target.value, data, setInput)}}></input>
    </div>
  )
}

export default InputBar