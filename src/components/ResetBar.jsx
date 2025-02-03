import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const ResetBar = ({ selectedTags, removeTag, resetTags, removeFilter }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let temp = 0;
    for (const key in selectedTags) {
      temp += selectedTags[key].length;
    }
    setCount(temp);
  }, [selectedTags]);

  return (
    <div id="search-bar" style={{ maxWidth: "100%", }}>
      {/* {Object.keys(selectedTags).length !== 0 && ( */}
      <div>


        <div id="selected-tags" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "0.75rem" }}>
          <div style={{display:"flex",gap:"0.5rem"}}>
          {Object.keys(selectedTags).map((key) => (
            <div
              key={key}
            // style={{
            //   display: "flex",
            //   flexDirection: "column",
            //   gap: "0.5rem",
            //   background: "#E9ECEF",
            //   borderRadius: "8px",
            //   padding: "0.75rem",
            //   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            //   minWidth: "200px",
            // }}
            >
              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                {key}
                <span
                  className="close-button"
                  onClick={() => removeTag(key)}
                  style={{
                    color: "#FF4D4D",
                    marginLeft: "10px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    transition: "color 0.2s ease",
                  }}
                  onMouseOver={(e) => (e.target.style.color = "#D93025")}
                  onMouseOut={(e) => (e.target.style.color = "#FF4D4D")}
                >
                  ×
                </span>
              </div> */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {selectedTags[key].map((filter) => (
                  <div
                    key={filter}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#E0E7FF",
                      borderRadius: "5px",
                      padding: "5px 10px",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#333",
                      transition: "background 0.3s ease",
                    }}
                  >

                    {filter}
                    <span
                      className="close-button"
                      onClick={() => removeFilter(key, filter)}
                      style={{
                        color: "#D93025",
                        marginLeft: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "bold",
                        transition: "color 0.2s ease",
                      }}
                      onMouseOver={(e) => (e.target.style.color = "#B71C1C")}
                      onMouseOut={(e) => (e.target.style.color = "#D93025")}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          </div>

            <span
              onClick={resetTags}
              style={{
                cursor: "pointer",
                color: "#007BFF",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "underline",
              }}
            >
              Reset Filters
            </span>
        </div>
      </div>

    </div>
  );
};

ResetBar.propTypes = {
  selectedTags: PropTypes.object.isRequired,
  removeTag: PropTypes.func.isRequired,
  resetTags: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
};

export default ResetBar;
