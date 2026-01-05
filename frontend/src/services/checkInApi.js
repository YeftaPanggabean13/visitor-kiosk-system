import api from "./api";

/**
 * Fetch all available hosts from the backend.
 */
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
    const formData = new FormData();
    formData.append("photo", photoFile);

    const response = await api.post(`/visits/${visitId}/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Photo upload failed:", error);
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
export const checkOutVisitor = async (visitId) => {
  try {
    const response = await api.post(`/visits/${visitId}/check-out`);
    return response.data.data;
  } catch (error) {
    console.error("Check-out failed:", error);
    throw error;
  }
};
