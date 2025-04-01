import "../styles/global.css";

export const metadata = {
  title: "Menu Me",
  description: "Simple menu viewer used for restaurants",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <title>Menu Me</title>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=3, user-scalable=yes"
            />
        </head>
        <body>{children}</body>
        </html>
    );
}
