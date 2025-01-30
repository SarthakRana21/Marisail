import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

const DropdownWithCheckBoxes = ({
  defaultUnit,
  heading,
  title,
  options,
  selectedOptions,
  setSelectedOptions,
  onOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  // Toggle dropdown visibility
  const handleDropdownToggle = () => {
    if (!isOpen) {
      onOpen(); // Call onOpen when the dropdown is opened
    }
    setIsOpen((prev) => !prev);
  };

  // Handle search input
  const handleInputChange = (e) => {
    const searchText = e.target.value;
    setInputText(searchText);

    // Filter options based on search text
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  // Handle checkbox selection
  const handleOptionChange = (option, e) => {
    e.stopPropagation(); // Stop event propagation to prevent dropdown from closing
    setSelectedOptions((prev) => {
      const currentSelections = prev[heading] || [];
      const updatedSelections = currentSelections.includes(option)
        ? currentSelections.filter((item) => item !== option) // Remove if already selected
        : [...currentSelections, option]; // Add if not selected

      return {
        ...prev,
        [heading]: updatedSelections,
      };
    });
  };

  // Update filtered options when the options prop changes
  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  return (
    <div className="custom-dropdown-container">
      {/* Dropdown Header */}
      <div
        className="custom-dropdown-header"
        onClick={handleDropdownToggle}
        aria-expanded={isOpen}
        aria-controls="dropdown-content"
        style={{ marginBottom: "10px", cursor: "pointer" }}
      >
        {title}
        <span className={`dropdown-icon ${isOpen ? "open" : ""}`}>
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 3 L5 7 L9 3"
              fill="none"
              stroke="black"
              strokeWidth="1.5"
            />
          </svg>
        </span>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div>
          {/* Search Input */}
          {options.length > 5 && (
            <input
              type="text"
              placeholder={defaultUnit ? `Search in ${defaultUnit}...` : "Search..."}
              value={inputText}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "8px 14px",
                margin: "0 0 12px 0",
                border: "1px solid #ccc",
                borderRadius: "4px",
                outline: "none",
                backgroundColor: "#f5f5f5",
              }}
            />
          )}

          {/* Options List */}
          <div id="dropdown-content" className="custom-dropdown-content">
            <div className="custom-dropdown-options">
              <Form>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <div
                      key={option}
                      className="custom-dropdown-option"
                      onClick={(e) => e.stopPropagation()} // Prevent clicks on the option from closing the dropdown
                    >
                      <Form.Check
                        type="checkbox"
                        id={`checkbox-${option}`}
                        label={option}
                        checked={
                          selectedOptions[heading]?.includes(option) || false
                        }
                        onChange={(e) => handleOptionChange(option, e)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="custom-dropdown-no-results">
                    No options available
                  </div>
                )}
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Prop Types Validation
DropdownWithCheckBoxes.propTypes = {
  heading: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedOptions: PropTypes.object.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
  defaultUnit: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
};

export default DropdownWithCheckBoxes;