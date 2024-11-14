'use client'

import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver"; // Install with `npm install file-saver`
const samplePDF = "/data_structures_file.pdf";


export default function Home() {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [course, setCourse] = useState("");

  const modifyAndDownloadPDF = async () => {
    try {
      // Fetch and load your PDF
      const existingPdfBytes = await fetch(samplePDF).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Modify PDF (assuming the details are added to the first page)
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      firstPage.drawText(name, { x: 75, y: 312, size: 12, color: rgb(0, 0, 0) });
      firstPage.drawText(rollNumber, { x: 75, y: 285, size: 12, color: rgb(0, 0, 0) });
      firstPage.drawText(course, { x: 150, y: 259, size: 12, color: rgb(0, 0, 0) });

      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save();

      // Download the modified PDF
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, "DS_Practical_File.pdf");
    } catch (error) {
      alert("some error occured TRY AGAIN");
      return null;
    }

  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p className="bg-yellow-300 text-xl font-semibold p-2 rounded-md text-center sm:text-left text-amber-700 hover:bg-yellow-400 transition-colors duration-200 ease-in-out">
          DS Practical File Chahiye
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
                onChange={(e) => setName(e.target.value)}
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
            <li>
              <input
                type="text"
                className="bg-transparent border-b-2 border-gray-300 focus:border-gray-500 p-2 w-full mt-1"
                placeholder="Enter Course (FSD , DS)"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
              />
            </li>
          </ol>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <button
              type="button"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-12 sm:h-14 px-5 sm:px-6 transform hover:scale-105"
              onClick={modifyAndDownloadPDF}
            >
              Get PDF
            </button>
          </div>
        </form>
      </main>
    </div>

  );
}
