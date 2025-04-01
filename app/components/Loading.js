// components/LogoFallback.js
"use client";
import Image from "next/image";

export default function Loading() {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <p>Se incarca...</p>
            {/*<Image src="/menume.svg" priority={false} alt="Menu Me" width={400} height={400} />*/}
        </div>
    );
}
