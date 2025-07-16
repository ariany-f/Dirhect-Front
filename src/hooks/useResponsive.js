import { useState, useEffect } from 'react';

// Breakpoints consistentes em toda a aplicação
export const BREAKPOINTS = {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200
};

export const useResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            const newIsMobile = width <= BREAKPOINTS.MOBILE;
            const newIsTablet = width > BREAKPOINTS.MOBILE && width <= BREAKPOINTS.TABLET;
            const newIsDesktop = width > BREAKPOINTS.TABLET;
            
            // Só atualiza se realmente mudou para evitar re-renders desnecessários
            if (newIsMobile !== isMobile) {
                setIsMobile(newIsMobile);
            }
            if (newIsTablet !== isTablet) {
                setIsTablet(newIsTablet);
            }
            if (newIsDesktop !== isDesktop) {
                setIsDesktop(newIsDesktop);
            }
            
            setScreenSize({ width, height });
        };
        
        // Definir estado inicial
        handleResize();
        
        // Debounce para evitar muitas chamadas durante resize
        let timeoutId;
        const debouncedHandleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleResize, 100);
        };
        
        window.addEventListener('resize', debouncedHandleResize);
        
        return () => {
            window.removeEventListener('resize', debouncedHandleResize);
            clearTimeout(timeoutId);
        };
    }, [isMobile, isTablet, isDesktop]);

    return {
        isMobile,
        isTablet,
        isDesktop,
        screenSize,
        breakpoints: BREAKPOINTS
    };
};

export default useResponsive; 