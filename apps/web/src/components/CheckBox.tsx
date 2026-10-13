import React from 'react'

interface CheckBoxPropt {
    name: string;
    id: string;
    labelText: string;
    onChecked: (target: HTMLInputElement) => void;
  }

const CheckBox = ({ name, id, labelText, onChecked }: CheckBoxPropt) => {
    return (
        <div>
            <input className='collegeCheck' type="checkbox" name={name} id={id} onChange={(e) => onChecked(e.target)} defaultChecked /> <label htmlFor={id}>{labelText} </label>
        </div>
    )
}

export default CheckBox