import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  XCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface Lesson {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  full_content: string;
  featured_image: string;
  audio_file?: string;
  video_link?: string;
  category_id: number;
  category_name: string;
  status: 'draft' | 'published';
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

export default function TeacherDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lessons'>('dashboard');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    fetchLessons();
    fetchCategories();
  }, []);

  const fetchLessons = async () => {
    const res = await fetch('/api/lessons-management', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setLessons(await res.json());
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    if (res.ok) setCategories(await res.json());
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData();
    Object.entries(editingLesson!).forEach(([key, value]) => {
      if (value !== null && value !== undefined) formData.append(key, value as any);
    });

    const url = editingLesson?.id ? `/api/lessons-management/${editingLesson.id}` : '/api/lessons-management';
    const method = editingLesson?.id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      setEditingLesson(null);
      fetchLessons();
    } else {
      alert("Error saving lesson.");
    }
    setIsSaving(false);
  };

  const handleDeleteLesson = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/lessons-management/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchLessons();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-emerald-400">Teacher Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('lessons')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'lessons' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}>
            <BookOpen size={20} /> My Lessons
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
            <h1 className="text-3xl font-bold text-slate-900">Welcome, Teacher</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-slate-500 text-sm font-medium mb-2">My Lessons</div>
                <div className="text-4xl font-bold text-slate-900">{lessons.length}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-slate-900">My Lessons</h1>
              <button 
                onClick={() => setEditingLesson({ title: '', slug: '', short_description: '', full_content: '', category_id: categories[0]?.id, status: 'published' })}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all"
              >
                <Plus size={20} /> Add Lesson
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Title</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lessons.map((lesson) => (
                    <tr key={lesson.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{lesson.title}</td>
                      <td className="px-6 py-4 text-slate-600">{lesson.category_name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${lesson.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {lesson.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => setEditingLesson(lesson)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteLesson(lesson.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {editingLesson && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">{editingLesson.id ? 'Edit Lesson' : 'New Lesson'}</h2>
              <button onClick={() => setEditingLesson(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><XCircle size={24} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveLesson} className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Title</label>
                  <input required value={editingLesson.title} onChange={e => setEditingLesson({...editingLesson, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Slug (URL)</label>
                  <input required value={editingLesson.slug} onChange={e => setEditingLesson({...editingLesson, slug: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Short Description</label>
                <textarea required rows={2} value={editingLesson.short_description} onChange={e => setEditingLesson({...editingLesson, short_description: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Content (HTML)</label>
                <textarea required rows={6} value={editingLesson.full_content} onChange={e => setEditingLesson({...editingLesson, full_content: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-mono text-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <select value={editingLesson.category_id} onChange={e => setEditingLesson({...editingLesson, category_id: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Status</label>
                  <select value={editingLesson.status} onChange={e => setEditingLesson({...editingLesson, status: e.target.value as any})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Featured Image</label>
                  <input type="file" accept="image/*" onChange={e => setEditingLesson({...editingLesson, image: e.target.files?.[0]})} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Audio File (MP3)</label>
                  <input type="file" accept="audio/mpeg" onChange={e => setEditingLesson({...editingLesson, audio: e.target.files?.[0]})} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">YouTube Video Link</label>
                <input value={editingLesson.video_link || ''} onChange={e => setEditingLesson({...editingLesson, video_link: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div className="pt-4 flex gap-4">
                <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
                  <Save size={20} /> {isSaving ? 'Saving...' : 'Save Lesson'}
                </button>
                <button type="button" onClick={() => setEditingLesson(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
