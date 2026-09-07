
import React, { useState } from "react";

const Dropdown = ({options = [], placeholder = "Select", onSelect
}) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    onSelect?.(option);
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-light border border-dark dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {selected?.label || placeholder}
      </button>

      <ul className="dropdown-menu">
        {options.map((option) => (
          <li key={option.value}>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;

