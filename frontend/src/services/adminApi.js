import api from "./api";

const adminApi = {
  getDashboard() {
    return api.get("/admin/dashboard");
  },
};

export default adminApi;
