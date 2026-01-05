import api from "./api";

export const fetchHosts = async () => {
  try {
    const response = await api.get("/hosts");
    return response.data.data; // Extract data array from success response
  } catch (error) {
    console.error("Failed to fetch hosts:", error);
    throw error;
  }
};

/**
 * Submit a visitor check-in to the backend.
 * @param {Object} payload - { full_name, company, phone, host_id, purpose }
 * @returns {Object} - Check-in response with visit data
 */
export const submitCheckIn = async (payload) => {
  try {
    const response = await api.post("/check-in", payload);
    return response.data.data; // Extract data from success response
  } catch (error) {
    console.error("Check-in failed:", error);
    throw error;
  }
};

/**
 * Upload a photo for a visit.
 * @param {number} visitId - The visit ID
 * @param {File} photoFile - The photo file to upload
 */
export const uploadVisitPhoto = async (visitId, photoFile) => {
  try {
    console.log("Starting photo upload for visit:", visitId, "File:", photoFile.name, "Size:", photoFile.size);
    
    const formData = new FormData();
    formData.append("photo", photoFile);

    const response = await api.post(`/visits/${visitId}/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log("Photo upload successful:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Photo upload failed:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

/**
 * Fetch active visits (security dashboard).
 */
export const fetchActiveVisits = async () => {
  try {
    const response = await api.get("/visits/active");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch active visits:", error);
    throw error;
  }
};

/**
 * Check out a visitor.
 * @param {number} visitId - The visit ID
 */
export const checkOutVisit  = async (visitId) => {
  try {
    const response = await api.post(`/visits/${visitId}/check-out`);
    return response.data.data;
  } catch (error) {
    console.error("Check-out failed:", error);
    throw error;
  }
};
