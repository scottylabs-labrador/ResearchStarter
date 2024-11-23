import React from 'react'

const CheckBox = ({ name, id, labelText, onChecked }) => {
    return (
        <div>
            <input type="checkbox" name={name} id={id} onChange={(e) => onChecked(e.target)} defaultChecked /> <label htmlFor={id}>{labelText} </label>
        </div>
    )
}

export default CheckBox