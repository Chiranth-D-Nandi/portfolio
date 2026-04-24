// useNavColor.js - Custom hook for dynamic navigation colors
import { useState, useEffect } from 'react';

/**
 * Custom hook to determine navigation button colors based on scroll position
 * @param {Array} sections - Array of section refs with their background colors
 * @returns {string} - Color for navigation text ('white' or '#070111')
 */
export const useNavColor = (sections) => {
  const [navColor, setNavColor] = useState('#070111');
  
  useEffect(() => {
    const handleScroll = () => {
      const navHeight = 74;
      
      // Check which section the nav is currently overlapping
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          
          // If nav overlaps this section
          if (rect.top <= navHeight && rect.bottom > navHeight) {
            setNavColor(section.textColor);
            return;
          }
        }
      }
      
      // Default color if not overlapping any defined section
      setNavColor('#070111');
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);
  
  return navColor;
};
