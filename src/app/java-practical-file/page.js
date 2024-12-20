'use client'

import { useEffect, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver"; // Install with `npm install file-saver`
import { SaveUserData, SendMessage } from "../actions";
const samplePDF = "/java_ho_jayega.pdf";

export default function JavaPracticalFilePage() {
    const [name, setName] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [course, setCourse] = useState("");
    const [section, setSection] = useState("");
    const [showWarning, setShowWarning] = useState(true);
    const [message, setMessage] = useState("");
    const [messageSent, setMessageSent] = useState(false);
    const [buttonState, setButtonState] = useState("idle"); // "idle", "loading", "success"

    const handleAgree = () => {
        setShowWarning(false);
    };

    const handleExit = () => {
        window.location.href = "https://www.google.com"; // Navigate to another site
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const res = await loadRazorpayScript();
        if (!res) {
            alert("Razorpay SDK failed to load. Please check your network connection.");
            return;
        }

        // Send the data to the backend to create an order
        const orderResponse = await fetch('/api/createOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                courseId: 1,
                amount: 1, // Example: Amount to be paid (in smallest unit, e.g., paise for INR)
            }),
        });

        const orderData = await orderResponse.json();

        if (!orderData || !orderData.id) {
            alert('Failed to create order. Please try again.');
            return;
        }

        const options = {
            key: "rzp_live_kaU3jD9IXnmfzv", // Replace with your Razorpay Key ID
            amount: 1, // Amount in smallest currency unit (e.g., 100 paise for INR 1.00)
            currency: "INR",
            name: "Java Practical File PDF",
            description: "Payment for Java Practical File PDF",
            order_id: orderData.id, // Use the order ID returned from your backend
            handler: async function (response) {
                // After successful payment, call the backend to verify the payment
                const verifyResponse = await fetch('/api/verifyPayment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                    }),
                });

                const verifyData = await verifyResponse.json();
                if (verifyData.success) {
                    modifyAndDownloadPDF();
                } else {
                    alert('Payment verification failed. Please try again.');
                }
            },
            prefill: {
                name: name,
                email: `${rollNumber}@krmu.edu.in`,
            },
            theme: {
                color: "#00010a"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };


    // const handlePayment = async () => {
    //     const res = await loadRazorpayScript();
    //     if (!res) {
    //         alert("Razorpay SDK failed to load. Please check your network connection.");
    //         return;
    //     }

    //     const options = {
    //         key: "rzp_live_kaU3jD9IXnmfzv", // Replace with your Razorpay Key ID
    //         amount: 100, // Amount in smallest currency unit (e.g., 100 paise for INR 1.00)
    //         currency: "INR",
    //         name: "Assignment PDF",
    //         description: "Payment for Assignment PDF",
    //         handler: function (response) {
    //             modifyAndDownloadPDF();
    //             // alert("Payment successful! Your PDF is downloading...");
    //         },
    //         prefill: {
    //             name: name,
    //             email: `${rollNumber}@krmu.edu.in`,
    //             // contact: "9999999999"
    //         },
    //         theme: {
    //             color: "#00010a"
    //         },
    //         modal: {
    //             ondismiss: function () {
    //                 // alert("Payment process was cancelled.");
    //             }
    //         }
    //     };

    //     const paymentObject = new window.Razorpay(options);
    //     paymentObject.open();
    // };

    const handleClick = async () => {
        if (!name || !course || !rollNumber || !message.length) {
            alert("Please fill details!");
            return;
        }
        if (buttonState === "loading") return; // Prevent multiple clicks
        setButtonState("loading");
        if (message.trim()) {
            message.length > 0 && await SendMessage({ message, name, rollNumber, course });
            setMessage("")

        } else {
            setButtonState("idle");
            return;
        }
        // Simulate message sending

        setTimeout(() => {
            setButtonState("success");
            // After a short delay, reset to "idle"
            setTimeout(() => setButtonState("idle"), 2000);
        }, 0);
    };

    const modifyAndDownloadPDF = async () => {
        try {
            // Fetch and load your PDF
            const existingPdfBytes = await fetch(samplePDF).then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            // Modify PDF (assuming the details are added to the first page)
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
            firstPage.drawText(name, { x: 75, y: 175, size: 12, color: rgb(0, 0, 0) });
            firstPage.drawText(rollNumber, { x: 74, y: 137, size: 12, color: rgb(0, 0, 0) });
            firstPage.drawText(`${course} ${section ? `- ${section}` : ""}`, { x: 415, y: 300, size: 12, color: rgb(0, 0, 0), font: boldFont, });

            // Serialize the PDF to bytes
            const pdfBytes = await pdfDoc.save();

            // Download the modified PDF
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            saveAs(blob, "Java_Practical_File.pdf");
            await SaveUserData({ name, rollNumber, course: `${course} ${section}`, subject: "Java Practicals" });
        } catch (error) {
            alert("some error occured TRY AGAIN");
            return null;
        }
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <p className="bg-yellow-300 text-xl font-semibold p-2 rounded-md text-center sm:text-left text-amber-700 hover:bg-yellow-400 transition-colors duration-200 ease-in-out">
                    Java Practical File Chahiye
                </p>
                <h1 className="font-bold text-6xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                    Ho Jayega
                </h1>
                <form onSubmit={(e) => e.preventDefault()}>
                    <ol className="list-inside text-sm mb-7 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
                        <li className="mb-2">
                            <input
                                type="text"
                                className="bg-transparent border-b-2 border-gray-300 focus:border-gray-500 p-2 w-full mt-1"
                                placeholder="Enter Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value.toUpperCase())}
                                required
                            />
                        </li>
                        <li className="mb-2">
                            <input
                                type="number"
                                className="bg-transparent border-b-2 border-gray-300 focus:border-gray-500 p-2 w-full mt-1"
                                placeholder="Enter Roll No"
                                value={rollNumber}
                                onChange={(e) => setRollNumber(e.target.value)}
                                required
                            />
                        </li>
                        <li className="mb-2">
                            <select
                                className="bg-neutral-950 border-b-2 border-gray-300 focus:border-gray-500 p-2 w-full mt-1"
                                value={course}
                                onChange={(e) => setCourse(e.target.value.toUpperCase())}
                                required
                            >
                                <option value="">Select Course</option>
                                <option value="FSD">FSD</option>
                                <option value="DS">DS</option>
                                <option value="UI/UX">UI/UX</option>
                                <option value="CYBER SECURITY">Cyber Security</option>
                                <option value="AI & ML">AI & ML</option>
                                <option value="CORE">CORE</option>
                            </select>
                        </li>
                        {
                            course == "AI & ML" || course == "CORE" ?
                                <li className="mb-2">
                                    <input
                                        type="number"
                                        className="bg-transparent border-b-2 border-gray-300 focus:border-gray-500 p-2 w-full mt-1"
                                        placeholder="Enter Section"
                                        value={section}
                                        onChange={(e) => setSection(e.target.value)}
                                        required
                                    />
                                </li>
                                :
                                null
                        }

                    </ol>

                    <div className="flex gap-4 items-center flex-col sm:flex-row">
                        <button
                            type="button"
                            className={`rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-12 sm:h-14 px-5 sm:px-6 transform hover:scale-105`}
                            // onClick={modifyAndDownloadPDF}
                            onClick={modifyAndDownloadPDF}
                        >
                            Get PDF
                        </button>
                    </div>
                </form>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <input className="bg-transparent border-2 rounded-lg p-3" placeholder="Talk to me" onInput={(e) => setMessage(e.target.value)} value={message} />
                <button
                    onClick={handleClick}
                    className="relative w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white"
                >
                    {buttonState === "idle" && (
                        <svg className="rotate-45" data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: `currentcolor` }}>
                            <path d="M1 6L15 1L10 15L7.65955 8.91482C7.55797 8.65073 7.34927 8.44203 7.08518 8.34045L1 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="bevel" fill="transparent">
                            </path>
                        </svg>
                    )}
                    {buttonState === "loading" && (
                        <div
                            className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spinner"
                            style={{ animation: "spinner 1s linear infinite" }}
                        />
                    )}
                    {buttonState === "success" && (
                        <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: "currentcolor", animation: "fadeInTick 0.5s ease-out" }}>
                            <path fillRule="evenodd" clipRule="evenodd" d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z" fill="currentColor">
                            </path>
                        </svg>
                    )}
                </button>
            </footer>
        </div>
    );
}
