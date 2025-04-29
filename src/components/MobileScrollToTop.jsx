import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MobileScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    const isMobile = window.innerWidth <= 768; // Considerando 768px como breakpoint para mobile
    
    if (isMobile && window.scrollY > 0) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [location.pathname]);

  return null;
};

export default MobileScrollToTop; 