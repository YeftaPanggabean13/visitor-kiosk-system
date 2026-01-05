import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await loginApi({
      email,
      password,
    });

    const { token, role, name, user_id } = res.data.data;

    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: user_id,
        name,
        role,
      })
    );

    if (role === "admin") {
      navigate("/admin");
    } else if (role === "security") {
      navigate("/security");
    } else {
      setError("Role tidak dikenali");
    }
  } catch (err) {
    setError(
      err.response?.data?.message || "Login gagal, cek email / password"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Visitor Management Login
        </h2>
        <p className="text-sm text-gray-500 text-center mt-2">
          Login sebagai Admin atau Security
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="admin@mail.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="********"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-600 font-medium">{error}</div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-indigo-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
