"use client";
import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import HTMLFlipBook from "react-pageflip";
import "../../styles/pdfViewer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set the PDF.js worker path (ensure pdf.worker.min.js is in public/)
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// Calculate dimensions based on the viewport
const calculateDimensions = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (windowWidth < 768) {
        // On mobile: use 95% of the viewport width and height,
        // and constrain the height to maintain an approximate PDF aspect ratio.
        const width = windowWidth * 0.95;
        // Assume an aspect ratio (height/width) around 1.414 (like an A4 sheet in portrait)
        const height = Math.min(windowHeight * 0.95, width * 1.414);
        return { width, height };
    } else {
        // On desktop, you can use fixed dimensions or a similar calculation
        return { width: 600, height: 900 };
    }
};

export default function PDFViewer({ file, onClose }) {
    const [dimensions, setDimensions] = useState(calculateDimensions);
    const [numPages, setNumPages] = useState(null);
    const [pages, setPages] = useState([]);
    const resizeTimeout = useRef(null);

    // Update dimensions on window resize (debounced)
    useEffect(() => {
        const handleResize = () => {
            if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
            resizeTimeout.current = setTimeout(() => {
                const newDimensions = calculateDimensions();
                setDimensions(newDimensions);
            }, 200);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
        };
    }, []);

    // Recompute pages when the PDF loads or dimensions change
    useEffect(() => {
        if (numPages) {
            setPages(
                Array.from({ length: numPages }, (_, index) => (
                    <div key={index} className="flip-page-wrapper">
                        <Page pageNumber={index + 1} width={dimensions.width} />
                    </div>
                ))
            );
        }
    }, [numPages, dimensions]);

    return (
        <div className="pdf-viewer">
            {onClose && (
                <button onClick={onClose} className="close-btn">
                    X
                </button>
            )}
            <div className="book-container">
                <Document
                    file={file}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                >
                    {numPages ? (
                        <div className="flipbook-wrapper">
                            <HTMLFlipBook
                                autoSize={false}
                                width={dimensions.width}
                                height={dimensions.height}
                                size="stretch"
                                // Set min and max dimensions equal to the calculated values
                                minWidth={dimensions.width}
                                maxWidth={dimensions.width}
                                minHeight={dimensions.height}
                                maxHeight={dimensions.height}
                                showCover={true}
                                mobileScrollSupport={true}
                                drawShadow={false}
                                flippingTime={600}
                                useMouseEvents={true}
                                clickEventForward={true}
                                showPageCorners={true}
                                disableFlipByClick={false}
                                startPage={0}
                                startZIndex={1}
                                swipeDistance={30}
                                usePortrait={true}
                                onFlip={(e) =>
                                    console.log(`Flipped to page ${e.data}`)
                                }
                                className="flipbook"
                            >
                                {pages}
                            </HTMLFlipBook>
                        </div>
                    ) : (
                        <p className="loading-text">Loading PDF...</p>
                    )}
                </Document>
            </div>
        </div>
    );
}
