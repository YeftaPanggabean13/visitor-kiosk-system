
import React, { useState, useEffect } from 'react';

const Layout = ({ children }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden bg-slate-50">
      {/* Branding Sidebar */}
      <aside className="hidden lg:flex w-[400px] h-full bg-[#0f172a] relative overflow-hidden flex-col justify-between p-12 text-white shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover opacity-20"
            alt="Interior"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-transparent to-[#0f172a]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white text-2xl font-black">L</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">LuxeKiosk</h1>
              <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">Enterprise Concierge</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-7xl font-light tracking-tighter">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className="text-lg text-slate-400 font-medium">
              {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "Providing seamless entry experiences for the world's leading organizations."
            </p>
          </div>
          <div className="flex items-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <span>Security Verified</span>
            <span>•</span>
            <span>Global Concierge</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">L</span>
            </div>
            <span className="font-bold text-slate-900">LuxeKiosk</span>
          </div>
          <div className="text-slate-500 font-mono text-sm">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6 lg:p-12 relative">
          <div className="w-full max-w-2xl animate-slide-up">
            {children}
          </div>
        </div>

        <footer className="bg-white/80 backdrop-blur-md border-t border-slate-100 p-6 flex items-center justify-between">
          <div className="flex gap-2">
            <button className="px-5 py-2 rounded-full border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-all uppercase tracking-wider">
              English
            </button>
            <button className="px-5 py-2 rounded-full border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-all uppercase tracking-wider">
              Accessibility
            </button>
          </div>
          <div className="hidden sm:block text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Terminal ID: XK-904-B
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Layout;