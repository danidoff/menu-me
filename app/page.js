"use client";
import {useSearchParams} from "next/navigation";
import dynamic from "next/dynamic";
import {Suspense} from "react";
import "../styles/home.css";

const PDFViewer = dynamic(() => import("./components/PDFViewer"), {ssr: false});

export default function Home() {
    const searchParams = useSearchParams();
    const pdfId = searchParams.get("id");

    const pdfMapping = {
        "summerbreeze": "/pdfs/summer-breeze.pdf",
        "laturn": "/pdfs/la-turn.pdf",
    };

    const fileUrl = pdfId && pdfMapping[pdfId] ? pdfMapping[pdfId] : null;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="home-container ">

                <PDFViewer file={fileUrl}/>

            </div>
        </Suspense>
    );
}
