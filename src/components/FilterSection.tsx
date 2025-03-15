import React from "react";
import CheckBox from "./CheckBox";
import Select, { MultiValue } from "react-select";
import { departmentOptions, OptionType } from "../FilterData";

interface FilterSectionPropt {
  onChecked: (target: HTMLInputElement) => false;
  onSelected: (e: MultiValue<OptionType>) => false;
}

const FilterSection = ({ onChecked, onSelected }: FilterSectionPropt) => {
  return (
    <div className="flex flex-col justify-normal items-start p-6 gap-y-5">
      <div>
        <h2 className="font-bold text-xl p-2 pl-0">College</h2>
        <CheckBox
          name="All"
          id={"CollegeAll"}
          labelText={"All"}
          onChecked={onChecked}
        />
        <CheckBox
          name="College of Engineering"
          id={"CollegeEng"}
          labelText={"College of Engineering"}
          onChecked={onChecked}
        />
        <CheckBox
          name="College of Fine Arts"
          id={"CollegeArt"}
          labelText={"College of Fine Arts"}
          onChecked={onChecked}
        />
        <CheckBox
          name="Dietrich College of Humanities & Social Sciences"
          id={"CollegeDie"}
          labelText={"Dietrich College of Humanities & Social Sciences"}
          onChecked={onChecked}
        />
        <CheckBox
          name="Heinz College of Information Systems and Public Policy"
          id={"CollegeHei"}
          labelText={"Heinz College of Information Systems and Public Policy"}
          onChecked={onChecked}
        />
        <CheckBox
          name="Mellon College of Science"
          id={"CollegeSci"}
          labelText={"Mellon College of Science"}
          onChecked={onChecked}
        />
        <CheckBox
          name="School of Computer Science"
          id={"CollegeSCS"}
          labelText={"School of Computer Science"}
          onChecked={onChecked}
        />
        <CheckBox
          name="Tepper School of Business"
          id={"CollegeTep"}
          labelText={"Tepper School of Business"}
          onChecked={onChecked}
        />
      </div>

      <div>
        <h2 className="font-bold text-xl p-2 pl-0">Department</h2>
        <div className="w-[80%]">
          <Select<OptionType, true>
            defaultValue={[]}
            name="colors"
            options={departmentOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(e) => {
              onSelected(e);
            }}
            isMulti
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
