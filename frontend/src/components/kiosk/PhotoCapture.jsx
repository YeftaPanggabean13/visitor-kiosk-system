import React, { useRef, useState, useEffect } from "react";

const PhotoCapture = ({ onPhotoCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  // 🔑 INI KUNCI ANTI BLACK SCREEN
  const [videoKey, setVideoKey] = useState(0);

  useEffect(() => {
    if (!capturedPhoto) {
      initializeCamera();
    }

    return () => stopCamera();
  }, [capturedPhoto, videoKey]);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      setCameraReady(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraAvailable(true);
      setCameraError(null);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraAvailable(false);
      setCameraError("Unable to access camera");
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert("Camera not ready");
      return;
    }

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    if (!dataUrl || dataUrl.endsWith(",")) return;

    setCapturedPhoto(dataUrl);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setUploadError(null);
    setCameraReady(false);

    // 🔥 FORCE VIDEO RESET
    setVideoKey((k) => k + 1);
  };

  const confirmPhoto = () => {
    if (capturedPhoto) onPhotoCapture(capturedPhoto);
  };

  /* PREVIEW */
  if (capturedPhoto) {
    return (
      <div className="space-y-6">
        <img src={capturedPhoto} className="w-full h-96 object-cover rounded-2xl" />

        <button onClick={retakePhoto} className="w-full py-5 border rounded-2xl">
          Retake
        </button>

        <button
          onClick={confirmPhoto}
          className="w-full py-5 bg-indigo-600 text-white rounded-2xl"
        >
          Continue
        </button>
      </div>
    );
  }

  /* CAMERA */
  return (
    <div className="space-y-6">
      {isLoading && <p>Initializing camera...</p>}

      {cameraAvailable && (
        <>
          <video
            key={videoKey} // 🔥 PAKSA REMOUNT
            ref={videoRef}
            autoPlay
            playsInline
            onLoadedMetadata={() => setCameraReady(true)}
            className="w-full h-96 bg-black object-cover rounded-2xl"
          />

          <button
            disabled={!cameraReady}
            onClick={capturePhoto}
            className={`w-full py-5 rounded-2xl font-bold
              ${
                cameraReady
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-400 text-gray-200"
              }`}
          >
            Take Photo
          </button>
        </>
      )}

      {!cameraAvailable && (
        <p className="text-red-600 font-semibold">{cameraError}</p>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoCapture;
