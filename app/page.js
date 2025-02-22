"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import "../styles/home.css";

const PDFViewer = dynamic(() => import("./components/PDFViewer"), { ssr: false });

export default function Home() {
  const [selectedPDF, setSelectedPDF] = useState(null);

  return (
      <div className="home-container">
        {selectedPDF ? (
            <PDFViewer file={selectedPDF} onClose={() => setSelectedPDF(null)} />
        ) : (
            <div className="buttons-container">
              <button className="btn" onClick={() => setSelectedPDF("/pdfs/summer-breeze.pdf")}>Menu</button>
            </div>
        )}
      </div>
  );
}
