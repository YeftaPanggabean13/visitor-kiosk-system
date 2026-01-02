import api from "../services/api";

export default function Kiosk() {
  const testApi = async () => {
    try {
      const res = await api.get("/ping");
      console.log(res.data);
      alert("API connected! Check console.");
    } catch (err) {
      console.error(err);
      alert("API error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={testApi}
        className="px-6 py-3 bg-blue-600 text-white rounded"
      >
        Test API 
      </button>
    </div>
  );
}
