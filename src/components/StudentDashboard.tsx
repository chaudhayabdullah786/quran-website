import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  LogOut, 
  CheckCircle,
  Clock,
  ChevronRight,
  User
} from 'lucide-react';
import { motion } from 'motion/react';

interface Progress {
  id: number;
  lesson_id: number;
  lesson_title: string;
  lesson_slug: string;
  completed: number;
  last_accessed: string;
}

export default function StudentDashboard({ onLogout, onNavigate }: { onLogout: () => void, onNavigate: (page: string, slug?: string) => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'progress' | 'profile'>('dashboard');
  const [progress, setProgress] = useState<Progress[]>([]);
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    const res = await fetch('/api/student/progress', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setProgress(await res.json());
  };

  const completedCount = progress.filter(p => p.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-emerald-400">Student Portal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('progress')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'progress' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}>
            <CheckCircle size={20} /> My Progress
          </button>
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}>
            <User size={20} /> My Profile
          </button>
          <button onClick={() => onNavigate('lessons')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all">
            <BookOpen size={20} /> Browse Lessons
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Assalamu Alaikum!</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-slate-500 text-sm font-medium mb-2">Lessons Completed</div>
                <div className="text-4xl font-bold text-emerald-600">{completedCount}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-slate-500 text-sm font-medium mb-2">Lessons in Progress</div>
                <div className="text-4xl font-bold text-slate-900">{progress.length - completedCount}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
                {progress.slice(0, 5).map(p => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onNavigate('lesson-detail', p.lesson_slug)}>
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${p.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {p.completed ? <CheckCircle size={20} /> : <Clock size={20} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{p.lesson_title}</h4>
                        <p className="text-xs text-slate-500">Last accessed: {new Date(p.last_accessed).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-300" />
                  </div>
                ))}
                {progress.length === 0 && <div className="p-8 text-center text-slate-500">No activity yet. Start a lesson!</div>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">My Progress</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Lesson</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Last Accessed</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {progress.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{p.lesson_title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {p.completed ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{new Date(p.last_accessed).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => onNavigate('lesson-detail', p.lesson_slug)} className="text-emerald-600 hover:text-emerald-700 font-bold text-sm">View Lesson</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <User size={48} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{user.username}</h2>
                  <p className="text-slate-500 capitalize">{user.role}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
                  <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-600">{user.username}</div>
                </div>
                <p className="text-sm text-slate-400 italic">Profile editing is currently managed by the administration.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
