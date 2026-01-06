import { useState } from "react";
import KioskLayout from "../components/layout/KioskLayout";
import VisitorForm from "../components/kiosk/VisitorForm";
import PhotoCapture from "../components/kiosk/PhotoCapture";
import BadgePreview from "../components/kiosk/BadgePreview";
import {
  submitCheckIn,
  uploadVisitPhoto,
  checkOutVisit,
} from "../services/checkInApi";

export default function Kiosk() {
  const [step, setStep] = useState("form"); // form | photo | success | badge
  const [visitorData, setVisitorData] = useState(null);
  const [photoData, setPhotoData] = useState(null);
  const [visitorId, setVisitorId] = useState(null);
  const [visitId, setVisitId] = useState(null);
  const [checkInError, setCheckInError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hosts] = useState([]);

  /* ======================
   * CHECK-IN
   * ====================== */
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setCheckInError(null);

      const payload = {
        full_name: formData.fullName,
        company: formData.company || null,
        phone: formData.phone,
        host_id: parseInt(formData.hostToVisit),
        purpose: formData.purposeOfVisit || null,
      };

      const response = await submitCheckIn(payload);

      setVisitId(response.id);
      setVisitorData(formData);
      setStep("photo");
    } catch (error) {
      setCheckInError(
        error.response?.data?.message ||
          "Check-in failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ======================
   * PHOTO
   * ====================== */
  const handlePhotoCapture = async (photoDataURL) => {
    try {
      setIsSubmitting(true);
      setCheckInError(null);

      const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new File([u8arr], filename, { type: mime });
      };

      if (visitId) {
        const photoFile = dataURLtoFile(
          photoDataURL,
          `photo_${visitId}.jpg`
        );
        await uploadVisitPhoto(visitId, photoFile);
      }

      setPhotoData(photoDataURL);
      setVisitorId(`VIS-${Date.now().toString().slice(-4)}`);
      setStep("success");
    } catch (error) {
      setCheckInError(
        error.response?.data?.message ||
          "Photo upload failed. Please try again."
      );

      // Tetap lanjut (kiosk friendly)
      setPhotoData(photoDataURL);
      setVisitorId(`VIS-${Date.now().toString().slice(-4)}`);
      setStep("success");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ======================
   * CHECKOUT (ONLY EXIT)
   * ====================== */
  const handleCheckOut = async () => {
    if (!visitId) return;

    try {
      setIsSubmitting(true);
      setCheckInError(null);

      await checkOutVisit(visitId);

      alert("Check-out successful!");
      resetKiosk();
    } catch (error) {
      setCheckInError(
        error.response?.data?.message ||
          "Check-out failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ======================
   * RESET (ONLY AFTER CHECKOUT)
   * ====================== */
  const resetKiosk = () => {
    setStep("form");
    setVisitorData(null);
    setPhotoData(null);
    setVisitorId(null);
    setVisitId(null);
    setCheckInError(null);
    setIsSubmitting(false);
  };

  const getHostName = (hostId) => {
    const host = hosts.find((h) => h.id === parseInt(hostId));
    return host ? host.name : "—";
  };

  /* ======================
   * RENDER
   * ====================== */
  return (
    <KioskLayout>
      {checkInError && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
          <p className="text-red-700 font-semibold">⚠ {checkInError}</p>
        </div>
      )}

      {step === "form" && <VisitorForm onSubmit={handleFormSubmit} />}

      {step === "photo" && visitorData && (
        <PhotoCapture
          onPhotoCapture={handlePhotoCapture}
          visitorName={visitorData.fullName}
          isSubmitting={isSubmitting}
        />
      )}

      {step === "success" && visitorData && photoData && (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <span className="text-6xl">✓</span>
            </div>
            <h2 className="text-4xl font-black">Check-In Complete</h2>
            <p className="text-2xl text-slate-600">
              Welcome, {visitorData.fullName}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setStep("badge")}
              className="py-6 bg-indigo-600 text-white rounded-3xl font-bold text-xl"
            >
              👁️ View Badge
            </button>

            <button
              onClick={handleCheckOut}
              className="py-6 bg-red-600 text-white rounded-3xl font-bold text-xl"
            >
              🔒 Check Out
            </button>
          </div>
        </div>
      )}

      {step === "badge" && visitorData && photoData && visitorId && (
        <div className="space-y-6">
          <BadgePreview
            visitorName={visitorData.fullName}
            company={visitorData.company}
            hostName={getHostName(visitorData.hostToVisit)}
            visitorPhoto={photoData}
            visitorId={visitorId}
          />

          <button
            onClick={handleCheckOut}
            className="w-full py-6 bg-red-600 text-white rounded-3xl font-bold text-xl"
          >
            🔒 Check Out & Finish Visit
          </button>
        </div>
      )}
    </KioskLayout>
  );
}
