"use client";
import {Suspense} from "react";
import "../styles/home.css";
import PDFPage from "@/app/components/PDFPage";


export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PDFPage />
        </Suspense>
    );
}
