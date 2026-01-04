const DEFAULT_CONFIG = {
  minDelay: 400, // ms
  maxDelay: 900, // ms
  failureRate: 0.10, // 10% failure
};

const MOCK_HOSTS = [
  { id: "1", name: "John Smith", department: "Engineering" },
  { id: "2", name: "Jane Doe", department: "Sales" },
  { id: "3", name: "Michael Johnson", department: "HR" },
  { id: "4", name: "Sarah Williams", department: "Management" },
  { id: "5", name: "Reception", department: "Front Desk" },
];

function randomDelay(min = DEFAULT_CONFIG.minDelay, max = DEFAULT_CONFIG.maxDelay) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((res) => setTimeout(res, ms));
}

function shouldFail(failureRate = DEFAULT_CONFIG.failureRate) {
  return Math.random() < failureRate;
}

function makeResponse(success, data = null, message = "") {
  return { success, data, message };
}

/**
 * Create a mock API instance with optional configuration.
 * Returns an object with the endpoint functions.
 */
export function createMockApi(config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  async function getHosts() {
    await randomDelay(cfg.minDelay, cfg.maxDelay);
    if (shouldFail(cfg.failureRate)) {
      return makeResponse(false, null, "Failed to load hosts. Please try again.");
    }
    return makeResponse(true, MOCK_HOSTS, "Hosts loaded");
  }

  async function postUploadPhoto(fileData) {
    // fileData can be a DataURL or File-like object in future
    await randomDelay(cfg.minDelay, cfg.maxDelay + 200);
    if (shouldFail(cfg.failureRate)) {
      return makeResponse(false, null, "Photo upload failed. Try again.");
    }

    // Simulate storing and returning a photo URL or id
    const mockPhotoId = `photo_${Date.now().toString().slice(-6)}`;
    const mockUrl = typeof fileData === "string" && fileData.startsWith("data:")
      ? fileData
      : `data:image/jpeg;base64,MOCK_${mockPhotoId}`;

    return makeResponse(true, { photoId: mockPhotoId, url: mockUrl }, "Photo uploaded");
  }

  async function postCheckIn(payload) {
    // payload: { fullName, company, phone, hostToVisit, purposeOfVisit, photoId }
    await randomDelay(cfg.minDelay, cfg.maxDelay + 300);
    if (shouldFail(cfg.failureRate)) {
      return makeResponse(false, null, "Check-in failed. Please try again.");
    }

    const checkInId = `CHK-${Date.now().toString().slice(-6)}`;
    const visitorId = `VIS-${Math.floor(Math.random() * 9000 + 1000)}`;

    const record = {
      checkInId,
      visitorId,
      receivedAt: new Date().toISOString(),
      payload,
    };

    return makeResponse(true, record, "Check-in successful");
  }

  async function postCheckOut(payload) {
    // payload: { checkInId, visitorId }
    await randomDelay(cfg.minDelay, cfg.maxDelay);
    if (shouldFail(cfg.failureRate)) {
      return makeResponse(false, null, "Check-out failed. Please try again.");
    }

    return makeResponse(true, { ...payload, checkedOutAt: new Date().toISOString() }, "Checked out");
  }

  return {
    getHosts,
    postUploadPhoto,
    postCheckIn,
    postCheckOut,
    cfg,
  };
}

// Default exported instance for easy import
const mockApi = createMockApi();
export default mockApi;
