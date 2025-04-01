"use client";
import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import HTMLFlipBook from "react-pageflip";
import "../../styles/pdfViewer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import Loading from "@/app/components/Loading";

// Set the PDF.js worker path (ensure pdf.worker.min.js is in public/)
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// Calculate dimensions based on the viewport
const calculateDimensions = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const A4_RATIO = 1.414; // height = width * 1.414 for A4

    if (windowWidth < 768) {
        // Mobile: use 95% of the viewport width and height, preserving A4 ratio
        const width = windowWidth * 0.95;
        const height = Math.min(windowHeight * 0.95, width * A4_RATIO);
        return { width, height };
    } else {
        // Desktop: reserve space for header and margins
        const headerHeight = 100; // pixels reserved for the header
        const verticalMargin = 40; // additional margin (top + bottom)
        const availableHeight = windowHeight - headerHeight - verticalMargin;
        // Optionally, use a percentage of the window width
        const availableWidth = windowWidth * 0.6;

        // Start by assuming we can use the full available width
        let width = availableWidth;
        let height = width * A4_RATIO;

        // If the calculated height is too tall for the available height,
        // adjust the width to fit the available height
        if (height > availableHeight) {
            height = availableHeight;
            width = height / A4_RATIO;
        }
        return { width, height };
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
            <div className="book-container">
                <Document loading={<Loading/>}
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
