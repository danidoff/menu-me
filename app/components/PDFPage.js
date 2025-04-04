"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import "../../styles/home.css";

const PDFViewer = dynamic(() => import("./PDFViewer"), { ssr: false });

export default function PDFPage() {
    
    const searchParams = useSearchParams();
    const pdfId = searchParams.get("id");

    const pdfMapping = {
        "summerbreeze": "/pdfs/summer-breeze.pdf",
        "laturn": "/pdfs/la-turn.pdf",
    };

    const fileUrl = pdfId && pdfMapping[pdfId] ? pdfMapping[pdfId] : null;

    return (
        <div className="home-container ">
            <PDFViewer file={fileUrl} />
        </div>
    );
}
