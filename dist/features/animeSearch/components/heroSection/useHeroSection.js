import { useState, useEffect, useCallback } from 'react';
export const useHeroSection = (slides) => {
    const [current, setCurrent] = useState(0);
    const length = slides ? slides.length : 0;
    // Logic tự động chuyển slide
    useEffect(() => {
        if (length === 0)
            return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
        }, 7000);
        return () => clearInterval(timer);
    }, [length]);
    // Logic chuyển slide khi click dot
    const moveDot = useCallback((index) => {
        setCurrent(index);
    }, []);
    // Kiểm tra tính hợp lệ của dữ liệu để quyết định có render hay không
    const hasSlides = Array.isArray(slides) && slides.length > 0;
    return {
        current,
        moveDot,
        hasSlides,
    };
};
//# sourceMappingURL=useHeroSection.js.map