import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  XCircle,
  Upload,
  Save,
  ChevronLeft,
  Users,
  GraduationCap
} from 'lucide-react';
import { motion } from 'motion/react';

interface Stats {
  totalLessons: number;
  totalCategories: number;
  unreadMessages: number;
  totalTeachers: number;
  totalStudents: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  created_at: string;
}

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

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
  teacher_id?: number;
  teacher_name?: string;
  status: 'draft' | 'published';
  created_at: string;
}

interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  image?: string;
  created_at: string;
}

interface SpecializedCourse {
  id: number;
  title: string;
  description: string;
  features: string; // JSON string
  icon_name: string;
  color_class: string;
  created_at: string;
}

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lessons' | 'teachers' | 'students' | 'messages' | 'blogs' | 'courses'>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [courses, setCourses] = useState<SpecializedCourse[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [editingCourse, setEditingCourse] = useState<Partial<SpecializedCourse> | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<User> & { password?: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    fetchStats();
    fetchLessons();
    fetchMessages();
    fetchCategories();
    fetchTeachers();
    fetchStudents();
    fetchBlogs();
    fetchCourses();
  }, []);

  const fetchStats = async () => {
    const res = await fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setStats(await res.json());
  };

  const fetchLessons = async () => {
    const res = await fetch('/api/lessons-management', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setLessons(await res.json());
  };

  const fetchBlogs = async () => {
    const res = await fetch('/api/blogs');
    if (res.ok) setBlogs(await res.json());
  };

  const fetchCourses = async () => {
    const res = await fetch('/api/specialized-courses');
    if (res.ok) setCourses(await res.json());
  };

  const fetchMessages = async () => {
    const res = await fetch('/api/admin/messages', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setMessages(await res.json());
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    if (res.ok) setCategories(await res.json());
  };

  const fetchTeachers = async () => {
    const res = await fetch('/api/admin/users?role=teacher', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setTeachers(await res.json());
  };

  const fetchStudents = async () => {
    const res = await fetch('/api/admin/users?role=student', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setStudents(await res.json());
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
      fetchStats();
    } else {
      alert("Error saving lesson. Check if slug is unique.");
    }
    setIsSaving(false);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editingUser)
    });

    if (res.ok) {
      setEditingUser(null);
      fetchTeachers();
      fetchStudents();
      fetchStats();
    } else {
      const data = await res.json();
      alert(data.error || "Error saving user.");
    }
    setIsSaving(false);
  };

  const handleDeleteLesson = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    const res = await fetch(`/api/lessons-management/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchLessons();
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      fetchTeachers();
      fetchStudents();
      fetchStats();
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData();
    Object.entries(editingBlog!).forEach(([key, value]) => {
      if (value !== null && value !== undefined) formData.append(key, value as any);
    });

    const url = editingBlog?.id ? `/api/admin/blogs/${editingBlog.id}` : '/api/admin/blogs';
    const method = editingBlog?.id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      setEditingBlog(null);
      fetchBlogs();
    } else {
      alert("Error saving blog.");
    }
    setIsSaving(false);
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/admin/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchBlogs();
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const url = editingCourse?.id ? `/api/admin/specialized-courses/${editingCourse.id}` : '/api/admin/specialized-courses';
    const method = editingCourse?.id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editingCourse)
    });

    if (res.ok) {
      setEditingCourse(null);
      fetchCourses();
    } else {
      alert("Error saving course.");
    }
    setIsSaving(false);
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/admin/specialized-courses/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchCourses();
  };

  const markAsRead = async (id: number) => {
    const res = await fetch(`/api/admin/messages/${id}/read`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchMessages();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-emerald-400">Admin Portal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('lessons')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'lessons' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}
          >
            <BookOpen size={20} /> Lessons
          </button>
          <button 
            onClick={() => setActiveTab('teachers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'teachers' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}
          >
            <Users size={20} /> Teachers
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'students' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}
          >
            <GraduationCap size={20} /> Students
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'messages' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}
          >
            <MessageSquare size={20} /> Messages
          </button>
          <button 
            onClick={() => setActiveTab('blogs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'blogs' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}
          >
            <Edit size={20} /> Blogs
          </button>
          <button 
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'courses' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}
          >
            <Plus size={20} /> Courses
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-slate-500 text-sm font-medium mb-2">Total Lessons</div>
                <div className="text-4xl font-bold text-slate-900">{stats?.totalLessons || 0}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-slate-500 text-sm font-medium mb-2">Total Teachers</div>
                <div className="text-4xl font-bold text-emerald-600">{stats?.totalTeachers || 0}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-slate-500 text-sm font-medium mb-2">Total Students</div>
                <div className="text-4xl font-bold text-emerald-600">{stats?.totalStudents || 0}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-slate-500 text-sm font-medium mb-2">Unread Messages</div>
                <div className="text-4xl font-bold text-red-500">{stats?.unreadMessages || 0}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-slate-900">Manage Lessons</h1>
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
                    <th className="px-6 py-4 font-semibold">Teacher</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lessons.map((lesson) => (
                    <tr key={lesson.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{lesson.title}</td>
                      <td className="px-6 py-4 text-slate-600">{lesson.category_name}</td>
                      <td className="px-6 py-4 text-slate-600">{lesson.teacher_name || 'Unassigned'}</td>
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

        {(activeTab === 'teachers' || activeTab === 'students') && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-slate-900">Manage {activeTab === 'teachers' ? 'Teachers' : 'Students'}</h1>
              <button 
                onClick={() => setEditingUser({ username: '', password: '', email: '', role: activeTab === 'teachers' ? 'teacher' : 'student' })}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all"
              >
                <Plus size={20} /> Add {activeTab === 'teachers' ? 'Teacher' : 'Student'}
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Username</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Joined</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(activeTab === 'teachers' ? teachers : students).map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{user.username}</td>
                      <td className="px-6 py-4 text-slate-600">{user.email || '-'}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">Contact Messages</h1>
            <div className="grid grid-cols-1 gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`p-6 rounded-2xl border transition-all ${msg.is_read ? 'bg-white border-slate-100 opacity-75' : 'bg-emerald-50 border-emerald-100 shadow-sm'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900">{msg.name}</h3>
                      <p className="text-sm text-slate-500">{msg.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-400">{new Date(msg.created_at).toLocaleString()}</span>
                      {!msg.is_read && (
                        <button onClick={() => markAsRead(msg.id)} className="text-emerald-600 hover:text-emerald-700 font-bold text-sm">Mark as Read</button>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-slate-900">Manage Blogs</h1>
              <button 
                onClick={() => setEditingBlog({ title: '', slug: '', content: '', category: '' })}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all"
              >
                <Plus size={20} /> Add Blog
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Title</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{blog.title}</td>
                      <td className="px-6 py-4 text-slate-600">{blog.category}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => setEditingBlog(blog)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-slate-900">Manage Courses</h1>
              <button 
                onClick={() => setEditingCourse({ title: '', description: '', features: '[]', icon_name: 'Book', color_class: 'bg-blue-600' })}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all"
              >
                <Plus size={20} /> Add Course
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Title</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{course.title}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => setEditingCourse(course)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Lesson Edit Modal */}
      {editingLesson && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <select value={editingLesson.category_id} onChange={e => setEditingLesson({...editingLesson, category_id: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Teacher</label>
                  <select value={editingLesson.teacher_id || ''} onChange={e => setEditingLesson({...editingLesson, teacher_id: e.target.value ? parseInt(e.target.value) : undefined})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none">
                    <option value="">Unassigned</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.username}</option>)}
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

      {/* Blog Edit Modal */}
      {editingBlog && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">{editingBlog.id ? 'Edit Blog' : 'New Blog'}</h2>
              <button onClick={() => setEditingBlog(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><XCircle size={24} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveBlog} className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Title</label>
                  <input required value={editingBlog.title} onChange={e => setEditingBlog({...editingBlog, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Slug</label>
                  <input required value={editingBlog.slug} onChange={e => setEditingBlog({...editingBlog, slug: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <input value={editingBlog.category} onChange={e => setEditingBlog({...editingBlog, category: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Content (HTML)</label>
                <textarea required rows={10} value={editingBlog.content} onChange={e => setEditingBlog({...editingBlog, content: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-mono text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Image</label>
                <input type="file" accept="image/*" onChange={e => setEditingBlog({...editingBlog, image: e.target.files?.[0] as any})} className="w-full text-sm text-slate-500" />
              </div>
              <div className="pt-4 flex gap-4">
                <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
                  <Save size={20} /> {isSaving ? 'Saving...' : 'Save Blog'}
                </button>
                <button type="button" onClick={() => setEditingBlog(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Course Edit Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">{editingCourse.id ? 'Edit Course' : 'New Course'}</h2>
              <button onClick={() => setEditingCourse(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><XCircle size={24} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveCourse} className="p-6 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Title</label>
                <input required value={editingCourse.title} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea required rows={3} value={editingCourse.description} onChange={e => setEditingCourse({...editingCourse, description: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Features (JSON Array of strings)</label>
                <textarea required rows={3} value={editingCourse.features} onChange={e => setEditingCourse({...editingCourse, features: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-mono text-sm" placeholder='["Feature 1", "Feature 2"]' />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Icon Name (Lucide)</label>
                  <input value={editingCourse.icon_name} onChange={e => setEditingCourse({...editingCourse, icon_name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" placeholder="BookOpen, Book, Music, etc." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Color Class (Tailwind)</label>
                  <input value={editingCourse.color_class} onChange={e => setEditingCourse({...editingCourse, color_class: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" placeholder="bg-blue-600" />
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
                  <Save size={20} /> {isSaving ? 'Saving...' : 'Save Course'}
                </button>
                <button type="button" onClick={() => setEditingCourse(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* User Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Add {editingUser.role === 'teacher' ? 'Teacher' : 'Student'}</h2>
              <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><XCircle size={24} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Username</label>
                <input required value={editingUser.username} onChange={e => setEditingUser({...editingUser, username: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input type="email" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <input required type="password" value={editingUser.password} onChange={e => setEditingUser({...editingUser, password: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none" />
              </div>
              <div className="pt-4 flex gap-4">
                <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
                  <Save size={20} /> {isSaving ? 'Saving...' : 'Save User'}
                </button>
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
