import React, { useState, useEffect } from 'react';
import { fetchHosts } from '../../services/checkInApi';

const VisitorForm = ({ onSubmit, onAskAI }) => {
  const [hosts, setHosts] = useState([]);
  const [hostsLoading, setHostsLoading] = useState(true);
  const [hostsError, setHostsError] = useState(null);
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    phone: "",
    hostToVisit: "",
    purposeOfVisit: "",
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Fetch hosts on component mount
  useEffect(() => {
    const loadHosts = async () => {
      try {
        setHostsLoading(true);
        const data = await fetchHosts();
        setHosts(data);
        setHostsError(null);
      } catch (error) {
        console.error('Error loading hosts:', error);
        setHostsError('Failed to load hosts. Please try again.');
        setHosts([]);
      } finally {
        setHostsLoading(false);
      }
    };

    loadHosts();
  }, []);

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.hostToVisit.trim()) {
      newErrors.hostToVisit = "Please select who you are visiting";
    }

    // Purpose is optional, but validate if provided
    // (future: could add character limit or format check)

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (touched[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Validation passed
      console.log("Form submitted successfully:", formData);
      
      // Show success feedback
      setSuccessMessage(true);
      
      // Call parent callback if provided
      if (onSubmit) {
        onSubmit(formData);
      }

      // Reset form after 2 seconds
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
        setSubmitted(false);
        setSuccessMessage(false);
      }, 2000);
    }
  };

  return (
    <div className="space-y-10">
      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="p-6 bg-green-50 border-2 border-green-200 rounded-2xl">
          <p className="text-2xl font-bold text-green-700">
            ✓ Check-in Successful!
          </p>
          <p className="text-lg text-green-600 mt-2">
            Thank you for registering. Your host has been notified.
          </p>
        </div>
      )}

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

        {onAskAI && (
          <button
            onClick={onAskAI}
            className="group flex items-center gap-3 px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
          >
            Speak with Concierge AI
          </button>
        )}
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">
            Full Legal Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your full name"
            className={`w-full px-6 py-5 rounded-2xl border-2 text-lg font-medium transition-colors ${
              errors.fullName && touched.fullName
                ? "border-red-400 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
                : "border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
            }`}
          />
          {errors.fullName && touched.fullName && (
            <p className="text-red-600 font-semibold text-sm mt-2">
              ⚠ {errors.fullName}
            </p>
          )}
        </div>

        {/* Company */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">
            Company
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Company name"
            className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-colors"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="(555) 123-4567"
            className={`w-full px-6 py-5 rounded-2xl border-2 text-lg font-medium transition-colors ${
              errors.phone && touched.phone
                ? "border-red-400 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
                : "border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
            }`}
          />
          {errors.phone && touched.phone && (
            <p className="text-red-600 font-semibold text-sm mt-2">
              ⚠ {errors.phone}
            </p>
          )}
        </div>

        {/* Host to Visit */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">
            Whom are you visiting? *
          </label>
          {hostsError && (
            <p className="text-red-600 font-semibold text-sm">
              ⚠ {hostsError}
            </p>
          )}
          <select
            name="hostToVisit"
            value={formData.hostToVisit}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={hostsLoading || hostsError}
            className={`w-full px-6 py-5 rounded-2xl border-2 bg-white text-lg font-medium transition-colors ${
              hostsLoading || hostsError ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              errors.hostToVisit && touched.hostToVisit
                ? "border-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
                : "border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
            }`}
          >
            <option value="">
              {hostsLoading ? "Loading hosts..." : "Select an internal contact"}
            </option>
            {hosts.map((host) => (
              <option key={host.id} value={host.id}>
                {host.name} — {host.department}
              </option>
            ))}
          </select>
          {errors.hostToVisit && touched.hostToVisit && (
            <p className="text-red-600 font-semibold text-sm mt-2">
              ⚠ {errors.hostToVisit}
            </p>
          )}
        </div>

        {/* Purpose of Visit */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">
            Purpose of Visit
          </label>
          <textarea
            name="purposeOfVisit"
            value={formData.purposeOfVisit}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe the reason for your visit"
            rows="3"
            className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-colors resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 pt-4">
          <button
            type="submit"
            className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-3xl font-bold text-xl transition-colors duration-150 shadow-lg"
          >
            Check-In
          </button>
        </div>

        {/* Required Fields Note */}
        <div className="md:col-span-2 pt-4">
          <p className="text-sm text-slate-500">
            * Required fields
          </p>
        </div>
      </form>
    </div>
  );
};

export default VisitorForm;
