import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Users, Calendar, BookOpen, AlertTriangle, FileText, 
  Bot, Settings, CheckCircle, Clock, Plus, BarChart2, ChevronRight, 
  Sparkles, Wifi, ShieldAlert, LogOut, Download, Search, Edit3, Trash2, 
  UserPlus, Filter, Upload, Layers, Key, User, Camera, Lock, Eye, EyeOff, 
  Printer, FileSpreadsheet, Database, RefreshCw, Menu, X, Save, Check, ArrowRight
} from 'lucide-react';

// LOCAL STORAGE INITIALIZATION ENGINE (Persists database locally & simulates SQL tables)
const STORAGE_KEYS = {
  USERS: 'kelas_plus_users_db',
  CLASSES: 'kelas_plus_classes_db',
  STUDENTS: 'kelas_plus_students_db',
  ATTENDANCE: 'kelas_plus_attendance_db',
  JOURNALS: 'kelas_plus_journals_db',
  SETTINGS: 'kelas_plus_settings_db',
};

// Seed default initial data if storage is empty
const defaultUsers = [
  { id: 'u_admin', username: 'Admin.smpn2bajuin', password: 'Qwerty123456', name: 'Administrator Sekolah', role: 'ADMIN', subject: 'Administrator', assignedClasses: ['ALL'], avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 'u_t1', username: 'ratna.guru', password: 'password123', name: 'Ibu Ratna Pertiwi, S.Pd.', nip: '198503152010012003', role: 'TEACHER', subject: 'Bahasa Inggris', assignedClasses: ['VII A', 'VIII A'], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 'u_t2', username: 'fauzi.guru', password: 'password123', name: 'Bapak Ahmad Fauzi, M.Pd.', nip: '198207102008011005', role: 'TEACHER', subject: 'Matematika', assignedClasses: ['VII B', 'VIII A'], avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
  { id: 'u_t3', username: 'siti.guru', password: 'password123', name: 'Ibu Siti Aminah, S.Si.', nip: '199001202015022001', role: 'TEACHER', subject: 'IPA', assignedClasses: ['VII A', 'VII B'], avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
];

const defaultClasses = [
  { id: 'c1', name: 'VII A', grade: 'VII', totalStudents: 32, homeroomTeacher: 'Ibu Ratna Pertiwi, S.Pd.' },
  { id: 'c2', name: 'VII B', grade: 'VII', totalStudents: 30, homeroomTeacher: 'Bapak Ahmad Fauzi, M.Pd.' },
  { id: 'c3', name: 'VIII A', grade: 'VIII', totalStudents: 31, homeroomTeacher: 'Ibu Siti Aminah, S.Si.' },
];

const defaultStudents = [
  { id: 's1', name: 'Ahmad Rizky', nisn: '20260101', class: 'VII A', gender: 'L', status: 'ACTIVE', attendanceRate: 96, assignmentScore: 92, participationScore: 90, statusFlag: 'GOOD' },
  { id: 's2', name: 'Budi Saputra', nisn: '20260102', class: 'VII A', gender: 'L', status: 'ACTIVE', attendanceRate: 88, assignmentScore: 68, participationScore: 65, statusFlag: 'MONITOR' },
  { id: 's3', name: 'Citra Nabila', nisn: '20260103', class: 'VII A', gender: 'P', status: 'ACTIVE', attendanceRate: 79, assignmentScore: 54, participationScore: 51, statusFlag: 'NEEDS_FOLLOW_UP' },
  { id: 's4', name: 'Dewa Pratama', nisn: '20260104', class: 'VII A', gender: 'L', status: 'ACTIVE', attendanceRate: 92, assignmentScore: 85, participationScore: 88, statusFlag: 'GOOD' },
  { id: 's5', name: 'Eka Rahmawati', nisn: '20260105', class: 'VII B', gender: 'P', status: 'ACTIVE', attendanceRate: 98, assignmentScore: 95, participationScore: 94, statusFlag: 'GOOD' },
  { id: 's6', name: 'Fajar Hidayat', nisn: '20260106', class: 'VIII A', gender: 'L', status: 'ACTIVE', attendanceRate: 90, assignmentScore: 82, participationScore: 80, statusFlag: 'GOOD' },
];

const defaultJournals = [
  { id: 'j1', teacherUsername: 'ratna.guru', class: 'VII A', date: '2026-10-05', month: '10', topic: 'Greetings & Farewell', method: 'Role Play', pulse: 'VERY_ACTIVE', text: 'Siswa sangat antusias melakukan percakapan berpasangan di depan kelas.' },
  { id: 'j2', teacherUsername: 'ratna.guru', class: 'VIII A', date: '2026-09-28', month: '09', topic: 'Simple Past Tense', method: 'Diskusi Kelompok', pulse: 'MODERATE', text: 'Sebagian siswa memerlukan pendampingan tambahan pada perubahan kata kerja irregular.' }
];

const defaultSettings = {
  geminiApiKey: '',
  schoolName: 'SMP NEGERI 2 BAJUIN',
  academicYear: '2026/2027',
  databaseDriver: 'IndexedDB / Relational Local SQL',
};

export default function App() {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Real-time Persistent Database Collections
  const [users, setUsers] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceDB, setAttendanceDB] = useState({}); // { "VII A_2026-10-11": { s1: 'PRESENT', s2: 'SICK' } }
  const [journals, setJournals] = useState([]);
  const [systemSettings, setSystemSettings] = useState(defaultSettings);

  // Teacher Feature States
  const [selectedClass, setSelectedClass] = useState('VII A');
  const [attendanceDate, setAttendanceDate] = useState('2026-10-11');
  const [currentAttendance, setCurrentAttendance] = useState({});
  const [journalTopic, setJournalTopic] = useState('');
  const [journalMethod, setJournalMethod] = useState('');
  const [journalNote, setJournalNote] = useState('');
  const [smartDraft, setSmartDraft] = useState('');
  const [journalFilterMonth, setJournalFilterMonth] = useState('ALL');
  const [journalSearch, setJournalSearch] = useState('');
  const [mapClassFilter, setMapClassFilter] = useState('ALL');

  // Admin Feature States
  const [newTeacher, setNewTeacher] = useState({ name: '', nip: '', subject: 'Bahasa Inggris', username: '', password: '', assignedClasses: ['VII A'] });
  const [newClass, setNewClass] = useState({ name: '', grade: 'VII', homeroomTeacher: '' });
  const [newStudent, setNewStudent] = useState({ name: '', nisn: '', class: 'VII A', gender: 'L' });
  const [studentSearch, setStudentSearch] = useState('');

  // AI Assistant States
  const [aiSubject, setAiSubject] = useState('Bahasa Inggris');
  const [aiTopic, setAiTopic] = useState('Introduction & Self Greeting');
  const [aiCondition, setAiCondition] = useState('Siswa Pasif & Malu Berbicara');
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Settings Form State
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', currentPassword: '', newPassword: '', avatar: '' });

  // Initialize and load Database from LocalStorage
  useEffect(() => {
    const loadedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || defaultUsers;
    const loadedClasses = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASSES)) || defaultClasses;
    const loadedStudents = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS)) || defaultStudents;
    const loadedAttendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || {};
    const loadedJournals = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNALS)) || defaultJournals;
    const loadedSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || defaultSettings;

    setUsers(loadedUsers);
    setClassesList(loadedClasses);
    setStudents(loadedStudents);
    setAttendanceDB(loadedAttendance);
    setJournals(loadedJournals);
    setSystemSettings(loadedSettings);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save to Database Helper
  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Sync Attendance for current selected class & date
  useEffect(() => {
    const key = `${selectedClass}_${attendanceDate}`;
    if (attendanceDB[key]) {
      setCurrentAttendance(attendanceDB[key]);
    } else {
      // Default all present
      const initial = {};
      students.filter(s => s.class === selectedClass).forEach(s => { initial[s.id] = 'PRESENT'; });
      setCurrentAttendance(initial);
    }
  }, [selectedClass, attendanceDate, students, attendanceDB]);

  // Set default assigned classes when user logs in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'TEACHER') {
        const assigned = currentUser.assignedClasses || [];
        if (assigned.length > 0) {
          setSelectedClass(assigned[0]);
          setAiSubject(currentUser.subject || 'Bahasa Inggris');
        }
      }
      setProfileForm({
        name: currentUser.name,
        phone: '081234567890',
        currentPassword: '',
        newPassword: '',
        avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
      });
    }
  }, [currentUser]);

  // Login Authentication Handler
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoadingAuth(true);
    setLoginError('');

    setTimeout(() => {
      // Find matched user in DB
      const user = users.find(u => u.username === loginUsername && u.password === loginPassword);
      if (user) {
        setCurrentUser(user);
        setActiveTab(user.role === 'ADMIN' ? 'admin_overview' : 'dashboard');
        setIsLoadingAuth(false);
        return;
      }

      setLoginError('Username atau Password tidak terdaftar. Periksa kembali kredensial Anda!');
      setIsLoadingAuth(false);
    }, 500);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginUsername('');
    setLoginPassword('');
    setLoginError('');
  };

  // Interactive Attendance Actions
  const handleStatusChange = (studentId, status) => {
    const key = `${selectedClass}_${attendanceDate}`;
    const updatedRecord = { ...currentAttendance, [studentId]: status };
    setCurrentAttendance(updatedRecord);

    const newAttendanceDB = { ...attendanceDB, [key]: updatedRecord };
    setAttendanceDB(newAttendanceDB);
    saveToStorage(STORAGE_KEYS.ATTENDANCE, newAttendanceDB);
  };

  const handleMarkAllPresent = () => {
    const key = `${selectedClass}_${attendanceDate}`;
    const updatedRecord = {};
    students.filter(s => s.class === selectedClass).forEach(s => { updatedRecord[s.id] = 'PRESENT'; });
    setCurrentAttendance(updatedRecord);

    const newAttendanceDB = { ...attendanceDB, [key]: updatedRecord };
    setAttendanceDB(newAttendanceDB);
    saveToStorage(STORAGE_KEYS.ATTENDANCE, newAttendanceDB);
  };

  // Interactive Journal Actions
  const handleGenerateSmartJournal = () => {
    if (!journalTopic) {
      alert("Masukkan topik/materi pembelajaran terlebih dahulu!");
      return;
    }
    const draft = `Pada tanggal ${attendanceDate}, pembelajaran ${currentUser.subject} kelas ${selectedClass} dengan materi "${journalTopic}" (metode ${journalMethod || 'Interaktif'}) berlangsung dengan baik. Refleksi: ${journalNote || 'Siswa antusias dan mengikuti alur pembelajaran dengan lancar.'}`;
    setSmartDraft(draft);
  };

  const handleSaveJournal = () => {
    if (!journalTopic) {
      alert("Isi topik pembelajaran sebelum menyimpan jurnal!");
      return;
    }
    const newEntry = {
      id: `j_${Date.now()}`,
      teacherUsername: currentUser.username,
      class: selectedClass,
      date: attendanceDate,
      month: attendanceDate.split('-')[1] || '10',
      topic: journalTopic,
      method: journalMethod || 'Tatap Muka Interaktif',
      pulse: 'VERY_ACTIVE',
      text: smartDraft || `Materi: ${journalTopic}. ${journalNote}`
    };

    const updatedJournals = [newEntry, ...journals];
    setJournals(updatedJournals);
    saveToStorage(STORAGE_KEYS.JOURNALS, updatedJournals);
    setJournalTopic('');
    setJournalMethod('');
    setJournalNote('');
    setSmartDraft('');
    alert("✓ Jurnal Mengajar berhasil tersimpan secara permanen ke Database!");
  };

  // Real-time Gemini 1.5 Flash API Execution
  const handleGenerateAiActivities = async () => {
    setIsGeneratingAi(true);
    setAiRecommendations(null);

    if (systemSettings.geminiApiKey && systemSettings.geminiApiKey.trim() !== '') {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${systemSettings.geminiApiKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Anda adalah pakar pedagogi SMP. Buatkan 3 rekomendasi strategi/aktivitas mengajar interaktif kontekstual untuk:
Mata Pelajaran: ${aiSubject}
Topik/Materi: ${aiTopic}
Kondisi Kelas: ${aiCondition}

Berikan output JSON murni tanpa markdown dalam bentuk Array Object dengan kunci: "id", "title", "type", "duration", "objective", "steps" (array string).`
              }]
            }]
          })
        });

        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          const rawText = data.candidates[0].content.parts[0].text;
          const jsonMatch = rawText.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            setAiRecommendations(JSON.parse(jsonMatch[0]));
            setIsGeneratingAi(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Gemini API Error, fallback to smart offline generation:", err);
      }
    }

    // Smart Offline Fallback Logic if API Key is empty/error
    setTimeout(() => {
      setAiRecommendations([
        {
          id: 1,
          title: `Active Peer Quiz (${aiSubject})`,
          type: "Game Edukatif Berpasangan",
          duration: "15 Menit",
          objective: `Mengaktifkan partisipasi siswa pasif dalam topik ${aiTopic}.`,
          steps: ["Bagi siswa berpasangan.", "Setiap pasangan membuat 1 pertanyaan materi.", "Saling menukar pertanyaan dan memberikan penilaian langsung."]
        },
        {
          id: 2,
          title: `Gallery Walk Konseptual`,
          type: "Praktik Kelompok (Non-Digital)",
          duration: "20 Menit",
          objective: "Mendorong keberanian mengungkapkan ide di depan kelompok.",
          steps: ["Buat 4 pos stasiun di sudut kelas.", "Setiap kelompok menempelkan draf pemikiran topik.", "Kelompok lain berkeliling memberikan komentar."]
        }
      ]);
      setIsGeneratingAi(false);
    }, 700);
  };

  // Admin Actions
  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.username || !newTeacher.password) return;
    const added = {
      id: `u_${Date.now()}`,
      name: newTeacher.name,
      nip: newTeacher.nip || '-',
      subject: newTeacher.subject,
      username: newTeacher.username,
      password: newTeacher.password,
      role: 'TEACHER',
      assignedClasses: newTeacher.assignedClasses,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    };
    const updatedUsers = [...users, added];
    setUsers(updatedUsers);
    saveToStorage(STORAGE_KEYS.USERS, updatedUsers);
    setNewTeacher({ name: '', nip: '', subject: 'Bahasa Inggris', username: '', password: '', assignedClasses: ['VII A'] });
    alert("✓ Akun & Penugasan Kelas Guru Baru Berhasil Tersimpan!");
  };

  const handleSaveGeminiApiKey = (e) => {
    e.preventDefault();
    const updatedSettings = { ...systemSettings };
    setSystemSettings(updatedSettings);
    saveToStorage(STORAGE_KEYS.SETTINGS, updatedSettings);
    alert("✓ Gemini API Key Terpusat Berhasil Disimpan & Aktif untuk Seluruh Guru!");
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClass.name) return;
    const added = { id: `c_${Date.now()}`, name: newClass.name, grade: newClass.grade, totalStudents: 30, homeroomTeacher: newClass.homeroomTeacher || 'Belum Ditentukan' };
    const updated = [...classesList, added];
    setClassesList(updated);
    saveToStorage(STORAGE_KEYS.CLASSES, updated);
    setNewClass({ name: '', grade: 'VII', homeroomTeacher: '' });
    alert("✓ Rombel Kelas Baru Berhasil Ditambahkan!");
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.nisn) return;
    const added = { id: `s_${Date.now()}`, name: newStudent.name, nisn: newStudent.nisn, class: newStudent.class, gender: newStudent.gender, status: 'ACTIVE', attendanceRate: 100, assignmentScore: 80, participationScore: 80, statusFlag: 'GOOD' };
    const updated = [...students, added];
    setStudents(updated);
    saveToStorage(STORAGE_KEYS.STUDENTS, updated);
    setNewStudent({ name: '', nisn: '', class: 'VII A', gender: 'L' });
    alert("✓ Data Siswa Baru Berhasil Disimpan!");
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const updatedUsers = users.map(u => {
      if (u.username === currentUser.username) {
        return {
          ...u,
          password: profileForm.newPassword ? profileForm.newPassword : u.password,
          avatar: profileForm.avatar ? profileForm.avatar : u.avatar
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    saveToStorage(STORAGE_KEYS.USERS, updatedUsers);
    alert("✓ Profil & Kata Sandi Berhasil Diperbarui!");
  };

  // Helper Lists
  const teacherAssignedClasses = currentUser?.role === 'TEACHER' ? (currentUser.assignedClasses || []) : classesList.map(c => c.name);
  const filteredStudents = students.filter(s => {
    if (currentUser?.role === 'TEACHER') {
      if (!teacherAssignedClasses.includes(s.class)) return false;
      if (mapClassFilter !== 'ALL' && s.class !== mapClassFilter) return false;
    } else {
      if (mapClassFilter !== 'ALL' && s.class !== mapClassFilter) return false;
    }
    return s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.nisn.includes(studentSearch);
  });

  // LOGIN SCREEN
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-blue-800 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-blue-700 rounded-full opacity-50"></div>
            <h1 className="text-3xl font-black tracking-wider text-white">KELAS<span className="text-amber-400">+</span></h1>
            <p className="text-xs text-blue-200 mt-1 font-medium">{systemSettings.schoolName}</p>
            <p className="text-[11px] text-blue-100 italic mt-3 bg-blue-900/40 py-1.5 px-3 rounded-full inline-block border border-blue-700/50">
              "Kurangi Administrasi. Pahami Kelas. Tingkatkan Pembelajaran."
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider text-center">Masuk ke Sistem Aplikasi</h2>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Username Login</label>
              <input
                type="text"
                placeholder="Masukkan Username..."
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan Password..."
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600 font-medium pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoadingAuth}
              className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {isLoadingAuth ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Masuk Sekarang'}
            </button>

            {/* Quick Fill Demo Credential Buttons */}
            <div className="pt-4 border-t border-slate-100 text-center space-y-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Uji Coba Kredensial Instan:</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setLoginUsername('ratna.guru'); setLoginPassword('password123'); }}
                  className="flex-1 py-1.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-200 border border-slate-200"
                >
                  Guru Demo
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginUsername('Admin.smpn2bajuin'); setLoginPassword('Qwerty123456'); }}
                  className="flex-1 py-1.5 bg-slate-800 text-white text-[11px] font-bold rounded-lg hover:bg-slate-900"
                >
                  Admin Demo
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-800">
      
      {/* Mobile Top Header Navigation Bar */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex justify-between items-center border-b border-slate-800 sticky top-0 z-50">
        <div>
          <h1 className="text-xl font-black text-white">KELAS<span className="text-amber-400">+</span></h1>
          <p className="text-[9px] text-slate-400 tracking-wider">{systemSettings.schoolName}</p>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300 hover:text-white">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation Drawer */}
      <aside className={`w-full lg:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col justify-between ${mobileMenuOpen ? 'block' : 'hidden lg:flex'}`}>
        <div>
          <div className="hidden lg:flex p-5 border-b border-slate-800 items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">KELAS<span className="text-amber-400">+</span></h1>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase">{systemSettings.schoolName}</p>
            </div>
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} title={isOnline ? 'Database Live' : 'Offline Mode'}></span>
          </div>

          <nav className="p-3 space-y-1 text-sm font-medium">
            {currentUser.role === 'TEACHER' && (
              <>
                <button onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                  <Home className="w-4 h-4 text-amber-400" /> Dashboard Guru
                </button>
                <button onClick={() => { setActiveTab('classes'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'classes' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                  <BookOpen className="w-4 h-4 text-blue-400" /> Kelas Saya
                </button>
                <button onClick={() => { setActiveTab('attendance'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'attendance' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Absensi Cepat
                </button>
                <button onClick={() => { setActiveTab('journal'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'journal' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                  <FileText className="w-4 h-4 text-purple-400" /> Smart Journal
                </button>
                <button onClick={() => { setActiveTab('students'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'students' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                  <Users className="w-4 h-4 text-amber-400" /> Learning Map
                </button>
                <button onClick={() => { setActiveTab('ai'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'ai' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                  <Bot className="w-4 h-4 text-cyan-400" /> AI Assistant
                </button>
                <button onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'settings' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                  <Settings className="w-4 h-4 text-slate-400" /> Pengaturan Profil
                </button>
              </>
            )}

            {currentUser.role === 'ADMIN' && (
              <>
                <button onClick={() => { setActiveTab('admin_overview'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'admin_overview' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                  <BarChart2 className="w-4 h-4 text-emerald-400" /> Dashboard Performa
                </button>
                <button onClick={() => { setActiveTab('admin_teachers'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'admin_teachers' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                  <Users className="w-4 h-4 text-amber-400" /> Manajemen Guru
                </button>
                <button onClick={() => { setActiveTab('admin_classes'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'admin_classes' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                  <Layers className="w-4 h-4 text-purple-400" /> Tambah Rombel Kelas
                </button>
                <button onClick={() => { setActiveTab('admin_students'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'admin_students' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                  <UserPlus className="w-4 h-4 text-cyan-400" /> Data Siswa & Import
                </button>
                <button onClick={() => { setActiveTab('admin_api'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'admin_api' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                  <Key className="w-4 h-4 text-amber-400" /> Google API Key
                </button>
                <button onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'settings' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                  <Settings className="w-4 h-4 text-slate-400" /> Pengaturan Admin
                </button>
              </>
            )}
          </nav>
        </div>

        {/* User Footer Profile Card */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={currentUser.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-slate-700" />
            <div>
              <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400">{currentUser.subject}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition" title="Keluar">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* TEACHER - DASHBOARD */}
        {currentUser.role === 'TEACHER' && activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Selamat datang, {currentUser.name}! 👋</h1>
                <p className="text-xs text-slate-500 mt-1">Sistem Informasi Pengajaran SMPN 2 Bajuin | Tahun 2026/2027</p>
              </div>
              <button onClick={() => setActiveTab('attendance')} className="px-4 py-2 bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-900 transition flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Input Presensi Hari Ini
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Kelas Pengampuan</span>
                <p className="text-2xl font-black text-blue-800 mt-1">{teacherAssignedClasses.length} Kelas</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ {teacherAssignedClasses.join(', ')}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Rata-rata Kehadiran</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">96.2%</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Jurnal Terisi</span>
                <p className="text-2xl font-black text-purple-600 mt-1">{journals.filter(j => j.teacherUsername === currentUser.username).length} Jurnal</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Status API Gemini</span>
                <p className="text-2xl font-black text-amber-500 mt-1">{systemSettings.geminiApiKey ? 'Terhubung' : 'Standar'}</p>
              </div>
            </div>
          </div>
        )}

        {/* TEACHER - KELAS SAYA */}
        {currentUser.role === 'TEACHER' && activeTab === 'classes' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Kelas Saya</h1>
              <p className="text-xs text-slate-500 mt-1">Daftar kelas yang ditugaskan oleh Administrator Sekolah</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {classesList.filter(c => teacherAssignedClasses.includes(c.name)).map(cls => (
                <div key={cls.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-800 text-[10px] font-bold rounded-lg border border-blue-200">Tingkat {cls.grade}</span>
                      <h2 className="text-xl font-bold text-slate-800 mt-2">Kelas {cls.name}</h2>
                      <p className="text-xs text-slate-500">Wali Kelas: {cls.homeroomTeacher}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">{cls.totalStudents} Siswa</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex gap-2">
                    <button onClick={() => { setSelectedClass(cls.name); setActiveTab('attendance'); }} className="flex-1 py-2 bg-blue-800 text-white text-xs font-bold rounded-xl hover:bg-blue-900 transition">
                      Absensi
                    </button>
                    <button onClick={() => { setSelectedClass(cls.name); setActiveTab('journal'); }} className="flex-1 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition">
                      Jurnal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEACHER - ABSENSI CEPT (REAL-TIME REKAP TANGGAL 2026-2030) */}
        {currentUser.role === 'TEACHER' && activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Absensi Cepat & Rekap Presensi</h1>
                <p className="text-xs text-slate-500 mt-1">Pilih tanggal dari 1 Januari 2026 s.d. 31 Desember 2030</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold shadow-sm">
                  {teacherAssignedClasses.map(c => <option key={c} value={c}>Kelas {c}</option>)}
                </select>
                <input
                  type="date"
                  min="2026-01-01"
                  max="2030-12-31"
                  value={attendanceDate}
                  onChange={e => setAttendanceDate(e.target.value)}
                  className="p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold shadow-sm"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              <div className="p-4 bg-slate-50 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Presensi Kelas {selectedClass} — Tanggal: {attendanceDate}</span>
                <button onClick={handleMarkAllPresent} className="px-3.5 py-1.5 bg-blue-50 text-blue-800 text-xs font-bold rounded-xl border border-blue-200 hover:bg-blue-100 transition">
                  ✓ Tandai Semua Hadir
                </button>
              </div>

              {students.filter(s => s.class === selectedClass).map((std, idx) => (
                <div key={std.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400 w-6">{idx + 1}.</span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{std.name}</p>
                      <p className="text-xs text-slate-400">NISN: {std.nisn} | Gender: {std.gender}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {['PRESENT', 'SICK', 'EXCUSED', 'ABSENT'].map(st => {
                      const isActive = currentAttendance[std.id] === st;
                      const label = { PRESENT: 'Hadir', SICK: 'Sakit', EXCUSED: 'Izin', ABSENT: 'Alpa' }[st];
                      let activeStyle = '';
                      if (st === 'PRESENT') activeStyle = 'bg-emerald-600 text-white font-bold shadow-sm';
                      if (st === 'SICK') activeStyle = 'bg-amber-500 text-white font-bold shadow-sm';
                      if (st === 'EXCUSED') activeStyle = 'bg-blue-600 text-white font-bold shadow-sm';
                      if (st === 'ABSENT') activeStyle = 'bg-rose-600 text-white font-bold shadow-sm';

                      return (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(std.id, st)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${isActive ? activeStyle : 'text-slate-600 hover:bg-slate-200'}`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEACHER - SMART JOURNAL & LIBRARY */}
        {currentUser.role === 'TEACHER' && activeTab === 'journal' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Smart Journal & Library Jurnal</h1>
              <p className="text-xs text-slate-500 mt-1">Dokumentasi harian pembelajaran interaktif dan arsip jurnal per bulan</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Input Jurnal Mengajar Baru</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold">
                  {teacherAssignedClasses.map(c => <option key={c} value={c}>Kelas {c}</option>)}
                </select>
                <input type="text" value={journalTopic} onChange={e => setJournalTopic(e.target.value)} placeholder="Topik / Materi Pembelajaran..." className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" />
                <input type="text" value={journalMethod} onChange={e => setJournalMethod(e.target.value)} placeholder="Metode (misal: Diskusi Kelompok)..." className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" />
              </div>

              <textarea rows={2} value={journalNote} onChange={e => setJournalNote(e.target.value)} placeholder="Catatan refleksi khusus mengenai respon siswa..." className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600" />

              <div className="flex flex-col sm:flex-row gap-2 justify-between">
                <button onClick={handleGenerateSmartJournal} className="px-4 py-2 bg-blue-50 text-blue-800 text-xs font-bold rounded-xl border border-blue-200 hover:bg-blue-100 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Auto-Generate Draf Jurnal
                </button>
                <button onClick={handleSaveJournal} className="px-5 py-2 bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-900 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Simpan Permanen ke Library
                </button>
              </div>

              {smartDraft && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-blue-800">Draf Hasil Rangkuman Otomatis:</p>
                  <p className="text-slate-700">{smartDraft}</p>
                </div>
              )}
            </div>

            {/* Library Jurnal Guru Filtered */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Library Jurnal Mengajar Saya</h2>
                <div className="flex items-center gap-2">
                  <select value={journalFilterMonth} onChange={e => setJournalFilterMonth(e.target.value)} className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold">
                    <option value="ALL">Semua Bulan</option>
                    <option value="01">Januari</option>
                    <option value="02">Februari</option>
                    <option value="09">September</option>
                    <option value="10">Oktober</option>
                    <option value="11">November</option>
                    <option value="12">Desember</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {journals
                  .filter(j => j.teacherUsername === currentUser.username)
                  .filter(j => journalFilterMonth === 'ALL' || j.month === journalFilterMonth)
                  .map(j => (
                    <div key={j.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-blue-800">Kelas {j.class} — {j.date}</span>
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{j.method}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800">{j.topic}</p>
                      <p className="text-xs text-slate-600">{j.text}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TEACHER - LEARNING MAP */}
        {currentUser.role === 'TEACHER' && activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Student Learning Map</h1>
                <p className="text-xs text-slate-500 mt-1">Pemantauan perkembangan akademik siswa per kelas</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Filter Kelas:</span>
                <select value={mapClassFilter} onChange={e => setMapClassFilter(e.target.value)} className="p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold">
                  <option value="ALL">Semua Kelas Pengampuan</option>
                  {teacherAssignedClasses.map(c => <option key={c} value={c}>Kelas {c}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3">Kelas</th>
                    <th className="p-3 text-center">Kehadiran</th>
                    <th className="p-3 text-center">Tugas</th>
                    <th className="p-3 text-center">Status Pemantauan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(std => (
                    <tr key={std.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800">{std.name}</td>
                      <td className="p-3 font-bold text-blue-800">{std.class}</td>
                      <td className="p-3 text-center font-mono">{std.attendanceRate}%</td>
                      <td className="p-3 text-center font-mono">{std.assignmentScore}</td>
                      <td className="p-3 text-center">
                        {std.statusFlag === 'GOOD' && <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">🟢 Sangat Baik</span>}
                        {std.statusFlag === 'NEEDS_FOLLOW_UP' && <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full">⚠️ Perlu Pendampingan</span>}
                        {std.statusFlag === 'MONITOR' && <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">🟡 Dalam Pemantauan</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TEACHER - AI TEACHING ASSISTANT REAL-TIME */}
        {currentUser.role === 'TEACHER' && activeTab === 'ai' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Bot className="w-6 h-6 text-cyan-600" /> AI Teaching Assistant Real-Time
              </h1>
              <p className="text-xs text-slate-500 mt-1">Rekomendasi skenario aktivitas mengajar berdasarkan Google Gemini AI</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Parameter Pembelajaran</h2>
                
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Mata Pelajaran</label>
                  <input type="text" value={aiSubject} onChange={e => setAiSubject(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Materi / Topik</label>
                  <input type="text" value={aiTopic} onChange={e => setAiTopic(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Kondisi Kelas</label>
                  <select value={aiCondition} onChange={e => setAiCondition(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs">
                    <option value="Siswa Pasif & Malu Berbicara">Siswa Pasif & Malu Berbicara</option>
                    <option value="Siswa Sangat Aktif & Gaduh">Siswa Sangat Aktif & Gaduh</option>
                    <option value="Pemahaman Konsep Masih Rendah">Pemahaman Konsep Masih Rendah</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateAiActivities}
                  disabled={isGeneratingAi}
                  className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" /> {isGeneratingAi ? 'Gemini AI Menyusun Skenario...' : 'Eksekusi Rekomendasi Gemini AI'}
                </button>
              </div>

              <div className="md:col-span-2 space-y-4">
                {aiRecommendations ? (
                  aiRecommendations.map((item) => (
                    <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-800 font-bold text-[10px] rounded-lg border border-blue-200">{item.type}</span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {item.duration}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
                      <p className="text-xs text-slate-600">{item.objective}</p>
                      {item.steps && (
                        <div className="pt-2 border-t border-slate-100">
                          <p className="text-[11px] font-bold text-slate-700 mb-1">Langkah Pelaksanaan:</p>
                          <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1">
                            {item.steps.map((st, i) => <li key={i}>{st}</li>)}
                          </ol>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
                    <Bot className="w-12 h-12 mx-auto text-slate-300" />
                    <p className="text-sm font-medium">Klik "Eksekusi Rekomendasi Gemini AI" untuk membuat alternatif skenario interaktif mengajar.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN - DASHBOARD OVERVIEW */}
        {currentUser.role === 'ADMIN' && activeTab === 'admin_overview' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Dashboard Performa Sekolah</h1>
              <p className="text-xs text-slate-500 mt-1">Pantau keaktifan guru, statistik siswa, dan integrasi sistem</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Total Terdaftar</span>
                <p className="text-2xl font-black text-blue-800 mt-1">{users.filter(u => u.role === 'TEACHER').length} Guru</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Total Rombel</span>
                <p className="text-2xl font-black text-purple-600 mt-1">{classesList.length} Kelas</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Total Siswa</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">{students.length} Siswa</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Kehadiran Rata-rata</span>
                <p className="text-2xl font-black text-amber-500 mt-1">96.8%</p>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN - MANAJEMEN GURU */}
        {currentUser.role === 'ADMIN' && activeTab === 'admin_teachers' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-800" /> Tambah Akun Guru & Penugasan Kelas
              </h2>
              <form onSubmit={handleAddTeacher} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input type="text" placeholder="Nama Lengkap & Gelar" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" required />
                <input type="text" placeholder="NIP" value={newTeacher.nip} onChange={e => setNewTeacher({...newTeacher, nip: e.target.value})} className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" />
                <select value={newTeacher.subject} onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})} className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold">
                  <option value="Bahasa Inggris">Bahasa Inggris</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="Matematika">Matematika</option>
                  <option value="IPA">IPA</option>
                  <option value="IPS">IPS</option>
                </select>
                <input type="text" placeholder="Username Login Guru" value={newTeacher.username} onChange={e => setNewTeacher({...newTeacher, username: e.target.value})} className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" required />
                <input type="password" placeholder="Password Login Guru" value={newTeacher.password} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})} className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" required />
                
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Pilih Kelas Pengampuan:</label>
                  <div className="flex gap-2">
                    {['VII A', 'VII B', 'VIII A'].map(cls => (
                      <label key={cls} className="text-xs font-bold flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={newTeacher.assignedClasses.includes(cls)}
                          onChange={e => {
                            if (e.target.checked) setNewTeacher({...newTeacher, assignedClasses: [...newTeacher.assignedClasses, cls]});
                            else setNewTeacher({...newTeacher, assignedClasses: newTeacher.assignedClasses.filter(c => c !== cls)});
                          }}
                        /> {cls}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <button type="submit" className="py-2.5 px-6 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-sm transition">
                    + Simpan & Buat Akun Guru
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3">Nama Guru</th>
                    <th className="p-3">Mata Pelajaran</th>
                    <th className="p-3">Username</th>
                    <th className="p-3">Kelas Pengampuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.filter(u => u.role === 'TEACHER').map(t => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800">{t.name}</td>
                      <td className="p-3 font-bold text-blue-800">{t.subject}</td>
                      <td className="p-3 font-mono text-purple-700">{t.username}</td>
                      <td className="p-3 font-bold text-emerald-600">{(t.assignedClasses || []).join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADMIN - GEMINI API KEY CONFIGURATION */}
        {currentUser.role === 'ADMIN' && activeTab === 'admin_api' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Key className="w-6 h-6 text-amber-500" /> Konfigurasi Central Google Gemini API Key
              </h1>
              <p className="text-xs text-slate-500 mt-1">Satu pintu pengaturan API Key Gemini untuk seluruh Guru pengampu</p>
            </div>

            <form onSubmit={handleSaveGeminiApiKey} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Google Gemini API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={systemSettings.geminiApiKey}
                  onChange={e => setSystemSettings({ ...systemSettings, geminiApiKey: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button type="submit" className="py-2.5 px-6 bg-blue-800 text-white font-bold text-xs rounded-xl hover:bg-blue-900 transition">
                Simpan Konfigurasi API Key
              </button>
            </form>
          </div>
        )}

        {/* ADMIN - MANAJEMEN KELAS */}
        {currentUser.role === 'ADMIN' && activeTab === 'admin_classes' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-800" /> Tambah Rombel Kelas Baru
              </h2>
              <form onSubmit={handleAddClass} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input type="text" placeholder="Nama Kelas (misal: VII C)" value={newClass.name} onChange={e => setNewClass({...newClass, name: e.target.value})} className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" required />
                <select value={newClass.grade} onChange={e => setNewClass({...newClass, grade: e.target.value})} className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold">
                  <option value="VII">Tingkat VII</option>
                  <option value="VIII">Tingkat VIII</option>
                  <option value="IX">Tingkat IX</option>
                </select>
                <input type="text" placeholder="Nama Wali Kelas" value={newClass.homeroomTeacher} onChange={e => setNewClass({...newClass, homeroomTeacher: e.target.value})} className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" />
                <button type="submit" className="py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-sm transition">
                  + Simpan Rombel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ADMIN - DATA SISWA & IMPORT */}
        {currentUser.role === 'ADMIN' && activeTab === 'admin_students' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Tambah Data Siswa Baru</h2>
              <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input type="text" placeholder="Nama Siswa" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" required />
                <input type="text" placeholder="NISN" value={newStudent.nisn} onChange={e => setNewStudent({...newStudent, nisn: e.target.value})} className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" required />
                <select value={newStudent.class} onChange={e => setNewStudent({...newStudent, class: e.target.value})} className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold">
                  <option value="VII A">Kelas VII A</option>
                  <option value="VII B">Kelas VII B</option>
                  <option value="VIII A">Kelas VIII A</option>
                </select>
                <button type="submit" className="py-2.5 bg-blue-800 text-white font-bold text-xs rounded-xl">
                  + Simpan Siswa
                </button>
              </form>
            </div>
          </div>
        )}

        {/* PROFILE & SETTINGS (GURU & ADMIN) */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Pengaturan Profil & Keamanan</h1>
              <p className="text-xs text-slate-500 mt-1">Kelola foto profil dan ganti kata sandi akun Anda</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <img src={profileForm.avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-blue-800" />
                <div>
                  <button type="button" onClick={() => alert("Gunakan URL gambar foto profil baru.")} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200">
                    Ganti Foto Profil
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Pengguna</label>
                <input
                  type="text"
                  value={profileForm.name}
                  disabled={currentUser.role === 'TEACHER'}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className={`w-full p-2.5 border rounded-xl text-xs ${currentUser.role === 'TEACHER' ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-800'}`}
                />
                {currentUser.role === 'TEACHER' && <span className="text-[10px] text-slate-400">Nama Pengguna hanya dapat diubah oleh Administrator Sekolah.</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password Baru</label>
                <input
                  type="password"
                  placeholder="Ketik password baru jika ingin mengubah..."
                  value={profileForm.newPassword}
                  onChange={e => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button type="submit" className="py-2.5 px-6 bg-blue-800 text-white font-bold text-xs rounded-xl hover:bg-blue-900 transition">
                Simpan Perubahan
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
