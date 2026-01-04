import React, { useState } from 'react';

export default function Login() {
  const [role, setRole] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    // Mock login flow
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Mock redirect by role
      if (role === 'Admin') {
        window.location.href = '/admin';
      } else if (role === 'Security') {
        window.location.href = '/security';
      } else {
        window.location.href = '/host';
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Branding / Illustration */}
        <div className="hidden lg:flex flex-col justify-center items-start p-12 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="mb-6">
            <div className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold">V</span>
            </div>
          </div>
          <h3 className="text-3xl font-extrabold">Visitor Management</h3>
          <p className="mt-4 text-slate-200 max-w-xs">
            Secure, simple and auditable visitor check-in management for your organization.
          </p>
        </div>

        {/* Login form */}
        <div className="p-8 lg:p-12">
          <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-slate-500">Choose your role and sign in.</p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="rounded-md shadow-sm -space-y-px">
              {/* Role selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <div className="flex gap-2">
                  {['Admin', 'Security', 'Host'].map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors focus:outline-none ${
                        role === r
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                  placeholder="you@company.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Error placeholder */}
            {error && (
              <div className="text-sm text-red-600 font-medium">{error}</div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 rounded-lg text-white font-semibold shadow-sm transition-colors ${
                  loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? 'Signing in...' : `Sign in as ${role}`}
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm text-slate-500">
            <p>
              This is a demo login screen — no real authentication is performed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
