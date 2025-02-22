"use client";
import {useState, useEffect, useRef} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import HTMLFlipBook from "react-pageflip";
import "../../styles/pdfViewer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set the PDF.js worker path (make sure you’ve copied pdf.worker.min.js to your public folder)
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// Helper function to calculate dimensions based on the window size
const calculateDimensions = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth < 768) {
        // Use 98% of the screen width and calculate a proportional height.
        const width = Math.floor(windowWidth * 1.1);
        // Let's assume an aspect ratio of 4:3 (you can adjust this if needed)
        const height = Math.floor((width * 3) / 4);
        return { width, height };
    } else {
        return { width: 600, height: 900 };
    }
};

export default function PDFViewer({file, onClose}) {
    // Initialize dimensions once
    const [dimensions, setDimensions] = useState(calculateDimensions);
    const [numPages, setNumPages] = useState(null);
    const [pages, setPages] = useState([]);
    const resizeTimeout = useRef(null);

    // Effect: update dimensions on window resize using debouncing
    useEffect(() => {
        const handleResize = () => {
            if (resizeTimeout.current) {
                clearTimeout(resizeTimeout.current);
            }
            resizeTimeout.current = setTimeout(() => {
                const newDimensions = calculateDimensions();
                setDimensions((prev) => {
                    // Only update if dimensions changed
                    if (
                        prev &&
                        prev.width === newDimensions.width &&
                        prev.height === newDimensions.height
                    ) {
                        return prev;
                    }
                    return newDimensions;
                });
            }, 200);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
        };
    }, []); // Empty dependency array: run only once on mount

    // Effect: update pages when PDF is loaded or dimensions change
    useEffect(() => {
        if (numPages) {
            setPages(
                Array.from({length: numPages}, (_, index) => (
                    <div key={index}>
                        <Page className="flip-page" pageNumber={index + 1} width={dimensions.width}/>
                    </div>
                ))
            );
        }
    }, [numPages, dimensions]);

    return (
        <div className="pdf-viewer">
            <button onClick={onClose} className="close-btn">
                X
            </button>
            <div className="book-container">
                <Document
                    file={file}
                    onLoadSuccess={({numPages}) => setNumPages(numPages)}
                >
                    {numPages ? (
                        <div className="flipbook-wrapper">
                            <HTMLFlipBook
                                autoSize={false}
                                width={dimensions.width}
                                height={dimensions.height}
                                size="stretch"
                                minWidth={dimensions.width * 0.8}
                                maxWidth={dimensions.width}
                                minHeight={dimensions.height * 0.8}
                                maxHeight={dimensions.height}
                                showCover={true}
                                mobileScrollSupport={true}
                                drawShadow={true}
                                flippingTime={600}
                                useMouseEvents={true}
                                clickEventForward={true}
                                showPageCorners={true}
                                disableFlipByClick={false}
                                startPage={0}
                                startZIndex={1}
                                style={{
                                    border: "1px solid #ddd",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                }}
                                swipeDistance={30}
                                usePortrait={true}
                                onFlip={(e) => console.log(`Flipped to page ${e.data}`)}
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
