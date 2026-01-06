import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BadgePreview = ({
  visitorName = "Visitor Name",
  company = "Visitor Company",
  hostName = "Host Name",
  visitorPhoto = null,
  visitorId = null,
  validUntil = "Today",
}) => {
  const badgeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const finalVisitorId = visitorId || `VIS-${Date.now().toString().slice(-4)}`;

  const handlePrint = () => {
    if (!badgeRef.current) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(badgeRef.current.innerHTML);
    printWindow.document.close();
    printWindow.print();
  };

 const handleDownload = async () => {
  if (!badgeRef.current) return;
  setIsLoading(true);
  try {
    const canvas = await html2canvas(badgeRef.current, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? "landscape" : "portrait",
      unit: "px",        
      format: [imgWidth, imgHeight],
    });

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${visitorId || "VISITOR"}_badge.pdf`);
  } catch (e) {
    console.error(e);
    alert("Download failed");
  } finally {
    setIsLoading(false);
  }
};

  // Generate QR-like pattern
  const generateQRPattern = () => {
    const patterns = [];
    const size = 21;
    const cell = 100 / size;
    let seed = finalVisitorId.charCodeAt(0);

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        seed = (seed * 9301 + 49297) % 233280;
        if (seed / 233280 > 0.5) {
          patterns.push(
            <rect key={`${row}-${col}`} x={col * cell} y={row * cell} width={cell} height={cell} fill="black" />
          );
        }
      }
    }
    return patterns;
  };

  return (
    <div className="space-y-8">
      <div ref={badgeRef}>
        <div className="w-[380px] h-[580px] bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-200 mx-auto flex flex-col relative">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50 rounded-full -ml-24 -mb-24 blur-3xl opacity-50"></div>

          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-800 p-6 relative">
            <h2 className="text-white font-bold text-xs uppercase tracking-widest">VISITOR BADGE</h2>
            <div className="mt-2 text-white font-black text-xl">VISITOR</div>
          </div>

          {/* Photo */}
          <div className="flex justify-center -mt-12 relative z-10">
            {visitorPhoto ? (
              <img
                src={visitorPhoto}
                alt={visitorName}
                className="w-40 h-48 object-cover rounded-2xl border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-40 h-48 bg-slate-100 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-slate-400 text-4xl">
                📷
              </div>
            )}
          </div>

          {/* Visitor Info */}
          <div className="text-center mt-4 px-6">
            <h1 className="text-2xl font-black text-slate-900 truncate">{visitorName}</h1>
            <p className="text-indigo-600 font-bold text-sm truncate">{company}</p>

            <div className="w-full h-px bg-slate-200 my-4"></div>

            <div className="flex justify-between text-left px-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Visiting Host</p>
                <p className="text-sm font-bold text-slate-700 truncate">{hostName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Valid Until</p>
                <p className="text-sm font-bold text-slate-700 truncate">{validUntil}</p>
              </div>
            </div>

            {/* Badge ID + QR */}
            <div className="flex justify-between items-center mt-6 px-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Badge ID</p>
                <p className="text-lg font-black text-slate-800 font-mono">{finalVisitorId}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner">
                <svg viewBox="0 0 100 100" width="70" height="70">
                  <rect width="100" height="100" fill="transparent" />
                  {generateQRPattern()}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="max-w-sm mx-auto space-y-4 px-4">
        <button
          onClick={handlePrint}
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-3xl"
        >
          Print Badge
        </button>
        <button
          onClick={handleDownload}
          disabled={isLoading}
          className="w-full py-3 border-2 border-indigo-600 text-indigo-600 font-bold rounded-3xl"
        >
          {isLoading ? "Processing..." : "Download as PDF"}
        </button>
      </div>
    </div>
  );
};

export default BadgePreview;
