import api from "./api";

const adminApi = {
  getDashboard() {
    return api.get("/security");
  },
    getDashboard() {
    return api.get("/admin");
  },
  getHosts() {
    return api.get("/admin/hosts"); // ambil dari tabel host
  },
  addHost(data) {
    return api.post("/admin/hosts", data); // tambah host ke tabel host
  },
  exportVisits() {
    return "/admin/visits/export";
  },
};

export default adminApi;
