import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Ho Jayega",
  description: "Bindaas Raho",
  icons: {
    icon: '/ho_jayega_logo.webp', // Path to your favicon file in the public folder
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <ToastContainer />
      </body>
    </html>
  );
}
