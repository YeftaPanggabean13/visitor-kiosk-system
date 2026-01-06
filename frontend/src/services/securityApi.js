import api from "./api";

export default {
  getDashboard() {
    return api.get("/security");
  },
};
