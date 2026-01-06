import React, { useState, useEffect } from "react";
import { fetchHosts } from "../../services/checkInApi";

  const VisitorForm = ({ onSubmit, onAskAI }) => {
    const [hosts, setHosts] = useState([]);
    const [hostsLoading, setHostsLoading] = useState(true);
    const [hostsError, setHostsError] = useState(null);

    const [formData, setFormData] = useState({
      fullName: "",
      company: "",
      phone: "",
      hostToVisit: "",
      purposeOfVisit: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [successMessage, setSuccessMessage] = useState(false);

    useEffect(() => {
      const loadHosts = async () => {
        try {
          setHostsLoading(true);
          const data = await fetchHosts();
          setHosts(data);
          setHostsError(null);
        } catch (err) {
          console.error(err);
          setHostsError("Failed to load hosts");
        } finally {
          setHostsLoading(false);
        }
      };

      loadHosts();
    }, []);


    const validate = () => {
      const e = {};

      if (!formData.fullName.trim()) {
        e.fullName = "Full name is required";
      }

      if (!formData.phone.trim()) {
        e.phone = "Phone number is required";
      } else if (!/^[\d\s()+-]+$/.test(formData.phone)) {
        e.phone = "Invalid phone number";
      }

      if (!formData.hostToVisit) {
        e.hostToVisit = "Please select a host";
      }

      return e;
    };


    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleBlur = (e) => {
      setTouched((p) => ({ ...p, [e.target.name]: true }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      const eMap = validate();
      setErrors(eMap);

      if (Object.keys(eMap).length > 0) return;

      setSuccessMessage(true);
      onSubmit?.(formData);

      setTimeout(() => {
        setFormData({
          fullName: "",
          company: "",
          phone: "",
          hostToVisit: "",
          purposeOfVisit: "",
        });
        setErrors({});
        setTouched({});
        setSuccessMessage(false);
      }, 1500);
    };

    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-3xl space-y-10">
          {/* SUCCESS */}
          {successMessage && (
            <div className="p-6 bg-green-100 border border-green-300 rounded-2xl text-center">
              <p className="text-2xl font-bold text-green-700">
                ✓ Check-in Successful
              </p>
            </div>
          )}

          {/* HEADER */}
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black text-slate-900">
              Visitor Registration
            </h1>
            <p className="text-lg text-slate-500">
              Please fill in your information
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* FULL NAME */}
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-2">
                Full Name *
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Your full name"
                className={`w-full px-6 py-5 text-xl rounded-2xl border-2 ${
                  errors.fullName && touched.fullName
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200"
                } focus:ring-2 focus:ring-indigo-300 outline-none`}
              />
              {errors.fullName && touched.fullName && (
                <p className="text-red-600 font-semibold mt-2">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* COMPANY */}
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-2">
                Company (Optional)
              </label>
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name"
                className="w-full px-6 py-5 text-xl rounded-2xl border-2 border-slate-200 focus:ring-2 focus:ring-indigo-300 outline-none"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-2">
                Phone Number *
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="08xxxxxxxxxx"
                className={`w-full px-6 py-5 text-xl rounded-2xl border-2 ${
                  errors.phone && touched.phone
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200"
                } focus:ring-2 focus:ring-indigo-300 outline-none`}
              />
              {errors.phone && touched.phone && (
                <p className="text-red-600 font-semibold mt-2">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* HOST */}
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-2">
                Visiting *
              </label>
              <select
                name="hostToVisit"
                value={formData.hostToVisit}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={hostsLoading || hostsError}
                className={`w-full px-6 py-5 text-xl rounded-2xl border-2 bg-white ${
                  errors.hostToVisit && touched.hostToVisit
                    ? "border-red-400"
                    : "border-slate-200"
                } focus:ring-2 focus:ring-indigo-300 outline-none`}
              >
                <option value="">
                  {hostsLoading ? "Loading hosts..." : "Select host"}
                </option>
                {hosts.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} — {h.department}
                  </option>
                ))}
              </select>
              {errors.hostToVisit && touched.hostToVisit && (
                <p className="text-red-600 font-semibold mt-2">
                  {errors.hostToVisit}
                </p>
              )}
            </div>

            {/* PURPOSE */}
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-2">
                Purpose of Visit (Optional)
              </label>
              <textarea
                name="purposeOfVisit"
                value={formData.purposeOfVisit}
                onChange={handleChange}
                rows={3}
                className="w-full px-6 py-5 text-xl rounded-2xl border-2 border-slate-200 focus:ring-2 focus:ring-indigo-300 outline-none resize-none"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white text-2xl font-bold rounded-3xl tracking-wide shadow-lg"
            >
              Check In
            </button>

            <p className="text-center text-slate-500 text-sm">
              * Required fields
            </p>
          </form>
        </div>
      </div>
    );
  };

export default VisitorForm;