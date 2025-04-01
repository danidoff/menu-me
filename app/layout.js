import "../styles/global.css";

export const metadata = {
  title: "Menu Me",
  description: "Simple menu viewer used for restaurants",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}
