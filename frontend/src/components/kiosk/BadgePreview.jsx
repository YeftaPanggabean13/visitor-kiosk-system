import React from 'react';


const BadgePreview = ({
  visitorName = "John Visitor",
  company = "Visitor Company",
  hostName = "John Smith",
  visitorPhoto = null,
  visitorId = "VIS-0001",
  onPrint = () => {},
  onDownload = () => {},
  onFinish = () => {},
}) => {
  // Generate mock visitor ID if not provided
  const generateVisitorId = () => {
    const timestamp = Date.now().toString().slice(-4);
    return `VIS-${timestamp}`;
  };

  const finalVisitorId = visitorId || generateVisitorId();

  const handlePrint = () => {
    console.log("Print badge:", finalVisitorId);
    window.print();
    onPrint?.(finalVisitorId);
  };

  const handleDownload = () => {
    console.log("Download badge:", finalVisitorId);
    // Future: Implement PDF download
    alert("Download feature coming soon!");
    onDownload?.(finalVisitorId);
  };

  // Generate a simple visual QR pattern for demo
  const generateQRPattern = () => {
    // This creates a visual QR-like pattern
    // In production, use a real QR library like qrcode.react or qr-code-styling
    const patterns = [];
    const size = 21; // Standard QR code size

    // Create a deterministic pattern based on visitor ID
    let seed = finalVisitorId.charCodeAt(0);
    for (let i = 0; i < size * size; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      const shouldFill = (seed / 233280) > 0.5;

      if (shouldFill) {
        const x = (i % size) * 1.2;
        const y = Math.floor(i / size) * 1.2;
        patterns.push(
          <rect key={i} x={x} y={y} width="1" height="1" fill="black" />
        );
      }
    }
    return patterns;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          Visitor Badge
        </h2>
        <p className="text-slate-500 font-medium mt-2">
          Step 3: Your Visitor Badge
        </p>
      </div>

      {/* Badge Container */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-slate-200">
          {/* Badge Top Section - Branding */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
            <p className="text-white font-bold text-sm uppercase tracking-widest">
              VISITOR BADGE
            </p>
          </div>

          {/* Badge Content */}
          <div className="p-6 space-y-6">
            {/* Photo Section */}
            {visitorPhoto ? (
              <div className="flex justify-center">
                
                <img
                  src={visitorPhoto}
                  alt={visitorName}
                  className="w-40 h-48 object-cover rounded-2xl border-2 border-slate-300"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-40 h-48 bg-slate-100 rounded-2xl border-2 border-slate-300 flex items-center justify-center">
                  <span className="text-4xl text-slate-400">📷</span>
                </div>
              </div>
            )}

            {/* Visitor Information */}
            <div className="space-y-4 text-center">
              {/* Name */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Visitor Name
                </p>
                <p className="text-2xl font-black text-slate-900 break-words">
                  {visitorName}
                </p>
              </div>

              {/* Company */}
              {company && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Company
                  </p>
                  <p className="text-lg font-semibold text-slate-700">
                    {company}
                  </p>
                </div>
              )}

              {/* Host */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Visiting
                </p>
                <p className="text-lg font-semibold text-slate-700">
                  {hostName}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-200 my-4"></div>

              {/* Visitor ID */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Badge ID
                </p>
                <p className="text-xl font-bold text-indigo-600 font-mono">
                  {finalVisitorId}
                </p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="flex justify-center bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="bg-white p-3 rounded-lg border-2 border-slate-300">
                <svg
                  viewBox="0 0 100 100"
                  width="140"
                  height="140"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* White background */}
                  <rect width="100" height="100" fill="white" />

                  {/* Corner position markers */}
                  {/* Top-left */}
                  <rect x="2" y="2" width="7" height="7" fill="black" />
                  <rect x="3" y="3" width="5" height="5" fill="white" />
                  <rect x="4" y="4" width="3" height="3" fill="black" />

                  {/* Top-right */}
                  <rect x="91" y="2" width="7" height="7" fill="black" />
                  <rect x="92" y="3" width="5" height="5" fill="white" />
                  <rect x="93" y="4" width="3" height="3" fill="black" />

                  {/* Bottom-left */}
                  <rect x="2" y="91" width="7" height="7" fill="black" />
                  <rect x="3" y="92" width="5" height="5" fill="white" />
                  <rect x="4" y="93" width="3" height="3" fill="black" />

                  {/* Center data area - pattern based on visitor ID */}
                  {generateQRPattern()}

                  {/* Timing pattern */}
                  {[...Array(11)].map((_, i) => (
                    <rect
                      key={`timing-${i}`}
                      x={6 + i}
                      y="6"
                      width="1"
                      height="1"
                      fill={i % 2 === 0 ? "black" : "white"}
                    />
                  ))}
                </svg>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center pt-2 border-t border-slate-200">
              <p className="text-xs text-slate-500 font-medium">
                Valid for this visit only
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
        <p className="text-lg text-blue-900 font-semibold">
          📋 Your badge is ready! You can print it or download it for your records.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="w-full py-6 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-3xl font-bold text-xl transition-colors duration-150 shadow-lg"
        >
          🖨️ Print Badge
        </button>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full py-6 px-6 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 rounded-3xl font-bold text-xl transition-colors duration-150"
        >
          💾 Download as PDF
        </button>

        {/* Finish Button */}
        <button
          onClick={onFinish}
          className="w-full py-6 px-6 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-900 rounded-3xl font-bold text-xl transition-colors duration-150"
        >
          ✓ Finish
        </button>
      </div>

      {/* Hidden Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
            margin: 0;
            padding: 20px;
          }
          .space-y-8 > * {
            display: none;
          }
          .space-y-8 > div:nth-child(2) {
            display: block;
          }
          .space-y-8 > div:nth-child(2) {
            margin: 0;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
};

export default BadgePreview;
