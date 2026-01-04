import React, { useState, useEffect } from 'react';

const VisitorForm = ({ onSubmit, onAskAI }) => {
  const [hosts, setHosts] = useState([]);
  const [loadingHosts, setLoadingHosts] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    phone: "",
    hostToVisit: "",
    purposeOfVisit: "",
  });

  // 🔹 Ambil data host dari backend
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/hosts");
        const data = await response.json();
        setHosts(data);
      } catch (error) {
        console.error("Failed to load hosts:", error);
      } finally {
        setLoadingHosts(false);
      }
    };

    fetchHosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.fullName && formData.hostToVisit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Registration
          </h2>
          <p className="text-slate-500 font-medium">
            Step 1: Visitor Information
          </p>
        </div>

        <button
          onClick={onAskAI}
          className="group flex items-center gap-3 px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
        >
          Speak with Concierge AI
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">
            Full Legal Name
          </label>
          <input
            required
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-6 py-5 rounded-2xl border-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">
            Company
          </label>
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-6 py-5 rounded-2xl border-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">
            Phone
          </label>
          <input
            required
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-6 py-5 rounded-2xl border-2"
          />
        </div>

        {/* HOST SELECT */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">
            Whom are you visiting?
          </label>

          <select
            required
            name="hostToVisit"
            value={formData.hostToVisit}
            onChange={handleChange}
            disabled={loadingHosts}
            className="w-full px-6 py-5 rounded-2xl border-2 bg-white"
          >
            <option value="">
              {loadingHosts ? "Loading hosts..." : "Select an internal contact"}
            </option>

            {hosts.map((host) => (
              <option key={host.id} value={host.id}>
                {host.name} — {host.department}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 pt-4">
          <button
            type="submit"
            className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-bold"
          >
            Check-In 
          </button>
        </div>
      </form>
    </div>
  );
};

export default VisitorForm;
