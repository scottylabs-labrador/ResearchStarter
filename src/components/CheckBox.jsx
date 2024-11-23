import React from 'react'

const CheckBox = ({id, labelText}) => {
  return (
    <div>
        <input type="checkbox" name={id} id={id} /> <label htmlFor={id}>{labelText}</label>
    </div>
  )
}

export default CheckBox