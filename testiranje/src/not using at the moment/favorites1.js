import React, {useState, useEffect} from 'react'

const Favorites = () => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const closeDropdown = () => {
      setIsOpen(false);
    };
  
    return (
      <div className="dropdown" onBlur={closeDropdown}>
        <button className="dropbtn" onClick={toggleDropdown}>
          Menu
        </button>
        {isOpen && (
          <div className="dropdown-content">
            {/* Your menu sections here */}
            <a href="#">Section 1</a>
            <a href="#">Section 2</a>
            <a href="#">Section 3</a>
          </div>
        )}
      </div>
    );
  };
  

export default Favorites;