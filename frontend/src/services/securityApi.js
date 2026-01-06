import api from "./api";

export default {
  getDashboard() {
    return api.get("/security");
  },
    checkOutVisit(visitId) {
    return api.post(`/visits/${visitId}/check-out`);
  },
};
