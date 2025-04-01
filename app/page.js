"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import "../styles/home.css";

const PDFViewer = dynamic(() => import("./components/PDFViewer"), { ssr: false });

export default function Home() {
  const [selectedPDF, setSelectedPDF] = useState("/pdfs/summer_breeze.pdf");

  return (
      <div className="home-container">
          <PDFViewer file={"/pdfs/summer_breeze.pdf"} />
      </div>
  );
}
