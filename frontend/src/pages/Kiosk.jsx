import { useState, useEffect, useRef } from "react";
import KioskLayout from "../components/layout/KioskLayout";
import VisitorForm from "../components/kiosk/VisitorForm";
import PhotoCapture from "../components/kiosk/PhotoCapture";
import BadgePreview from "../components/kiosk/BadgePreview";


export default function Kiosk() {
  const [step, setStep] = useState("form"); // "form" | "photo" | "success" | "badge"
  const [visitorData, setVisitorData] = useState(null);
  const [photoData, setPhotoData] = useState(null);
  const [visitorId, setVisitorId] = useState(null);
  // Auto-reset configuration
  const AUTO_RESET_SECONDS = 12; // configurable countdown duration
  const [secondsLeft, setSecondsLeft] = useState(0);
  const autoResetRef = useRef(null);
  const isAutoResetActiveRef = useRef(false);

  // Step 1: Handle form submission
  const handleFormSubmit = (formData) => {
    console.log("Visitor registration data:", formData);
    setVisitorData(formData);
    setStep("photo");
    // Future: Send to backend API here
  };

  // Step 2: Handle photo capture
  const handlePhotoCapture = (photoDataURL) => {
    console.log("Photo captured, size:", photoDataURL.length);
    setPhotoData(photoDataURL);
    
    // Generate mock visitor ID
    const timestamp = Date.now().toString().slice(-4);
    const id = `VIS-${timestamp}`;
    setVisitorId(id);
    
    setStep("success");
    // Future: Send photo to backend API here
  };

  // Centralized reset that clears all kiosk state and timers
  const resetKiosk = () => {
    clearAutoReset();
    setStep("form");
    setVisitorData(null);
    setPhotoData(null);
    setVisitorId(null);
    setSecondsLeft(0);
  };
  // Handle viewing badge preview
  const handleViewBadge = () => {
    setStep("badge");
  };

  // Handle badge actions (print, download, finish)
  const handlePrintBadge = (id) => {
    console.log("Printing badge:", id);
  };

  const handleDownloadBadge = (id) => {
    console.log("Downloading badge:", id);
  };

  const handleFinishCheckIn = () => {
    handleNewVisitor();
  };

  const handleNewVisitor = () => {
    resetKiosk();
  };

  // Auto-reset timer controls
  const startAutoReset = () => {
    clearAutoReset();
    setSecondsLeft(AUTO_RESET_SECONDS);
    isAutoResetActiveRef.current = true;
    autoResetRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // time's up
          clearAutoReset();
          resetKiosk();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const clearAutoReset = () => {
    if (autoResetRef.current) {
      clearInterval(autoResetRef.current);
      autoResetRef.current = null;
    }
    isAutoResetActiveRef.current = false;
    setSecondsLeft(0);
  };

  // Reset timer when user interacts with the screen on final pages
  const handleUserInteraction = () => {
    if (step === "success" || step === "badge") {
      // give user more time
      if (isAutoResetActiveRef.current) {
        setSecondsLeft(AUTO_RESET_SECONDS);
      } else {
        startAutoReset();
      }
    }
  };

  // Start auto-reset when entering success or badge steps
  useEffect(() => {
    if (step === "success" || step === "badge") {
      startAutoReset();
    } else {
      clearAutoReset();
    }

    return () => {
      // cleanup on unmount
      clearAutoReset();
    };
  }, [step]);

  // Handle AI concierge button - placeholder
  const handleAskAI = () => {
    console.log("Opening concierge AI assistant");
    // Future: Open AI chat or help panel
  };

  // Reset flow for next visitor (handled by resetKiosk)

  // Helper function to get host name from ID
  const getHostName = (hostId) => {
    const hostMap = {
      "1": "John Smith — Engineering",
      "2": "Jane Doe — Sales",
      "3": "Michael Johnson — HR",
      "4": "Sarah Williams — Management",
      "5": "Reception — Front Desk",
    };
    return hostMap[hostId] || "Selected Host";
  };

  return (
    <KioskLayout>
      {/* Step 1: Visitor Registration Form */}
      {step === "form" && (
        <VisitorForm onSubmit={handleFormSubmit} onAskAI={handleAskAI} />
      )}

      {/* Step 2: Photo Capture */}
      {step === "photo" && visitorData && (
        <PhotoCapture
          onPhotoCapture={handlePhotoCapture}
          visitorName={visitorData.fullName}
        />
      )}

      {/* Step 3: Success Confirmation */}
      {step === "success" && visitorData && photoData && (
        <div className="space-y-8" onClick={handleUserInteraction} onTouchStart={handleUserInteraction}>
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="inline-block">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-6xl">✓</span>
              </div>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Check-In Complete!
            </h2>
            <p className="text-2xl text-slate-600 font-medium">
              Welcome, {visitorData.fullName}
            </p>
          </div>

          {/* Confirmation Details */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                <span className="text-lg text-slate-600 font-medium">
                  Visiting:
                </span>
                <span className="text-xl text-slate-900 font-bold text-right">
                  {getHostName(visitorData.hostToVisit)}
                </span>
              </div>

              <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                <span className="text-lg text-slate-600 font-medium">
                  Phone:
                </span>
                <span className="text-xl text-slate-900 font-bold text-right">
                  {visitorData.phone}
                </span>
              </div>

              {visitorData.purposeOfVisit && (
                <div className="flex justify-between items-start">
                  <span className="text-lg text-slate-600 font-medium">
                    Purpose:
                  </span>
                  <span className="text-xl text-slate-900 font-bold text-right max-w-xs">
                    {visitorData.purposeOfVisit}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-8">
            <p className="text-2xl text-indigo-900 font-bold mb-2">
              📋 Your badge is ready
            </p>
            <p className="text-lg text-indigo-700">
              View, print, or download your visitor badge below.
            </p>
          </div>

          {/* Auto-reset countdown (non-alarming) */}
          {secondsLeft > 0 && (
            <div className="text-center text-sm text-slate-600">
              This screen will reset automatically in {secondsLeft}s
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleViewBadge}
              className="py-6 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-3xl font-bold text-xl transition-colors duration-150 shadow-lg"
            >
              👁️ View Visitor Badge
            </button>
            <button
              onClick={handleNewVisitor}
              className="py-6 px-6 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-900 rounded-3xl font-bold text-xl transition-colors duration-150"
            >
              ➕ Check In Another Visitor
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Badge Preview */}
      {step === "badge" && visitorData && photoData && visitorId && (
        <div onClick={handleUserInteraction} onTouchStart={handleUserInteraction} className="space-y-6">
          {secondsLeft > 0 && (
            <div className="text-center text-sm text-slate-600">
              This screen will reset automatically in {secondsLeft}s
            </div>
          )}
          <BadgePreview
            visitorName={visitorData.fullName}
            company={visitorData.company}
            hostName={getHostName(visitorData.hostToVisit)}
            visitorPhoto={photoData}
            visitorId={visitorId}
            onPrint={handlePrintBadge}
            onDownload={handleDownloadBadge}
            onFinish={handleFinishCheckIn}
          />
        </div>
      )}
    </KioskLayout>
  );
}
