import React from "react";
import CheckBox from "./CheckBox";
import Select from 'react-select'
import { departmentOptions } from "../filterData";


const FilterSection = ({ criteria = "Department" }) => {

  return (
    <div className="flex flex-col justify-normal items-start p-6 gap-y-5">
      <div>
        <h2 className="font-bold text-xl p-2 pl-0">College</h2>
        <CheckBox id={"CollegeAll"} labelText={"All"} />
        <CheckBox id={"CollegeEng"} labelText={"College of Engineering"}/>
        <CheckBox id={"CollegeArt"} labelText={"College of Fine Arts"}/>
        <CheckBox id={"CollegeDie"} labelText={"Dietrich College of Humanities & Social Sciences"}/>
        <CheckBox id={"CollegeHei"} labelText={"Heinz College of Information Systems and Public Policy"}/>
        <CheckBox id={"CollegeSci"} labelText={"Mellon College of Science"}/>
        <CheckBox id={"CollegeSCS"} labelText={"School of Computer Science"}/>
        <CheckBox id={"CollegeTep"} labelText={"Tepper School of Business"}/>
      </div>
      <div>
        <h2 className="font-bold text-xl p-2 pl-0">Department</h2>
        <div className="w-60">
        <Select
            defaultValue={[]}
            isMulti
            name="colors"
            options={departmentOptions}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
