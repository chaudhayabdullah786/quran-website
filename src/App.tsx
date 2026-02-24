/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Menu, 
  X, 
  ChevronRight, 
  Play, 
  Mail, 
  Info, 
  Home,
  Book,
  ArrowRight,
  Music,
  Video,
  Lock,
  User,
  UserPlus,
  CheckCircle,
  LayoutDashboard,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  ClipboardList,
  UserCheck,
  Calendar
} from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import AiAssistant from './components/AiAssistant';

// Types
interface User {
  username: string;
  role: 'admin' | 'teacher' | 'student';
}
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
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
  category_name: string;
  category_slug: string;
  created_at: string;
}

interface SpecializedCourse {
  id: number;
  title: string;
  description: string;
  features: string;
  icon_name: string;
  color_class: string;
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
  features: string;
  icon_name: string;
  color_class: string;
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

// --- Sub-Components (Defined OUTSIDE to prevent focus loss) ---

const LoginPage = ({ loginForm, setLoginForm, handleLogin, authError, setCurrentPage, isSubmitting }: any) => (
  <div className="min-h-[80vh] flex items-center justify-center px-4">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-12 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-700 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-700/20">
          <Lock size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 font-serif">Welcome Back</h2>
        <p className="text-slate-500 text-sm font-sans">Access your academy account</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-widest font-sans">Username</label>
          <input 
            required
            type="text" 
            value={loginForm.username}
            onChange={e => setLoginForm({...loginForm, username: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all font-sans"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-widest font-sans">Password</label>
          <input 
            required
            type="password" 
            value={loginForm.password}
            onChange={e => setLoginForm({...loginForm, password: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all font-sans"
          />
        </div>
        {authError && <p className={`text-sm text-center font-medium font-sans ${authError.includes('successful') ? 'text-emerald-700' : 'text-red-500'}`}>{authError}</p>}
        <button 
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg font-sans uppercase tracking-widest text-xs ${
            isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20'
          }`}
        >
          {isSubmitting ? 'Processing...' : 'Sign In'}
        </button>
        <p className="text-center text-sm text-slate-500 font-sans">
          Don't have an account? <button type="button" onClick={() => setCurrentPage('register')} className="text-emerald-700 font-bold hover:underline">Register as Student</button>
        </p>
      </form>
    </motion.div>
  </div>
);

const RegisterPage = ({ registerForm, setRegisterForm, handleRegister, authError, isSubmitting, setCurrentPage }: any) => (
  <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl relative overflow-hidden"
    >
      {/* Urdu Calligraphy Accents */}
      <div className="absolute top-4 left-4 text-emerald-700/10 text-4xl font-serif select-none pointer-events-none">
        بسم اللہ
      </div>
      <div className="absolute top-4 right-4 text-emerald-700/10 text-4xl font-serif select-none pointer-events-none">
        الرحیم
      </div>

      <div className="text-center mb-10">
        <div className="text-emerald-700 text-3xl mb-4 font-serif" dir="rtl">
          بسم اللہ الرحمن الرحیم
        </div>
        <div className="w-16 h-16 bg-emerald-700 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-700/20">
          <UserPlus size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 font-serif">Join Our Academy</h2>
        <p className="text-slate-500 text-sm font-sans">Start your Quranic journey today</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest font-sans">Student Name*</label>
            <input 
              required
              type="text" 
              placeholder="First Name"
              value={registerForm.firstName}
              onChange={e => setRegisterForm({...registerForm, firstName: e.target.value, username: e.target.value + Math.floor(Math.random() * 1000)})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all font-sans text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest font-sans">Email Address*</label>
            <input 
              required
              type="email" 
              placeholder="Email Address"
              value={registerForm.email}
              onChange={e => setRegisterForm({...registerForm, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all font-sans text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest font-sans">Phone #*</label>
            <input 
              required
              type="tel" 
              placeholder="201-232-0025"
              value={registerForm.phone}
              onChange={e => setRegisterForm({...registerForm, phone: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all font-sans text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest font-sans">MS Teams ID</label>
            <input 
              type="text" 
              placeholder="MS Teams ID"
              value={registerForm.teamsId}
              onChange={e => setRegisterForm({...registerForm, teamsId: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all font-sans text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest font-sans">Country*</label>
            <input 
              required
              type="text" 
              placeholder="Country"
              value={registerForm.country}
              onChange={e => setRegisterForm({...registerForm, country: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all font-sans text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest font-sans">City</label>
            <input 
              type="text" 
              placeholder="City"
              value={registerForm.city}
              onChange={e => setRegisterForm({...registerForm, city: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all font-sans text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest font-sans">Program</label>
            <select 
              value={registerForm.program}
              onChange={e => setRegisterForm({...registerForm, program: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all font-sans text-sm bg-white"
            >
              <option value="">Select a Program</option>
              <option value="quran-reading">Quran Reading</option>
              <option value="tajweed">Tajweed & Recitation</option>
              <option value="hifz">Hifz (Memorization)</option>
              <option value="arabic">Arabic Language</option>
              <option value="islamic-studies">Islamic Studies</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest font-sans">Preferred Days</label>
            <select 
              value={registerForm.preferredDays}
              onChange={e => setRegisterForm({...registerForm, preferredDays: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all font-sans text-sm bg-white"
            >
              <option value="">Select Preferred Days</option>
              <option value="weekdays">Weekdays (Mon-Fri)</option>
              <option value="weekends">Weekends (Sat-Sun)</option>
              <option value="custom">Custom Schedule</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-widest font-sans">Password*</label>
          <input 
            required
            type="password" 
            placeholder="Create a password"
            value={registerForm.password}
            onChange={e => setRegisterForm({...registerForm, password: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all font-sans text-sm"
          />
        </div>

        {authError && <p className="text-red-500 text-sm text-center font-medium font-sans">{authError}</p>}
        
        <button 
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg font-sans uppercase tracking-widest text-xs ${
            isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20'
          }`}
        >
          {isSubmitting ? 'Processing...' : 'Register Now'}
        </button>

        <div className="text-center mt-6">
          <div className="text-emerald-800/60 text-sm font-serif mb-4" dir="rtl">
            لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَسُولُ اللهِ
          </div>
          <p className="text-sm text-slate-500 font-sans">
            Already have an account? <button type="button" onClick={() => setCurrentPage('login')} className="text-emerald-700 font-bold hover:underline">Login</button>
          </p>
        </div>
      </form>
    </motion.div>
  </div>
);

const Nav = ({ currentPage, setCurrentPage, user, isMenuOpen, setIsMenuOpen }: any) => (
  <header className="w-full">
    {/* Top Bar */}
    <div className="bg-slate-900 text-white py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4 text-xs font-medium">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
              <Mail size={12} />
            </div>
            <span>myquranguides@gmail.com</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
              <Play size={12} fill="currentColor" />
            </div>
            <span>Call US Office: 201-232-0025</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <a href="https://www.instagram.com/myquranguides?igsh=MXU2a3d0enM3bXNsZA==" target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
              <Instagram size={12} />
            </a>
            <button className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
              <Facebook size={12} />
            </button>
            <button className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
              <Youtube size={12} />
            </button>
          </div>
          <button 
            onClick={() => setCurrentPage('register')}
            className="bg-emerald-700 px-4 py-1.5 rounded-lg font-bold hover:bg-emerald-800 transition-all uppercase tracking-wider font-sans text-xs text-white"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>

    {/* Main Nav */}
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-12 h-12 bg-emerald-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-700/20">
              <BookOpen size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 leading-none tracking-tighter font-serif">MY QURAN</span>
              <span className="text-[10px] font-bold text-emerald-700 tracking-[0.2em] uppercase font-sans">Guide</span>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { id: 'home', label: 'Home' },
              { id: 'lessons', label: 'Courses' },
              { id: 'blogs', label: 'Blog' },
              { id: 'about', label: 'About Us' },
              { id: 'contact', label: 'Contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'blogs' && currentPage === 'home') {
                    document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (item.id === 'lessons' && currentPage === 'home') {
                    document.getElementById('specialized-courses')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setCurrentPage(item.id as any);
                  }
                }}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                  currentPage === item.id ? 'text-emerald-700' : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                {item.label}
              </button>
            ))}
            {user ? (
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all uppercase tracking-widest"
              >
                <LayoutDashboard size={14} /> Dashboard
              </button>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-emerald-700 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all uppercase tracking-widest"
              >
                <User size={14} /> Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {['home', 'lessons', 'blogs', 'about', 'contact'].map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    setCurrentPage(id as any);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-slate-900 font-bold uppercase tracking-widest hover:text-emerald-600"
                >
                  {id === 'blogs' ? 'Blog' : id === 'lessons' ? 'Courses' : id}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  </header>
);

const Footer = ({ setCurrentPage }: any) => (
  <footer className="bg-slate-900 text-slate-400 py-16 border-t-4 border-emerald-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center text-white">
              <BookOpen size={24} />
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase">MY QURAN GUIDE</span>
          </div>
          <p className="text-sm leading-relaxed">
            Learn Quran with experienced tutors. Join us to deepen your understanding of the Holy Quran from anywhere in the world.
          </p>
          <div className="flex gap-3">
            <a href="https://www.instagram.com/myquranguides?igsh=MXU2a3d0enM3bXNsZA==" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all">
              <Instagram size={16} />
            </a>
            <button className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all">
              <Facebook size={16} />
            </button>
            <button className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all">
              <Youtube size={16} />
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-8 border-b border-emerald-700 pb-2 inline-block">Our Courses</h3>
          <ul className="space-y-3 text-sm font-medium">
            <li><button onClick={() => setCurrentPage('lessons')} className="hover:text-emerald-400 transition-colors">Online Quran Classes</button></li>
            <li><button onClick={() => setCurrentPage('lessons')} className="hover:text-emerald-400 transition-colors">Learn Quran Reading</button></li>
            <li><button onClick={() => setCurrentPage('lessons')} className="hover:text-emerald-400 transition-colors">Tajweed for Kids</button></li>
            <li><button onClick={() => setCurrentPage('lessons')} className="hover:text-emerald-400 transition-colors">Hifz Program</button></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-8 border-b border-emerald-700 pb-2 inline-block">Quick Links</h3>
          <ul className="space-y-3 text-sm font-medium">
            <li><button onClick={() => setCurrentPage('home')} className="hover:text-emerald-400 transition-colors">Home</button></li>
            <li><button onClick={() => setCurrentPage('about')} className="hover:text-emerald-400 transition-colors">About Us</button></li>
            <li><button onClick={() => setCurrentPage('contact')} className="hover:text-emerald-400 transition-colors">Contact</button></li>
            <li><button onClick={() => setCurrentPage('register')} className="hover:text-emerald-400 transition-colors">Register</button></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-8 border-b border-emerald-700 pb-2 inline-block">Contact Us</h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-emerald-700 shrink-0" />
              <span>myquranguides@gmail.com</span>
            </div>
            <div className="flex items-start gap-3">
              <Play size={18} className="text-emerald-700 shrink-0" />
              <span>+1 (201) 232-0025</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-slate-800 text-center text-xs font-bold uppercase tracking-widest">
        © {new Date().getFullYear()} MY Quran Guide. Empowering Islamic Education Worldwide.
      </div>
    </div>
  </footer>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'lessons' | 'lesson-detail' | 'about' | 'contact' | 'login' | 'register' | 'dashboard' | 'blogs' | 'blog-detail'>('home');
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    username: '', 
    password: '', 
    email: '', 
    firstName: '', 
    phone: '', 
    teamsId: '', 
    country: '', 
    city: '', 
    program: '', 
    preferredDays: '' 
  });
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [specializedCourses, setSpecializedCourses] = useState<SpecializedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLessonSlug, setSelectedLessonSlug] = useState<string | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, lessonsRes, blogsRes, coursesRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/lessons'),
          fetch('/api/blogs'),
          fetch('/api/specialized-courses')
        ]);
        setCategories(await catsRes.json());
        setLessons(await lessonsRes.json());
        setBlogs(await blogsRes.json());
        setSpecializedCourses(await coursesRes.json());
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (data.token) {
        const userData = { username: data.username, role: data.role };
        setUser(userData);
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setAuthError('Login successful!');
        setTimeout(() => {
          setCurrentPage('dashboard');
          setAuthError('');
        }, 1000);
      } else {
        setAuthError(data.error || 'Login failed');
      }
    } catch (err) {
      setAuthError('Server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await res.json();
      if (data.success) {
        setAuthError('Registration successful! Please login.');
        setTimeout(() => {
          setCurrentPage('login');
          setAuthError('');
        }, 2000);
      } else {
        setAuthError(data.error || 'Registration failed');
      }
    } catch (err) {
      setAuthError('Server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user');
    setCurrentPage('home');
  };

  const navigateToLesson = (slug: string) => {
    setSelectedLessonSlug(slug);
    setCurrentPage('lesson-detail');
    window.scrollTo(0, 0);
  };

  const navigateToBlog = (slug: string) => {
    setSelectedBlogSlug(slug);
    setCurrentPage('blog-detail');
    window.scrollTo(0, 0);
  };

  if (currentPage === 'dashboard') {
    if (!user) return <LoginPage />;
    if (user.role === 'admin') return <AdminPanel onLogout={handleLogout} />;
    if (user.role === 'teacher') return <TeacherDashboard onLogout={handleLogout} />;
    if (user.role === 'student') return <StudentDashboard onLogout={handleLogout} onNavigate={(p, s) => { setCurrentPage(p as any); if (s) setSelectedLessonSlug(s); }} />;
  }



  const HomePage = () => (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block"
          >
            <div className="relative p-12 md:p-20 border-8 border-white/30 rounded-full backdrop-blur-md bg-white/10 max-w-3xl mx-auto shadow-2xl">
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 drop-shadow-lg">
                Learn Quran Online With <span className="text-emerald-400 underline decoration-4 underline-offset-8">Tajweed</span> For Kids & Beginners
              </h1>
              <p className="text-lg md:text-xl text-emerald-50 font-bold mb-10 max-w-2xl mx-auto drop-shadow-md">
                Personalized Online Quran Classes built for beginners, kids, adults, and advanced learners.
              </p>
              <button 
                onClick={() => setCurrentPage('register')}
                className="px-10 py-5 bg-white text-blue-900 rounded-full font-black text-lg uppercase tracking-widest hover:bg-emerald-400 hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95"
              >
                Start 2 Days Free Trial
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="bg-blue-600 p-10 rounded-3xl text-white shadow-2xl">
              <h2 className="text-3xl font-black mb-8 border-b-2 border-white/20 pb-4">Assalam-o-Alaikum!</h2>
              <div className="flex gap-6 items-start mb-8">
                <div className="space-y-4">
                  <p className="text-sm font-medium leading-relaxed">
                    Welcome you all at our online Islamic organization <span className="font-bold text-emerald-300">MY Quran Guide</span>. It is all about learning Quran online with excellence and dedication.
                  </p>
                  <p className="text-sm font-medium leading-relaxed">
                    It is also fundamental for our little ones to learn how to recite the Holy Quran. So this platform offers an opportunity for online Quran classes for kids.
                  </p>
                </div>
              </div>
              <button onClick={() => setCurrentPage('register')} className="w-full py-4 bg-white text-blue-600 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-400 hover:text-white transition-all shadow-lg">
                Sign Up Now
              </button>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                LEARN QURAN ACADEMY FOR KIDS & ADULTS
              </h2>
              <p className="text-xl text-slate-600 font-bold leading-relaxed">
                Online Quran Courses with Tajweed for Kids & Adults
              </p>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group bg-slate-100 flex items-center justify-center min-h-[300px]">
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                  <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold uppercase tracking-widest shadow-xl hover:bg-emerald-500 transition-all">
                    Best Quran Tajweed Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blue Banner */}
      <section className="bg-blue-700 py-10 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest flex flex-wrap items-center justify-center gap-4">
            FOR TWO DAYS FREE TRIAL CLASSES 
            <button onClick={() => setCurrentPage('register')} className="px-8 py-3 bg-white/20 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-700 transition-all font-black">
              CLICK HERE
            </button>
          </h3>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-[#f1f7f5]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-2 block">Simple Process</span>
            <h2 className="text-5xl font-bold text-slate-900 font-serif">How It Works</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Getting started is easy. Follow these simple steps to begin your journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            
            {[
              {
                num: '01',
                title: 'Register Online',
                desc: 'Fill out our simple registration form with your details and course preferences.',
                icon: ClipboardList
              },
              {
                num: '02',
                title: 'Get Free Trial',
                desc: 'Experience 2 free trial classes with our qualified teachers to find the perfect match.',
                icon: UserCheck
              },
              {
                num: '03',
                title: 'Choose Schedule',
                desc: 'Select convenient class timings that fit your lifestyle and time zone.',
                icon: Calendar
              },
              {
                num: '04',
                title: 'Start Learning',
                desc: 'Begin your Quranic journey with personalized one-on-one classes.',
                icon: BookOpen
              }
            ].map((step, i) => (
              <div key={i} className="relative z-10">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all text-center group border border-slate-100 h-full flex flex-col items-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {step.num}
                  </div>
                  <div className="w-16 h-16 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <step.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-sans">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Specialized Courses Section */}
      <section id="specialized-courses" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-bold text-slate-900 uppercase tracking-tight font-serif">Our Specialized Courses</h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto font-sans">Comprehensive Quranic and Arabic education tailored for all levels and ages.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(specializedCourses.length > 0 ? specializedCourses : [
              {
                title: 'Quran Reading',
                description: 'Master the fundamentals of reading the Holy Quran with proper pronunciation and fluency.',
                features: '["Tajweed Rules for correct pronunciation", "Fluent Recitation for effortless reading", "Personalized Feedback to track progress"]',
                icon_name: 'BookOpen',
                color_class: 'bg-blue-600',
                image: ''
              },
              {
                title: 'Norani Qaida',
                description: 'Learn the basics of Quranic Arabic with Noorani Qaida, ideal for beginners.',
                features: '["Basic Arabic Letters and sounds", "Word Formation and syllable recognition", "Building Reading Confidence for children and adults"]',
                icon_name: 'Book',
                color_class: 'bg-emerald-700',
                image: ''
              },
              {
                title: 'Arabic Language Basics',
                description: 'Strengthen your Quranic reading and understanding with a solid foundation in Arabic.',
                features: '["Arabic Alphabet and sounds", "Word Formation and structure", "Basic Sentence Construction for better comprehension"]',
                icon_name: 'Music',
                color_class: 'bg-blue-500',
                image: ''
              },
              {
                title: 'Tajweed & Recitation Perfecting',
                description: 'Learn proper pronunciation and articulation of Quranic verses, guided step-by-step.',
                features: '["Correct Articulation of Arabic letters", "Fluent Quranic Recitation with clear guidance", "Advanced Tajweed Techniques for perfect recitation"]',
                icon_name: 'Play',
                color_class: 'bg-emerald-700',
                image: ''
              },
              {
                title: 'Hifz (Quran Memorization)',
                description: 'Memorize the Quran with proven techniques and expert guidance.',
                features: '["Focused Memorization Sessions", "Daily Practice and review with your tutor", "Retention Techniques for lifelong memorization"]',
                icon_name: 'CheckCircle',
                color_class: 'bg-blue-700',
                image: ''
              },
              {
                title: 'Quran Translation & Tafseer',
                description: 'Understand the meaning and wisdom behind every verse of the Quran.',
                features: '["Translation of Quranic Verses", "Deep Analysis for better comprehension", "Contextual Tafseer to connect with the message"]',
                icon_name: 'Info',
                color_class: 'bg-slate-900',
                image: ''
              }
            ]).map((course: any, i) => {
              const Icon = { BookOpen, Book, Music, Play, CheckCircle, Info }[course.icon_name] || BookOpen;
              const features = JSON.parse(course.features);
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all group relative"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-100 flex items-center justify-center">
                    {course.image ? (
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    ) : (
                      <Icon size={48} className="text-slate-300" />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg">Course</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className={`w-12 h-12 ${course.color_class} text-white rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 font-serif">{course.title}</h3>
                    <p className="text-slate-600 font-medium mb-6 leading-relaxed font-sans text-sm">{course.description}</p>
                    <ul className="space-y-3 mb-8">
                      {features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-500 font-medium font-sans">
                          <CheckCircle size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => setCurrentPage('register')}
                      className="w-full py-3 bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-700/20 font-sans text-xs"
                    >
                      Enroll Now
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog-section" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-slate-900 text-center uppercase tracking-tight mb-16 font-serif">Our Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(blogs.length > 0 ? blogs : [
              { title: 'Quran Pronunciation – Importance and Guidelines', category: 'Tajweed', img: '' },
              { title: 'LEARN QURAN ACADEMY FOR KIDS', category: 'Kids Education', img: '' },
              { title: 'Learn Quran Word by Word Guide', category: 'Memorization', img: '' },
              { title: 'How to Read the Quran in Arabic Correctly?', category: 'Quran Reading', img: '' },
              { title: 'What Do We Learn from the Quran?', category: 'Islamic Studies', img: '' },
              { title: 'Best Way to Hifz Quran', category: 'Memorization', img: '' },
              { title: 'Online Quran Teachers Made Easy', category: 'Online Learning', img: '' },
              { title: 'Quran Classes for Kids', category: 'Kids Education', img: '' },
              { title: '6 Benefits of Online Quran Classes', category: 'Online Learning', img: '' },
            ])
.map((post: any, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 group cursor-pointer relative"
                onClick={() => post.slug ? navigateToBlog(post.slug) : setCurrentPage('blogs')}
              >
                <div className="relative h-56 overflow-hidden bg-slate-100 flex items-center justify-center">
                  {(post.image || post.img) ? (
                    <img src={post.image || post.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} referrerPolicy="no-referrer" />
                  ) : (
                    <BookOpen size={48} className="text-slate-300" />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-emerald-700 transition-colors font-serif">
                    {post.title}
                  </h3>
                  <button className="text-emerald-700 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all font-sans">
                    Read More <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-blue-600 uppercase tracking-widest mb-16">Benefits of Online Quran Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-10 bg-slate-50 rounded-3xl border-2 border-slate-100 hover:border-emerald-500 transition-all group"
            >
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform"><User size={32} /></div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-widest">Student-Centered Teaching</h3>
              <p className="text-slate-600 font-medium">Personalized lessons tailored to your learning pace and style.</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-10 bg-slate-50 rounded-3xl border-2 border-slate-100 hover:border-emerald-500 transition-all group"
            >
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform"><CheckCircle size={32} /></div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-widest">Accessible 24/7</h3>
              <p className="text-slate-600 font-medium">Classes available around the clock to suit your busy schedule.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Text Sections from Image */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="rounded-xl overflow-hidden shadow-lg border border-slate-100">
            <div className="bg-blue-600 p-4 text-white font-black italic uppercase tracking-widest text-sm">
              Guidance from the Quran and Sunnah
            </div>
            <div className="p-8 text-slate-600 text-sm leading-relaxed space-y-4">
              <p>
                The Holy Prophet Muhammad (peace be upon him) entrusted us with two invaluable sources: the Quran, Allah’s final revelation, and the Sunnah, his way of life. When followed sincerely, these guide us safely through life.
              </p>
              <p className="text-right font-bold text-xs">— MY Quran Guide</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg border border-slate-100">
            <div className="bg-blue-500 p-4 text-white font-black italic uppercase tracking-widest text-sm">
              The Quran: Allah’s Eternal Word
            </div>
            <div className="p-8 text-slate-600 text-sm leading-relaxed space-y-4">
              <p>
                Muslims believe that the Quran, revealed gradually over 22 years, remains perfectly preserved and unaltered. It is the foundation of faith and the ultimate source of happiness in this life and the hereafter.
              </p>
              <p className="text-right font-bold text-xs">— MY Quran Guide</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg border border-slate-100">
            <div className="bg-emerald-700 p-4 text-white font-black italic uppercase tracking-widest text-sm">
              Why Tajweed Matters
            </div>
            <div className="p-8 text-slate-600 text-sm leading-relaxed space-y-4">
              <p>
                Tajweed is the science of correctly pronouncing the Arabic letters of the Quran. It is vital to learn tajweed accurately to honor the sacred text. The best way to master tajweed is through instruction from a qualified teacher who understands its rules deeply.
              </p>
              <p className="text-right font-bold text-xs">— MY Quran Guide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-blue-900 py-24 text-center text-white relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4">
          <span className="text-6xl font-serif text-emerald-400 mb-8 block opacity-50">"</span>
          <h2 className="text-3xl md:text-5xl font-black italic leading-tight mb-8">
            Whoever follows a path in the pursuit of knowledge, ALLAH will make a path to Paradise easy for him.
          </h2>
          <p className="text-emerald-400 font-bold uppercase tracking-widest">— (Bukhari)</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-emerald-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Active Students', value: '900+' },
              { label: 'Expert Teachers', value: '25+' },
              { label: 'Countries', value: '4.9' },
              { label: 'Student Rating', value: '4.9 ⭐' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-emerald-100 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const LessonsPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 font-serif">Our Lessons</h1>
          <p className="text-slate-500 font-sans">Explore our comprehensive library of Quranic education.</p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all font-sans ${
              selectedCategory === null 
                ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-700'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all font-sans ${
                selectedCategory === cat.slug 
                  ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-slate-100 rounded-2xl h-96" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons
            .filter(lesson => selectedCategory === null || lesson.category_slug === selectedCategory)
            .map((lesson) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
              onClick={() => navigateToLesson(lesson.slug)}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={lesson.featured_image} 
                  alt={lesson.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg">
                    {lesson.category_name}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors font-serif">
                  {lesson.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-8 font-sans leading-relaxed">
                  {lesson.short_description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">{new Date(lesson.created_at).toLocaleDateString()}</span>
                  <div className="flex items-center gap-3">
                    {lesson.audio_file && <Music size={16} className="text-slate-400" />}
                    {lesson.video_link && <Video size={16} className="text-slate-400" />}
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const LessonDetail = () => {
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
      if (selectedLessonSlug) {
        fetch(`/api/lessons/${selectedLessonSlug}`)
          .then(res => res.json())
          .then(data => {
            setLesson(data);
            setLoading(false);
            if (user?.role === 'student') {
              fetch('/api/student/progress', { headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` } })
                .then(res => res.json())
                .then(progress => {
                  const p = progress.find((item: any) => item.lesson_id === data.id);
                  if (p) setIsCompleted(!!p.completed);
                });
            }
          });
      }
    }, [selectedLessonSlug]);

    const toggleCompletion = async () => {
      if (!lesson || user?.role !== 'student') return;
      const res = await fetch(`/api/student/progress/${lesson.id}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: !isCompleted })
      });
      if (res.ok) setIsCompleted(!isCompleted);
    };

    if (loading || !lesson) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => setCurrentPage('lessons')}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowRight size={18} className="rotate-180" /> Back to Lessons
          </button>
          {user?.role === 'student' && (
            <button 
              onClick={toggleCompletion}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'}`}
            >
              <CheckCircle size={20} className={isCompleted ? 'fill-emerald-700 text-white' : ''} />
              {isCompleted ? 'Completed' : 'Mark as Completed'}
            </button>
          )}
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest rounded-full">
              {lesson.category_name}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">{lesson.title}</h1>
            <p className="text-xl text-slate-500 italic">{lesson.short_description}</p>
          </div>

          <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={lesson.featured_image} 
              alt={lesson.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-emerald max-w-none text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: lesson.full_content }} />

          {/* Multimedia Section */}
          {(lesson.audio_file || lesson.video_link) && (
            <div className="bg-slate-50 rounded-3xl p-8 space-y-8 border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">Learning Resources</h3>
              
              {lesson.audio_file && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-emerald-600 font-semibold">
                    <Music size={20} /> Audio Lesson
                  </div>
                  <audio controls className="w-full">
                    <source src={lesson.audio_file} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {lesson.video_link && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-emerald-600 font-semibold">
                    <Video size={20} /> Video Tutorial
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                    {/* Simple YouTube Embed Logic */}
                    <iframe
                      width="100%"
                      height="100%"
                      src={lesson.video_link.includes('youtube.com') ? lesson.video_link.replace('watch?v=', 'embed/') : lesson.video_link}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const AboutPage = () => (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4 block">Our Story</span>
          <h1 className="text-5xl font-bold text-slate-900 mb-8 leading-tight">Preserving Tradition through <span className="text-emerald-700 font-serif">Innovation</span></h1>
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              MY Quran Guide was founded with a single mission: to make authentic Quranic education accessible to everyone, everywhere. We believe that the wisdom of the Quran should be shared using the best tools available today.
            </p>
            <p>
              Our team consists of certified scholars and technology experts working together to create an immersive learning experience. From Tajweed basics to advanced Tafsir, we provide a structured path for spiritual growth.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">100%</div>
              <div className="text-sm text-slate-500">Authentic Content</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
              <div className="text-sm text-slate-500">Global Access</div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-emerald-100 rounded-3xl rotate-3" />
          <div className="relative rounded-3xl shadow-2xl bg-slate-100 h-[600px] w-full flex items-center justify-center">
            <BookOpen size={120} className="text-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('loading');
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formState)
        });
        if (res.ok) {
          setStatus('success');
          setFormState({ name: '', email: '', message: '' });
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h1>
          <p className="text-slate-500">Have questions about our courses or need help getting started? We're here to help.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formState.name}
                    onChange={e => setFormState({...formState, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formState.email}
                    onChange={e => setFormState({...formState, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Message</label>
                <textarea 
                  required
                  rows={6}
                  value={formState.message}
                  onChange={e => setFormState({...formState, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button 
                disabled={status === 'loading'}
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-all disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
              {status === 'success' && <p className="text-emerald-600 text-center font-medium">Message sent successfully!</p>}
              {status === 'error' && <p className="text-red-600 text-center font-medium">Something went wrong. Please try again.</p>}
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
              <h3 className="text-xl font-bold text-emerald-900 mb-6">Contact Info</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-emerald-900">Email</div>
                    <div className="text-sm text-emerald-700">support@alquranacademy.com</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <Info size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-emerald-900">Support</div>
                    <div className="text-sm text-emerald-700">Available 24/7 for students</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Nav 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        user={user} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
      />
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (selectedLessonSlug || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentPage === 'home' && <HomePage />}
            {currentPage === 'lessons' && <LessonsPage />}
            {currentPage === 'lesson-detail' && <LessonDetail />}
            {currentPage === 'about' && <AboutPage />}
            {currentPage === 'contact' && <ContactPage />}
            {currentPage === 'login' && (
              <LoginPage 
                loginForm={loginForm} 
                setLoginForm={setLoginForm} 
                handleLogin={handleLogin} 
                authError={authError} 
                setCurrentPage={setCurrentPage} 
                isSubmitting={isSubmitting} 
              />
            )}
            {currentPage === 'register' && (
              <RegisterPage 
                registerForm={registerForm} 
                setRegisterForm={setRegisterForm} 
                handleRegister={handleRegister} 
                authError={authError} 
                isSubmitting={isSubmitting} 
                setCurrentPage={setCurrentPage} 
              />
            )}
            {currentPage === 'dashboard' && user?.role === 'admin' && <AdminPanel onLogout={handleLogout} />}
            {currentPage === 'dashboard' && user?.role === 'teacher' && <TeacherDashboard onLogout={handleLogout} />}
            {currentPage === 'dashboard' && user?.role === 'student' && <StudentDashboard onLogout={handleLogout} onNavigate={(page, slug) => {
              if (page === 'lesson-detail' && slug) navigateToLesson(slug);
              else setCurrentPage(page as any);
            }} />}

            {currentPage === 'blogs' && (
              <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                  <h1 className="text-5xl font-black text-slate-900 text-center uppercase tracking-tighter mb-16">Our Blog</h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                      <motion.div 
                        key={blog.id} 
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 group cursor-pointer"
                        onClick={() => navigateToBlog(blog.slug)}
                      >
                        <div className="relative h-48 overflow-hidden bg-slate-100 flex items-center justify-center">
                          {blog.image ? (
                            <img src={blog.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={blog.title} referrerPolicy="no-referrer" />
                          ) : (
                            <BookOpen size={48} className="text-slate-300" />
                          )}
                          <div className="absolute bottom-4 left-4">
                            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">{blog.category}</span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-black text-slate-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">{blog.title}</h3>
                          <button className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">Read More <ArrowRight size={14} /></button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'blog-detail' && selectedBlogSlug && (
              <div className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                  {blogs.find(b => b.slug === selectedBlogSlug) ? (
                    <>
                      <button onClick={() => setCurrentPage('blogs')} className="flex items-center gap-2 text-blue-600 font-bold mb-8 hover:gap-3 transition-all">
                        <ArrowRight className="rotate-180" size={20} /> Back to Blogs
                      </button>
                      {(() => {
                        const blog = blogs.find(b => b.slug === selectedBlogSlug)!;
                        return (
                          <div className="space-y-8">
                            {blog.image && (
                              <img src={blog.image} className="w-full h-[400px] object-cover rounded-3xl shadow-2xl" alt={blog.title} referrerPolicy="no-referrer" />
                            )}
                            <div className="flex items-center gap-4">
                              <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest">{blog.category}</span>
                              <span className="text-slate-400 text-sm">{new Date(blog.created_at).toLocaleDateString()}</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 leading-tight">{blog.title}</h1>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.content }} />
                          </div>
                        );
                      })()}
                    </>
                  ) : (
                    <div className="text-center py-24">
                      <h2 className="text-2xl font-bold text-slate-900">Blog post not found</h2>
                      <button onClick={() => setCurrentPage('blogs')} className="mt-4 text-blue-600 font-bold">Back to Blogs</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer setCurrentPage={setCurrentPage} />
      <AiAssistant userRole={user?.role} />
    </div>
  );
}
