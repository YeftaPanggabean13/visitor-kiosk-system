import { useState } from "react";
import KioskLayout from "../components/layout/KioskLayout";
import VisitorForm from "../components/kiosk/VisitorForm";
import PhotoCapture from "../components/kiosk/PhotoCapture";

/**
 * Kiosk Page
 *
 * Main orchestrator for the visitor check-in flow:
 * 1. Form submission → collects visitor info
 * 2. Photo capture → takes visitor photo for badge
 * 3. Success → confirmation screen
 *
 * Future enhancements:
 * - Connect to backend API
 * - Add routing or wizard pattern
 * - Implement state persistence
 */

export default function Kiosk() {
  const [step, setStep] = useState("form"); // "form" | "photo" | "success"
  const [visitorData, setVisitorData] = useState(null);
  const [photoData, setPhotoData] = useState(null);

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
    setStep("success");
    // Future: Send photo to backend API here
  };

  // Handle AI concierge button - placeholder
  const handleAskAI = () => {
    console.log("Opening concierge AI assistant");
    // Future: Open AI chat or help panel
  };

  // Reset flow for next visitor
  const handleNewVisitor = () => {
    setStep("form");
    setVisitorData(null);
    setPhotoData(null);
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
        <div className="space-y-8">
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
                  {visitorData.hostToVisit === "1"
                    ? "John Smith — Engineering"
                    : visitorData.hostToVisit === "2"
                    ? "Jane Doe — Sales"
                    : visitorData.hostToVisit === "3"
                    ? "Michael Johnson — HR"
                    : visitorData.hostToVisit === "4"
                    ? "Sarah Williams — Management"
                    : visitorData.hostToVisit === "5"
                    ? "Reception — Front Desk"
                    : "Selected Host"}
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
              📋 Your badge has been printed
            </p>
            <p className="text-lg text-indigo-700">
              Please proceed to the reception desk to collect your visitor badge.
            </p>
          </div>

          {/* New Visitor Button */}
          <button
            onClick={handleNewVisitor}
            className="w-full py-6 px-6 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-900 rounded-3xl font-bold text-xl transition-colors duration-150"
          >
            Check In Another Visitor
          </button>
        </div>
      )}
    </KioskLayout>
  );
}
