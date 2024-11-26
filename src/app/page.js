'use client'

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [showWarning, setShowWarning] = useState(true);
  const [message, setMessage] = useState("");
  const [buttonState, setButtonState] = useState("idle"); // "idle", "loading", "success"

  const handleAgree = () => setShowWarning(false);
  const handleExit = () => (window.location.href = "https://www.google.com");

  const handleClick = async () => {
    if (!message.trim()) {
      alert("Please fill details!");
      return;
    }
    if (buttonState === "loading") return;

    setButtonState("loading");

    setTimeout(() => {
      setButtonState("success");
      setTimeout(() => setButtonState("idle"), 2000);
    }, 1000);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-800 to-black p-8 rounded-xl shadow-xl max-w-sm w-full border border-gray-700">
            <h2 className="text-2xl font-extrabold text-red-500 mb-4 text-center">
              ⚠️ Critical Warning ⚠️
            </h2>
            <p className="text-gray-300 mb-6 text-center">
              This tool is provided "as is" and should be used at your own risk.
              The developers are not responsible for any misuse or incorrect usage.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-600 text-gray-200 px-5 py-2 rounded-full hover:bg-gray-500 transition-all duration-200 shadow-md"
                onClick={handleExit}
              >
                Exit
              </button>
              <button
                className="bg-blue-700 text-white px-5 py-2 rounded-full hover:bg-blue-600 shadow-lg transform hover:scale-105 transition-transform duration-200"
                onClick={handleAgree}
              >
                Agree
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex flex-col items-center gap-8 row-start-2">
        <p className="bg-yellow-300 text-xl font-semibold p-2 rounded-md text-center text-amber-700 hover:bg-yellow-400 transition-colors duration-200 ease-in-out">
          College ka kaam hai
        </p>
        <h1 className="font-bold text-6xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 text-center">
          Ho Jayega
        </h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
          <Link
            href="/java-practical-file"
            className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-teal-500 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 group"
          >
            <span className="text-lg font-bold group-hover:underline">Java Practical File</span>
            <p className="text-sm text-blue-200 group-hover:text-blue-100 mt-2">Access DS practical here.</p>
          </Link>
          <Link
            href="/ds-practical-file"
            className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 group"
          >
            <span className="text-lg font-bold group-hover:underline">DS Practical File</span>
            <p className="text-sm text-purple-200 group-hover:text-purple-100 mt-2">Access DS practical here.</p>
          </Link>
          {/* Add more links here as needed */}
        </div>
      </main>


      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <input
          className="bg-gray-800 border-2 border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          placeholder="Talk to me"
          onInput={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button
          onClick={handleClick}
          className="relative w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transform hover:scale-105 transition-transform duration-200"
        >
          {buttonState === "idle" && (
            <svg
              className="rotate-45"
              height="16"
              viewBox="0 0 16 16"
              width="16"
              style={{ color: `currentcolor` }}
            >
              <path
                d="M1 6L15 1L10 15L7.65955 8.91482C7.55797 8.65073 7.34927 8.44203 7.08518 8.34045L1 6Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="bevel"
                fill="transparent"
              />
            </svg>
          )}
          {buttonState === "loading" && (
            <div
              className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"
            />
          )}
          {buttonState === "success" && (
            <svg
              height="16"
              viewBox="0 0 16 16"
              width="16"
              style={{ color: "currentcolor" }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>
      </footer>
    </div>
  );
}
