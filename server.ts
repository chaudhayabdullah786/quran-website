import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GoogleGenAI } from "@google/genai";

const db = new Database("quran_academy.db");
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-quran-academy-key";

let aiInstance: GoogleGenAI | null = null;
function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required for AI features");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password TEXT NOT NULL,
    first_name TEXT,
    phone TEXT,
    teams_id TEXT,
    country TEXT,
    city TEXT,
    program TEXT,
    preferred_days TEXT,
    role TEXT CHECK(role IN ('admin', 'teacher', 'student')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration for existing users table
try { db.exec("ALTER TABLE users ADD COLUMN first_name TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE users ADD COLUMN phone TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE users ADD COLUMN teams_id TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE users ADD COLUMN country TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE users ADD COLUMN city TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE users ADD COLUMN program TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE users ADD COLUMN preferred_days TEXT;"); } catch(e) {}

db.exec(`
  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_content TEXT,
    featured_image TEXT,
    audio_file TEXT,
    video_link TEXT,
    category_id INTEGER,
    teacher_id INTEGER,
    status TEXT DEFAULT 'published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS student_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    completed INTEGER DEFAULT 0,
    last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id),
    UNIQUE(student_id, lesson_id)
  );

  CREATE TABLE IF NOT EXISTS ai_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    response TEXT NOT NULL,
    user_role TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS specialized_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    features TEXT NOT NULL, -- JSON string of features
    icon_name TEXT,
    color_class TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data
const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (categoryCount.count === 0) {
  const insertCat = db.prepare("INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)");
  insertCat.run("Tajweed", "tajweed", "Rules for the correct pronunciation of the Quran.");
  insertCat.run("Tafsir", "tafsir", "Exegesis or interpretation of the Quran.");
  insertCat.run("Hifz", "hifz", "Memorization of the Holy Quran.");
}

// Seed default admin
const adminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get() as { count: number };
if (adminCount.count === 0) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run("admin", hashedPassword, "admin");
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "audio/mpeg") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  }
});

// Auth Middleware
const authenticate = (roles: string[] = []) => (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(uploadsDir));

  // --- Public API Routes ---
  app.get("/api/categories", (req, res) => {
    res.json(db.prepare("SELECT * FROM categories").all());
  });

  app.get("/api/lessons", (req, res) => {
    const { category } = req.query;
    let query = `
      SELECT l.*, c.name as category_name, u.username as teacher_name 
      FROM lessons l 
      JOIN categories c ON l.category_id = c.id 
      LEFT JOIN users u ON l.teacher_id = u.id
      WHERE l.status = 'published'
    `;
    const params: any[] = [];
    if (category) {
      query += " AND c.slug = ?";
      params.push(category);
    }
    query += " ORDER BY l.created_at DESC";
    res.json(db.prepare(query).all(...params));
  });

  app.get("/api/lessons/:slug", (req, res) => {
    const lesson = db.prepare(`
      SELECT l.*, c.name as category_name, u.username as teacher_name 
      FROM lessons l 
      JOIN categories c ON l.category_id = c.id 
      LEFT JOIN users u ON l.teacher_id = u.id
      WHERE l.slug = ?
    `).get(req.params.slug);
    lesson ? res.json(lesson) : res.status(404).json({ error: "Lesson not found" });
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: "Required fields missing" });
    db.prepare("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)").run(name, email, message);
    res.json({ success: true });
  });

  // --- AI Assistant Route ---
  app.post("/api/ai-assistant", async (req: any, res) => {
    const { question, role } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    // Check cache
    const cached = db.prepare("SELECT response FROM ai_cache WHERE question = ? AND user_role = ?").get(question, role || 'visitor') as any;
    if (cached) return res.json({ response: cached.response });

    try {
      // Get context from DB for better answers
      const lessons = db.prepare("SELECT title, slug, short_description FROM lessons WHERE status = 'published' LIMIT 10").all() as any[];
      const categories = db.prepare("SELECT name, description FROM categories").all() as any[];
      const blogs = db.prepare("SELECT title FROM blogs LIMIT 5").all() as any[];
      const courses = db.prepare("SELECT title FROM specialized_courses").all() as any[];
      
      const context = `
        You are an AI Assistant for MY Quran Guide. 
        The academy offers various courses including Tajweed, Tafsir, and Hifz.
        Current categories: ${categories.map(c => c.name).join(", ")}.
        Specialized Courses: ${courses.map(c => c.title).join(", ")}.
        Some available lessons: ${lessons.map(l => l.title).join(", ")}.
        Recent Blog Posts: ${blogs.map(b => b.title).join(", ")}.
        User Role: ${role || 'visitor'}.
        
        Instructions:
        - Provide helpful, respectful, and accurate information about Quran learning.
        - If the user asks about lessons or courses, mention relevant ones from the list above.
        - Keep answers concise but informative.
        - Use a warm, encouraging tone.
        - Refer to the academy as "MY Quran Guide".
      `;

      const result = await getAI().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: question,
        config: {
          systemInstruction: context
        }
      });

      const responseText = result.text || "I'm sorry, I couldn't process that request.";
      
      // Store in cache
      db.prepare("INSERT INTO ai_cache (question, response, user_role) VALUES (?, ?, ?)").run(question, responseText, role || 'visitor');

      res.json({ response: responseText });
    } catch (err) {
      console.error("AI Error:", err);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // --- Auth Routes ---
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as any;
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
      res.json({ token, username: user.username, role: user.role });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { username, password, email, firstName, phone, teamsId, country, city, program, preferredDays } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      db.prepare(`
        INSERT INTO users (username, password, email, first_name, phone, teams_id, country, city, program, preferred_days, role) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(username, hashedPassword, email, firstName, phone, teamsId, country, city, program, preferredDays, "student");
      res.json({ success: true });
    } catch (err) {
      console.error("Registration Error:", err);
      res.status(400).json({ error: "Username already exists or invalid data" });
    }
  });

  // --- Admin Protected Routes ---
  app.get("/api/admin/stats", authenticate(["admin"]), (req, res) => {
    const lessons = db.prepare("SELECT COUNT(*) as count FROM lessons").get() as any;
    const categories = db.prepare("SELECT COUNT(*) as count FROM categories").get() as any;
    const messages = db.prepare("SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0").get() as any;
    const teachers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'teacher'").get() as any;
    const students = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get() as any;
    res.json({ totalLessons: lessons.count, totalCategories: categories.count, unreadMessages: messages.count, totalTeachers: teachers.count, totalStudents: students.count });
  });

  app.get("/api/admin/users", authenticate(["admin"]), (req, res) => {
    const { role } = req.query;
    let query = "SELECT id, username, email, role, created_at FROM users";
    const params: any[] = [];
    if (role) {
      query += " WHERE role = ?";
      params.push(role);
    }
    res.json(db.prepare(query).all(...params));
  });

  app.post("/api/admin/users", authenticate(["admin"]), (req, res) => {
    const { username, password, email, role } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      db.prepare("INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)").run(username, hashedPassword, email, role);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: "User already exists" });
    }
  });

  app.delete("/api/admin/users/:id", authenticate(["admin"]), (req, res) => {
    db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Lesson Management (Admin & Teacher) ---
  app.get("/api/lessons-management", authenticate(["admin", "teacher"]), (req: any, res) => {
    let query = "SELECT l.*, c.name as category_name, u.username as teacher_name FROM lessons l JOIN categories c ON l.category_id = c.id LEFT JOIN users u ON l.teacher_id = u.id";
    const params: any[] = [];
    if (req.user.role === "teacher") {
      query += " WHERE l.teacher_id = ?";
      params.push(req.user.id);
    }
    query += " ORDER BY l.created_at DESC";
    res.json(db.prepare(query).all(...params));
  });

  app.post("/api/lessons-management", authenticate(["admin", "teacher"]), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), (req: any, res) => {
    const { title, slug, short_description, full_content, category_id, video_link, status, teacher_id } = req.body;
    const image = req.files['image']?.[0]?.filename ? `/uploads/${req.files['image'][0].filename}` : req.body.featured_image;
    const audio = req.files['audio']?.[0]?.filename ? `/uploads/${req.files['audio'][0].filename}` : null;
    
    const finalTeacherId = req.user.role === "admin" ? teacher_id : req.user.id;

    try {
      db.prepare(`
        INSERT INTO lessons (title, slug, short_description, full_content, category_id, featured_image, audio_file, video_link, status, teacher_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(title, slug, short_description, full_content, category_id, image, audio, video_link, status || 'published', finalTeacherId);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: "Slug must be unique" });
    }
  });

  app.put("/api/lessons-management/:id", authenticate(["admin", "teacher"]), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), (req: any, res) => {
    const { title, slug, short_description, full_content, category_id, video_link, status, teacher_id } = req.body;
    const image = req.files['image']?.[0]?.filename ? `/uploads/${req.files['image'][0].filename}` : req.body.featured_image;
    const audio = req.files['audio']?.[0]?.filename ? `/uploads/${req.files['audio'][0].filename}` : req.body.audio_file;

    // Check ownership if teacher
    if (req.user.role === "teacher") {
      const lesson = db.prepare("SELECT teacher_id FROM lessons WHERE id = ?").get(req.params.id) as any;
      if (lesson.teacher_id !== req.user.id) return res.status(403).json({ error: "Forbidden" });
    }

    const finalTeacherId = req.user.role === "admin" ? teacher_id : req.user.id;

    db.prepare(`
      UPDATE lessons SET title=?, slug=?, short_description=?, full_content=?, category_id=?, featured_image=?, audio_file=?, video_link=?, status=?, teacher_id=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).run(title, slug, short_description, full_content, category_id, image, audio, video_link, status, finalTeacherId, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/lessons-management/:id", authenticate(["admin", "teacher"]), (req: any, res) => {
    if (req.user.role === "teacher") {
      const lesson = db.prepare("SELECT teacher_id FROM lessons WHERE id = ?").get(req.params.id) as any;
      if (lesson.teacher_id !== req.user.id) return res.status(403).json({ error: "Forbidden" });
    }
    db.prepare("DELETE FROM lessons WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Student Progress ---
  app.get("/api/student/progress", authenticate(["student"]), (req: any, res) => {
    const progress = db.prepare(`
      SELECT sp.*, l.title as lesson_title, l.slug as lesson_slug 
      FROM student_progress sp 
      JOIN lessons l ON sp.lesson_id = l.id 
      WHERE sp.student_id = ?
    `).all(req.user.id);
    res.json(progress);
  });

  app.post("/api/student/progress/:lessonId", authenticate(["student"]), (req: any, res) => {
    const { completed } = req.body;
    db.prepare(`
      INSERT INTO student_progress (student_id, lesson_id, completed) 
      VALUES (?, ?, ?) 
      ON CONFLICT(student_id, lesson_id) DO UPDATE SET completed = excluded.completed, last_accessed = CURRENT_TIMESTAMP
    `).run(req.user.id, req.params.lessonId, completed ? 1 : 0);
    res.json({ success: true });
  });

  // --- Messages Management ---
  app.get("/api/admin/messages", authenticate(["admin"]), (req, res) => {
    res.json(db.prepare("SELECT * FROM contact_messages ORDER BY created_at DESC").all());
  });

  app.patch("/api/admin/messages/:id/read", authenticate(["admin"]), (req, res) => {
    db.prepare("UPDATE contact_messages SET is_read = 1 WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Blog Management ---
  app.get("/api/blogs", (req, res) => {
    res.json(db.prepare("SELECT * FROM blogs ORDER BY created_at DESC").all());
  });

  app.post("/api/admin/blogs", authenticate(["admin"]), upload.single('image'), (req: any, res) => {
    const { title, slug, content, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    try {
      db.prepare("INSERT INTO blogs (title, slug, content, category, image) VALUES (?, ?, ?, ?, ?)").run(title, slug, content, category, image);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: "Slug must be unique" });
    }
  });

  app.put("/api/admin/blogs/:id", authenticate(["admin"]), upload.single('image'), (req: any, res) => {
    const { title, slug, content, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    db.prepare("UPDATE blogs SET title=?, slug=?, content=?, category=?, image=? WHERE id=?").run(title, slug, content, category, image, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/blogs/:id", authenticate(["admin"]), (req, res) => {
    db.prepare("DELETE FROM blogs WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Specialized Courses Management ---
  app.get("/api/specialized-courses", (req, res) => {
    res.json(db.prepare("SELECT * FROM specialized_courses ORDER BY created_at ASC").all());
  });

  app.post("/api/admin/specialized-courses", authenticate(["admin"]), (req, res) => {
    const { title, description, features, icon_name, color_class } = req.body;
    db.prepare("INSERT INTO specialized_courses (title, description, features, icon_name, color_class) VALUES (?, ?, ?, ?, ?)").run(title, description, features, icon_name, color_class);
    res.json({ success: true });
  });

  app.put("/api/admin/specialized-courses/:id", authenticate(["admin"]), (req, res) => {
    const { title, description, features, icon_name, color_class } = req.body;
    db.prepare("UPDATE specialized_courses SET title=?, description=?, features=?, icon_name=?, color_class=? WHERE id=?").run(title, description, features, icon_name, color_class, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/specialized-courses/:id", authenticate(["admin"]), (req, res) => {
    db.prepare("DELETE FROM specialized_courses WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => res.sendFile(path.join(process.cwd(), "dist", "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer();
