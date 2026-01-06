import { useState, useEffect } from "react";
import KioskLayout from "../components/layout/KioskLayout";
import VisitorForm from "../components/kiosk/VisitorForm";
import PhotoCapture from "../components/kiosk/PhotoCapture";
import BadgePreview from "../components/kiosk/BadgePreview";
import {
  submitCheckIn,
  uploadVisitPhoto,
  kioskCheckOutVisit as checkOutVisit,
  getActiveVisit,
} from "../services/checkInApi";

const STORAGE_KEY = "active_visit_id";
const STORAGE_SNAPSHOT_KEY = "active_visit_snapshot";

export default function Kiosk() {
  const [step, setStep] = useState("form");
  const [visitId, setVisitId] = useState(null);
  const [visitorData, setVisitorData] = useState(null);
  const [photoData, setPhotoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const restore = async () => {
      const savedVisitId = localStorage.getItem(STORAGE_KEY);
      if (!savedVisitId) return;

      try {
        setLoading(true);
        const visit = await getActiveVisit(savedVisitId);

        if (!visit || visit.status === "checked_out") {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_SNAPSHOT_KEY);
          return;
        }

        setVisitId(visit.id);
        setVisitorData({
          fullName: visit.visitor?.full_name || "",
          company: visit.visitor?.company || "",
          phone: visit.visitor?.phone || "",
          hostName: visit.host?.full_name || "Unknown",
        });
        setPhotoData(visit.photo_url || null);
        setStep("locked");

        localStorage.setItem(STORAGE_SNAPSHOT_KEY, JSON.stringify(visit));
      } catch (e) {
        console.error("Restore failed", e);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        full_name: formData.fullName,
        company: formData.company || null,
        phone: formData.phone,
        host_id: Number(formData.hostToVisit),
        purpose: formData.purposeOfVisit || null,
      };

      const visit = await submitCheckIn(payload);

      localStorage.setItem(STORAGE_KEY, visit.id);
      localStorage.setItem(STORAGE_SNAPSHOT_KEY, JSON.stringify(visit));

      setVisitId(visit.id);
      setVisitorData({
        ...formData,
        hostName: visit.host?.full_name || "Unknown",
      });
      setStep("photo");
    } catch (e) {
      setError(e.response?.data?.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoCapture = async (dataUrl) => {
    try {
      setLoading(true);
      setError(null);

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `visit_${visitId}.jpg`, { type: blob.type });

      const res = await uploadVisitPhoto(visitId, file);

      setPhotoData(dataUrl);

      const snapshot = JSON.parse(localStorage.getItem(STORAGE_SNAPSHOT_KEY) || "{}");
      localStorage.setItem(STORAGE_SNAPSHOT_KEY, JSON.stringify({ ...snapshot, photo_url: res?.photo_url }));

      setStep("success");
    } catch (e) {
      setError("Photo upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    const storedVisitId = localStorage.getItem(STORAGE_KEY);
    const id = visitId || storedVisitId;

    if (!id) {
      alert("No active visit");
      return;
    }

    try {
      setLoading(true);
      await checkOutVisit(Number(id));

      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_SNAPSHOT_KEY);

      setVisitId(null);
      setVisitorData(null);
      setPhotoData(null);
      setStep("form");

      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Checkout gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KioskLayout>
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700">
          ⚠ {error}
        </div>
      )}

      {loading && <div className="text-center text-lg font-semibold">Processing...</div>}

      {/* FORM */}
      {step === "form" && !visitId && <VisitorForm onSubmit={handleFormSubmit} />}

      {/* PHOTO */}
      {step === "photo" && visitorData && (
        <PhotoCapture visitorName={visitorData.fullName} onPhotoCapture={handlePhotoCapture} isSubmitting={loading} />
      )}

      {/* SUCCESS */}
      {step === "success" && visitorData && (
        <div className="space-y-8 text-center">
          <h2 className="text-4xl font-bold">Check-In Complete</h2>
          <p className="text-xl">Welcome, {visitorData.fullName}</p>

          <button onClick={() => setStep("badge")} className="w-full py-6 bg-indigo-600 text-white text-xl font-bold rounded-3xl">
            View Badge
          </button>

          <button onClick={handleCheckout} className="w-full py-6 bg-red-600 text-white text-xl font-bold rounded-3xl">
            Check Out
          </button>
        </div>
      )}

      {/* BADGE */}
      {step === "badge" && visitorData && photoData && (
        <div className="space-y-6">
          <BadgePreview
            visitorName={visitorData.fullName}
            company={visitorData.company}
            hostName={visitorData.hostName}
            visitorPhoto={photoData}
          />

          <button onClick={handleCheckout} className="w-full py-6 bg-red-600 text-white text-xl font-bold rounded-3xl">
            Check Out
          </button>
        </div>
      )}

      {step === "locked" && visitorData && (
        <div className="space-y-6 text-center">
          <h2 className="text-4xl font-bold text-red-600">Active Visit Detected</h2>
          <p className="text-xl">
            Visitor <b>{visitorData.fullName}</b> is still checked in.
          </p>

          <button onClick={handleCheckout} className="w-full py-6 bg-red-600 text-white text-xl font-bold rounded-3xl">
            Check Out Visitor
          </button>
        </div>
      )}
    </KioskLayout>
  );
}
