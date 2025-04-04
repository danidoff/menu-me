"use client";
import { useState, useRef, useEffect } from "react";

export default function PinchZoomContainer({ children, onZoomChange }) {
    const [scale, setScale] = useState(1);
    const initialDistanceRef = useRef(null);

    useEffect(() => {
        if (onZoomChange) {
            onZoomChange(scale);
        }
    }, [scale, onZoomChange]);

    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            const [touch1, touch2] = e.touches;
            const dx = touch2.pageX - touch1.pageX;
            const dy = touch2.pageY - touch1.pageY;
            const distance = Math.hypot(dx, dy);
            initialDistanceRef.current = distance;
        }
    };

    const handleTouchMove = (e) => {
        if (e.touches.length === 2 && initialDistanceRef.current !== null) {
            const [touch1, touch2] = e.touches;
            const dx = touch2.pageX - touch1.pageX;
            const dy = touch2.pageY - touch1.pageY;
            const currentDistance = Math.hypot(dx, dy);
            const newScale = currentDistance / initialDistanceRef.current;
            // Clamp scale between 1 and 3
            const clampedScale = Math.min(Math.max(newScale, 1), 3);
            setScale(clampedScale);
            // Prevent default only if zoomed (this may not block all flipbook events)
            if (clampedScale > 1.01) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    };

    const handleTouchEnd = (e) => {
        if (e.touches.length < 2) {
            initialDistanceRef.current = null;
        }
    };

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
                transform: `scale(${scale})`,
                transformOrigin: "center center",
                width: "100%",
                height: "100%",
            }}
        >
            {children}
        </div>
    );
}
