import { Plus } from "lucide-react";
export default function Overview() {
  const stats = [
    { label: 'TOTAL PROJECTS', value: '12', trend: '↑ 2 from last month' },
    { label: 'ACTIVE TASKS', value: '48', trend: '8 high priority' },
    { label: 'TEAM MEMBERS', value: '24', trend: 'Across 4 workspaces' },
  ];

  return (
    <section>
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black mb-2">Workspace Overview[cite: 1]</h2>
          <p className="text-slate-500">Welcome back, Senior Engineer.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform">
          <Plus size={18} /> New Project
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-sm">
            <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-4xl font-black">{stat.value}</h3>
            <div className={`mt-4 text-xs font-bold ${i === 0 ? 'text-green-500' : 'text-indigo-500'}`}>{stat.trend}</div>
          </div>
        ))}
      </div>
      
      {/* Activity Table Placeholder[cite: 1] */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
            <h4 className="font-bold">Recent Activity</h4>
            <button className="text-indigo-600 text-sm font-bold">View All</button>
        </div>
        <div className="p-12 text-center text-slate-400 italic">No recent activity found.</div>
      </div>
    </section>
  );
}