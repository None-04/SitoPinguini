import React, { useState, useEffect, useRef } from 'react';

// Navigation Component
const Navigation = ({ activeSection, setActiveSection, sections }) => {
    const wordRefs = useRef([]);
  
    const addToRefs = (el) => {
      if (el && !wordRefs.current.includes(el)) {
        wordRefs.current.push(el);
      }
    };
  
    return (
      <div className="relative mb-8 w-full max-w-xl mx-auto">
        <div className="relative flex justify-between">
          {sections.map((section) => (
            <span
              key={section}
              ref={addToRefs}
              onClick={() => setActiveSection(section)}
              className={`cursor-pointer px-3 py-2 text-sm font-medium ${activeSection === section ? 'text-[rgb(230,164,14)]' : 'text-white hover:text-gray-300'
                }`}
            >
              {section}
            </span>
          ))}
        </div>
        <Underline activeSection={activeSection} sections={sections} wordRefs={wordRefs} />
      </div>
    );
  };
  
// Underline Component
const Underline = ({ activeSection, sections, wordRefs }) => {
    const activeIndex = sections.indexOf(activeSection);
    const [lineWidth, setLineWidth] = useState(0);
    const [lineLeft, setLineLeft] = useState(0);

    useEffect(() => {
        if (wordRefs.current[activeIndex]) {
            const wordElement = wordRefs.current[activeIndex];
            setLineWidth(wordElement.offsetWidth);
            setLineLeft(wordElement.offsetLeft);
        }
    }, [activeIndex]);

    return (
        <div className="absolute bottom-0 left-0 w-full flex items-center">
            <div className="h-[2px] bg-gray-300 flex-grow" />
            <div
                className="absolute bg-[rgb(230,164,14)] h-[4px] transition-all duration-300"
                style={{
                    width: lineWidth,
                    left: lineLeft,
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
            />
        </div>
    );
};

export default Navigation;