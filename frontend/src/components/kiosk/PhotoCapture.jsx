import React, { useRef, useState, useEffect } from 'react';
const PhotoCapture = ({ onPhotoCapture, visitorName }) => {
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // State
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Constants
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

  // Initialize camera access
  useEffect(() => {
    initializeCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setCameraAvailable(true);
        setCameraError(null);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraAvailable(false);
      setCameraActive(false);

      // Determine the type of error
      if (error.name === 'NotAllowedError') {
        setCameraError(
          'Camera access was denied. Please check your device settings.'
        );
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera device found on this device.');
      } else {
        setCameraError(
          'Unable to access camera. Please try uploading a photo instead.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      const photoData = canvasRef.current.toDataURL('image/jpeg');
      setCapturedPhoto(photoData);
      stopCamera();
      console.log('Photo captured successfully');
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setUploadError(null);
    initializeCamera();
  };

  const handlePhotoConfirm = () => {
    if (capturedPhoto && onPhotoCapture) {
      onPhotoCapture(capturedPhoto);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setUploadError('Please upload a JPG or PNG image file.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('Image must be smaller than 2MB.');
      return;
    }

    // Read and display the file
    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedPhoto(event.target.result);
      setUploadError(null);
      stopCamera();
      console.log('Photo uploaded successfully');
    };
    reader.onerror = () => {
      setUploadError('Failed to read the image file.');
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Show captured photo
  if (capturedPhoto) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Photo Confirmation
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Step 2: Photo for Your Badge
          </p>
        </div>

        {/* Captured Photo Preview */}
        <div className="space-y-4">
          <p className="text-lg text-slate-700 font-semibold">
            Review your photo before continuing:
          </p>
          <div className="bg-slate-100 rounded-3xl overflow-hidden shadow-xl flex items-center justify-center">
            <img
              src={capturedPhoto}
              alt="Captured visitor photo"
              className="w-full h-full object-cover max-h-96"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={retakePhoto}
            className="py-6 px-6 border-2 border-slate-300 text-slate-900 rounded-3xl font-bold text-xl hover:bg-slate-100 transition-colors"
          >
            Retake Photo
          </button>
          <button
            onClick={handlePhotoConfirm}
            className="py-6 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-3xl font-bold text-xl transition-colors duration-150 shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Show camera or upload option
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          Photo Capture
        </h2>
        <p className="text-slate-500 font-medium mt-2">
          Step 2: Take a Photo for Your Badge
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-lg text-slate-600 mt-4 font-semibold">
              Initializing camera...
            </p>
          </div>
        </div>
      )}

      {/* Camera Available */}
      {cameraAvailable && !isLoading && (
        <div className="space-y-6">
          {/* Camera Preview */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <p className="text-lg text-blue-900 font-semibold">
              📷 Look at the camera and tap "Take Photo" when ready
            </p>
          </div>

          {/* Capture Button */}
          <button
            onClick={capturePhoto}
            className="w-full py-6 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-3xl font-bold text-xl transition-colors duration-150 shadow-lg"
          >
            Take Photo
          </button>
        </div>
      )}

      {/* Camera Not Available */}
      {!cameraAvailable && !isLoading && (
        <div className="space-y-6">
          {/* Error Message */}
          {cameraError && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
              <p className="text-lg text-amber-900 font-semibold">
                ⚠️ {cameraError}
              </p>
            </div>
          )}

          {/* Upload Alternative */}
          <div className="space-y-4">
            <p className="text-lg text-slate-700 font-semibold">
              Upload a photo instead:
            </p>

            {/* Upload Error */}
            {uploadError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <p className="text-lg text-red-900 font-semibold">
                  ⚠️ {uploadError}
                </p>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Upload Button */}
            <button
              onClick={triggerFileUpload}
              className="w-full py-6 px-6 border-2 border-indigo-300 bg-indigo-50 text-indigo-600 rounded-3xl font-bold text-xl hover:bg-indigo-100 transition-colors"
            >
              📁 Choose Photo from Device
            </button>

            {/* File Requirements */}
            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <p className="text-sm text-slate-600 font-medium">
                JPG or PNG • Max 2MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Canvas for Capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoCapture;
