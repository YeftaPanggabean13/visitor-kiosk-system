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
  
  // In-memory visitor store to simulate current visitors inside the building
  const visitors = [];

  // Seed a few visitors for demo purposes
  (function seed() {
    const now = Date.now();
    const sample = [
      { fullName: 'Alice Nguyen', company: 'Acme Co', hostToVisit: '1', phone: '(555) 111-2222' },
      { fullName: 'Bob Lee', company: 'Globex', hostToVisit: '2', phone: '(555) 333-4444' },
      { fullName: 'Carla Diaz', company: 'Innotech', hostToVisit: '3', phone: '(555) 555-6666' },
    ];

    sample.forEach((p, i) => {
      const checkInId = `CHK-${(now + i).toString().slice(-6)}`;
      const visitorId = `VIS-${Math.floor(Math.random() * 9000 + 1000)}`;
      visitors.push({
        checkInId,
        visitorId,
        name: p.fullName,
        company: p.company,
        hostToVisit: p.hostToVisit,
        phone: p.phone,
        photoUrl: null,
        status: 'inside',
        checkedInAt: new Date(now - i * 60000).toISOString(),
      });
    });
  })();

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

  async function getCurrentVisitors() {
    await randomDelay(cfg.minDelay, cfg.maxDelay);
    if (shouldFail(cfg.failureRate)) {
      return makeResponse(false, null, 'Failed to load current visitors');
    }
    // Return visitors currently inside
    const inside = visitors.filter((v) => v.status === 'inside');
    return makeResponse(true, inside, 'Current visitors');
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
      name: payload.fullName,
      company: payload.company,
      hostToVisit: payload.hostToVisit,
      phone: payload.phone,
      photoUrl: payload.photoUrl || null,
      status: 'inside',
      checkedInAt: new Date().toISOString(),
      payload,
    };

    // Add to in-memory store
    visitors.push(record);

    return makeResponse(true, record, 'Check-in successful');
  }

  async function postCheckOut(payload) {
    // payload: { checkInId, visitorId }
    await randomDelay(cfg.minDelay, cfg.maxDelay);
    if (shouldFail(cfg.failureRate)) {
      return makeResponse(false, null, "Check-out failed. Please try again.");
    }

    // Mark visitor as checked out in the in-memory store if present
    const idx = visitors.findIndex((v) => v.checkInId === payload.checkInId || v.visitorId === payload.visitorId);
    if (idx !== -1) {
      visitors[idx] = { ...visitors[idx], status: 'checked_out', checkedOutAt: new Date().toISOString() };
    }

    return makeResponse(true, { ...payload, checkedOutAt: new Date().toISOString() }, 'Checked out');
  }

  return {
    getHosts,
    postUploadPhoto,
    postCheckIn,
    postCheckOut,
    getCurrentVisitors,
    cfg,
  };
}

// Default exported instance for easy import
const mockApi = createMockApi();
export default mockApi;
