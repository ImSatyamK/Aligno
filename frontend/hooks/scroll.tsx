'use client';

import { useEffect, useRef, useState } from "react";

export function useHideOnScroll(threshold = 10) {
    const [hidden, setHidden] = useState(false);
    const lastY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;

            if (currentY < 50) {
                setHidden(false); // always show near the top
            } else if (currentY - lastY.current > threshold) {
                setHidden(true); // scrolling down
            } else if (lastY.current - currentY > threshold) {
                setHidden(false); // scrolling up
            }

            lastY.current = currentY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return hidden;
}