import React, { useState, useEffect } from 'react';
import { LayoutGrid, Briefcase, Folder, CheckCircle, Sun, Moon, LogOut, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children, activeSection, setActiveSection }) {
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const menuItems = [
    { id: 'dash', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'work', icon: Briefcase, label: 'Workspaces' },
    { id: 'proj', icon: Folder, label: 'Projects' },
    { id: 'task', icon: CheckCircle, label: 'My Tasks' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100 flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-zinc-800 p-6 flex flex-col glass fixed inset-y-0 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <span className="text-lg font-bold">Mini Jeera</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
                activeSection === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 space-y-4">
          <button onClick={() => setIsDark(!isDark)} className="flex items-center gap-3 w-full p-3 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl transition-all">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-sm font-medium">Appearance</span>
          </button>
          <button className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all">
            <LogOut size={20} /> <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}