import React, { useState } from "react";

import "../styles/Dropdown.css";

const Dropdown = ({
    options = [],
    placeholder = "Select",
    onSelect
}) => {
    const [selected, setSelected] = useState("");

    const handleSelect = (e) => {
        const index = Number(e.target.value);
        const selectedOption = options[index];

        setSelected(e.target.value);
        onSelect?.(selectedOption);
    };

    //to be added - all option for 1=1 query
    return (
        <div className="dropdown-wrapper">
            <select className="custom-dropdown" value={selected} onChange={handleSelect}
            >
                <option value="" disabled> {placeholder} </option>

                {options.map((option, index) => (
                    <option key={index} value={index}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;