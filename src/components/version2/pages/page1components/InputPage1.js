import React, { useState, useEffect } from 'react';
import Section1 from './InputComponents/Section1';
import Section2 from './InputComponents/Section2';
import Section3 from './InputComponents/Section3';
//import Section4 from './InputComponents/Section4';
import dataManagerInstance from '../../DataManagement/Data';

const InputPage1 = ({maxHeight, handleDataChange }) => {
  // States to control the visibility of each section

  const [expanded, setExpanded] = useState({
    section1: true,
    section2: false,
    section3: false, //need EPS Info, blue for input, add DCF and CF, Gross Margin and COGS sensitivity
    section4: false,
  });

  useEffect(() => {
    setTimeout(() => {
    }, 10); // Delay to allow DataManager to 
    dataManagerInstance.updateRevInput();
  }, []);

  const borderColor = '#1976d2'

  // Function to toggle each section
  const toggleSection = (section) => {
    setExpanded((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div style={{ width: '99%', maxHeight: maxHeight, overflowY: 'auto', border: `2px solid ${borderColor}`}}>
      {/* Section 1 */}
      <Section1
        expanded={expanded.section1}
        toggleSection={() => toggleSection('section1')}
        handleDataChange={handleDataChange}
      />

      {/* Section 2 */}
      <Section2
        expanded={expanded.section2}
        toggleSection={() => toggleSection('section2')}
      />

      {/* Section 3 */}
      <Section3 
      expanded={expanded.section3}
      toggleSection={() => toggleSection('section3')}
      />

      {/* Section 4 */}
      {/* <Section4 
      expanded={expanded.section4}
      toggleSection={() => toggleSection('section4')}
      /> */}
    </div>
  );
};

export default InputPage1;
