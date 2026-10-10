import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Calendar, BookOpen, AlertTriangle, FileText, 
  Bot, Settings, CheckCircle, Clock, Plus, BarChart2, ChevronRight, 
  Sparkles, Wifi, ShieldAlert, LogOut, Download, Search, Edit3, Trash2, UserPlus, Filter
} from 'lucide-react';

export default function App() {
  const [userRole, setUserRole] = useState(null); // 'TEACHER' | 'ADMIN' | null
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClass, setSelectedClass] = useState('VII A');
  const [isOnline, setIsOnline] = useState(true);

  // Filter & Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('ALL');

  // Interactive Attendance State
  const [attendance, setAttendance] = useState({
    's1': 'PRESENT', 's2': 'PRESENT', 's3': 'PRESENT', 's4': 'SICK', 's5': 'PRESENT'
  });

  // Interactive Classroom Pulse State
  const [pulse, setPulse] = useState('VERY_ACTIVE');
  const [pulseIndicators, setPulseIndicators] = useState(['Siswa aktif', 'Aktivitas berjalan baik']);
  const [journalNote, setJournalNote] = useState('');
  const [smartDraft, setSmartDraft] = useState('');

  // Interactive AI Assistant State
  const [aiSubject, setAiSubject] = useState('Bahasa Inggris');
  const [aiGrade, setAiGrade] = useState('VII');
  const [aiTopic, setAiTopic] = useState('Introduction & Self Greeting');
  const [aiDuration, setAiDuration] = useState('40 Menit');
  const [aiCondition, setAiCondition] = useState('Siswa Pasif & Malu Berbicara');
  const [aiInternet, setAiInternet] = useState('TIDAK');
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Admin Data State
  const [students, setStudents] = useState([
    { id: 's1', name: 'Ahmad Rizky', nisn: '20260101', class: 'VII A', gender: 'L', status: 'ACTIVE', attendanceRate: 96, assignmentScore: 92, participationScore: 90 },
    { id: 's2', name: 'Budi Saputra', nisn: '20260102', class: 'VII A', gender: 'L', status: 'ACTIVE', attendanceRate: 88, assignmentScore: 68, participationScore: 65 },
    { id: 's3', name: 'Citra Nabila', nisn: '20260103', class: 'VII A', gender: 'P', status: 'ACTIVE', attendanceRate: 79, assignmentScore: 54, participationScore: 51 },
    { id: 's4', name: 'Dewa Pratama', nisn: '20260104', class: 'VII A', gender: 'L', status: 'ACTIVE', attendanceRate: 92, assignmentScore: 85, participationScore: 88 },
    { id: 's5', name: 'Eka Rahmawati', nisn: '20260105', class: 'VII B', gender: 'P', status: 'ACTIVE', attendanceRate: 98, assignmentScore: 95, participationScore: 94 },
  ]);

  const [newStudent, setNewStudent] = useState({ name: '', nisn: '', class: 'VII A', gender: 'L' });

  // Handle Online/Offline Status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleMarkAllPresent = () => {
    const updated = {};
    students.forEach(s => updated[s.id] = 'PRESENT');
    setAttendance(updated);
  };

  const handleGenerateSmartJournal = () => {
    const pulseText = pulse === 'VERY_ACTIVE' ? 'sangat aktif dan antusias' : 'cukup kondusif';
    const draft = `Pada pembelajaran ${aiSubject} kelas ${selectedClass} dengan materi "${aiTopic}", proses pembelajaran berlangsung ${pulseText}. Indikator: ${pulseIndicators.join(', ')}. ${journalNote ? `Catatan guru: "${journalNote}"` : ''}`;
    setSmartDraft(draft);
  };

  const handleGenerateAiActivities = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setAiRecommendations([
        {
          id: 1,
          title: "Find Someone Who...",
          type: "Game Berpasangan & Aktivitas Bergerak",
          duration: "15 Menit",
          objective: "Mendorong siswa pasif berbicara Bahasa Inggris tanpa rasa malu.",
          steps: [
            "Bagikan lembar tabel kriteria sederhana.",
            "Minta siswa berdiri dan mencari teman yang sesuai kriteria.",
            "Siswa mengucapkan kalimat sapaan 'Hello, do you like...?'"
          ]
        },
        {
          id: 2,
          title: "Pair Card Exchange",
          type: "Praktik Berpasangan (Offline)",
          duration: "15 Menit",
          objective: "Melatih pengucapan kosa kata dasar secara berulang.",
          steps: [
            "Bagi siswa menjadi pasangan 2 orang.",
            "Setiap pasangan mendapat 3 kartu pertanyaan.",
            "Siswa bergantian bertanya dan menjawab dalam durasi 2 menit."
          ]
        },
        {
          id: 3,
          title: "Rantai Kata (Name Chain)",
          type: "Aktivitas Kelas Utuh",
          duration: "10 Menit",
          objective: "Membangun fokus dan ingatan kosa kata secara menyenangkan.",
          steps: [
            "Siswa pertama memperkenalkan diri.",
            "Siswa kedua mengulang nama siswa pertama lalu menyebutkan namanya.",
            "Lanjutkan hingga 5-8 siswa secara bergantian."
          ]
        }
      ]);
      setIsGeneratingAi(false);
    }, 800);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.nisn) return;
    const added = {
      id: `s${students.length + 1}`,
      name: newStudent.name,
      nisn: newStudent.nisn,
      class: newStudent.class,
      gender: newStudent.gender,
      status: 'ACTIVE',
      attendanceRate: 100,
      assignmentScore: 80,
      participationScore: 80
    };
    setStudents([...students, added]);
    setNewStudent({ name: '', nisn: '', class: 'VII A', gender: 'L' });
  };

  // Login View
  if (!userRole) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-blue-800 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-blue-700 rounded-full opacity-50"></div>
            <h1 className="text-3xl font-black tracking-wider text-white">KELAS<span className="text-amber-400">+</span></h1>
            <p className="text-xs text-blue-200 mt-1 font-medium">Sistem Manajemen Kelas & Administrasi Guru SMP</p>
            <p className="text-[11px] text-blue-100 italic mt-3 bg-blue-900/40 py-1 px-3 rounded-full inline-block border border-blue-700/50">
              "Kurangi Administrasi. Pahami Kelas. Tingkatkan Pembelajaran."
            </p>
          </div>

          <div className="p-6 space-y-5">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Pilih Akun Demo untuk Masuk:</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => setUserRole('TEACHER')}
                  className="w-full py-3.5 px-4 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl shadow-md transition flex items-center justify-between group"
                >
                  <div className="text-left">
                    <p className="text-sm font-bold">Masuk sebagai Guru</p>
                    <p className="text-[11px] text-blue-200 font-normal">Akses Absensi, Jurnal, AI Assistant, & Kelas</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setUserRole('ADMIN')}
                  className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md transition flex items-center justify-between group"
                >
                  <div className="text-left">
                    <p className="text-sm font-bold">Masuk sebagai Admin Sekolah</p>
                    <p className="text-[11px] text-slate-300 font-normal">Akses Data Siswa, Kelas, Guru, & Kelola Sekolah</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
              Aplikasi khusus Guru & Sekolah SMP Indonesia
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-800">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">KELAS<span className="text-amber-400">+</span></h1>
              <p className="text-[10px] text-slate-400 tracking-wider">SMP NEGERI CONTOH 1</p>
            </div>
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} title={isOnline ? 'Online' : 'Offline'}></span>
          </div>

          <nav className="p-3 space-y-1 text-sm font-medium">
            {userRole === 'TEACHER' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Home className="w-4 h-4 text-amber-400" /> Dashboard Guru
                </button>
                <button
                  onClick={() => setActiveTab('classes')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'classes' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <BookOpen className="w-4 h-4 text-blue-400" /> Kelas Saya
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'attendance' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Absensi Cepat
                </button>
                <button
                  onClick={() => setActiveTab('journal')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'journal' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <FileText className="w-4 h-4 text-purple-400" /> Smart Journal
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'students' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Users className="w-4 h-4 text-amber-400" /> Learning Map
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'ai' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <Bot className="w-4 h-4 text-cyan-400" /> AI Assistant
                </button>
                <button
                  onClick={() => setActiveTab('impact')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'impact' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <BarChart2 className="w-4 h-4 text-emerald-400" /> Dampak KELAS+
                </button>
              </>
            )}

            {userRole === 'ADMIN' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${activeTab === 'admin' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <Settings className="w-4 h-4 text-amber-400" /> Panel Admin Sekolah
              </button>
            )}
          </nav>
        </div>

        {/* User Footer info */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white">{userRole === 'TEACHER' ? 'Ibu Ratna Pertiwi, S.Pd.' : 'Admin Sekolah'}</p>
            <p className="text-[10px] text-slate-400">{userRole === 'TEACHER' ? 'Guru Bahasa Inggris' : 'Administrator'}</p>
          </div>
          <button
            onClick={() => setUserRole(null)}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
            title="Keluar / Ganti Role"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* Network Banner */}
        {!isOnline && (
          <div className="mb-6 p-3 bg-amber-500 text-slate-900 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm">
            <Wifi className="w-4 h-4" /> Mode Offline Aktif. Data tersimpan sementara di lokal dan akan disinkronkan saat koneksi kembali.
          </div>
        )}

        {/* TEACHER DASHBOARD */}
        {userRole === 'TEACHER' && activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Selamat datang, Ibu Ratna Pertiwi! 👋</h1>
                <p className="text-xs text-slate-500 mt-1">Minggu, 11 Oktober 2026 | Tahun Pelajaran 2026/2027</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('attendance')} className="px-4 py-2 bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-900 transition">
                  + Presensi Hari Ini
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Kelas Hari Ini</span>
                <p className="text-2xl font-black text-blue-800 mt-1">4 Kelas</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ VII A, VIII A, IX B</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Rata-rata Kehadiran</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">94%</p>
                <p className="text-[10px] text-slate-400 mt-1">Peningkatan 2% dari bulan lalu</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Jurnal Terisi</span>
                <p className="text-2xl font-black text-purple-600 mt-1">8/10</p>
                <p className="text-[10px] text-slate-400 mt-1">Tersisa 2 draft</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-medium">Perlu Perhatian</span>
                <p className="text-2xl font-black text-amber-500 mt-1">3 Siswa</p>
                <p className="text-[10px] text-amber-600 font-bold mt-1">⚠️ Butuh tindak lanjut</p>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Jadwal Mengajar Hari Ini</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded-full">Selesai</span>
                    <h3 className="text-base font-bold text-slate-800 mt-1">Kelas VII A — Bahasa Inggris</h3>
                    <p className="text-xs text-slate-500">Materi: Introduction & Self Greeting | Jam: 07.30–08.50 WITA</p>
                  </div>
                  <button onClick={() => setActiveTab('journal')} className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-emerald-700">
                    Lihat Jurnal
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 bg-blue-200 text-blue-800 text-[10px] font-bold rounded-full">Siap Dimulai</span>
                    <h3 className="text-base font-bold text-slate-800 mt-1">Kelas VIII A — Bahasa Inggris</h3>
                    <p className="text-xs text-slate-500">Materi: Simple Past Tense | Jam: 10.45–12.05 WITA</p>
                  </div>
                  <button onClick={() => { setSelectedClass('VIII A'); setActiveTab('attendance'); }} className="px-4 py-2 bg-blue-800 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-blue-900">
                    Mulai Pembelajaran
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABSENSI CEPT VIEW */}
        {userRole === 'TEACHER' && activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Absensi Cepat Kelas {selectedClass}</h1>
                <p className="text-xs text-slate-500 mt-1">Satu Klik "Tandai Semua Hadir" untuk efisiensi waktu</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleMarkAllPresent} className="px-3 py-2 bg-blue-50 text-blue-800 text-xs font-bold rounded-xl border border-blue-200 hover:bg-blue-100">
                  ✓ Tandai Semua Hadir
                </button>
                <button onClick={() => setActiveTab('journal')} className="px-4 py-2 bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-900">
                  Simpan & Lanjut ke Pulse
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
              {students.map((std, idx) => (
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
                      const isActive = attendance[std.id] === st;
                      const label = { PRESENT: 'Hadir', SICK: 'Sakit', EXCUSED: 'Izin', ABSENT: 'Alpa' }[st];
                      let activeStyle = '';
                      if (st === 'PRESENT') activeStyle = 'bg-emerald-600 text-white font-bold shadow-sm';
                      if (st === 'SICK') activeStyle = 'bg-amber-500 text-white font-bold shadow-sm';
                      if (st === 'EXCUSED') activeStyle = 'bg-blue-600 text-white font-bold shadow-sm';
                      if (st === 'ABSENT') activeStyle = 'bg-rose-600 text-white font-bold shadow-sm';

                      return (
                        <button
                          key={st}
                          onClick={() => setAttendance({ ...attendance, [std.id]: st })}
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

        {/* AI ASSISTANT VIEW */}
        {userRole === 'TEACHER' && activeTab === 'ai' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Bot className="w-6 h-6 text-cyan-600" /> AI Teaching Assistant
              </h1>
              <p className="text-xs text-slate-500 mt-1">Rekomendasi Aktivitas Pembelajaran Kontekstual untuk Seluruh Mata Pelajaran SMP</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Kondisi & Parameter Kelas</h2>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mata Pelajaran</label>
                  <select value={aiSubject} onChange={e => setAiSubject(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold">
                    <option value="Bahasa Inggris">Bahasa Inggris</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="Matematika">Matematika</option>
                    <option value="IPA (Ilmu Pengetahuan Alam)">IPA (Ilmu Pengetahuan Alam)</option>
                    <option value="IPS (Ilmu Pengetahuan Sosial)">IPS (Ilmu Pengetahuan Sosial)</option>
                    <option value="Informatika">Informatika</option>
                    <option value="Pendidikan Pancasila / PPKn">Pendidikan Pancasila / PPKn</option>
                    <option value="PJOK">PJOK (Olahraga)</option>
                    <option value="Projek P5">Projek P5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Materi / Topik</label>
                  <input type="text" value={aiTopic} onChange={e => setAiTopic(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kondisi Kelas</label>
                  <select value={aiCondition} onChange={e => setAiCondition(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs">
                    <option value="Siswa Pasif & Malu Berbicara">Siswa Pasif & Malu Berbicara</option>
                    <option value="Siswa Sangat Aktif & Gaduh">Siswa Sangat Aktif & Gaduh</option>
                    <option value="Siswa Kesulitan Memahami Rumus">Siswa Kesulitan Memahami Rumus</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateAiActivities}
                  disabled={isGeneratingAi}
                  className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" /> {isGeneratingAi ? 'Menyusun Aktivitas...' : 'Hasilkan Rekomendasi AI'}
                </button>
              </div>

              {/* Recommendations Result */}
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
                      
                      <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold text-slate-700 block">Langkah-Langkah:</span>
                        {item.steps.map((st, i) => (
                          <p key={i} className="text-xs text-slate-600">{i + 1}. {st}</p>
                        ))}
                      </div>

                      <button onClick={() => { setActiveTab('journal'); setJournalNote(`Menggunakan aktivitas AI: ${item.title}`); }} className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700">
                        + Gunakan Aktivitas Ini di Jurnal
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
                    <Bot className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm font-medium">Klik "Hasilkan Rekomendasi AI" untuk membuat alternatif skenario pembelajaran kontekstual.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN PANEL VIEW */}
        {userRole === 'ADMIN' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Panel Admin Sekolah — KELAS+</h1>
                <p className="text-xs text-slate-500 mt-1">Kelola data induk siswa, guru, dan rombel kelas secara terpusat</p>
              </div>
            </div>

            {/* Add Student Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-800" /> Tambah Data Siswa Baru
              </h2>
              <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Nama Lengkap Siswa"
                  value={newStudent.name}
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="NISN / NIS"
                  value={newStudent.nisn}
                  onChange={e => setNewStudent({...newStudent, nisn: e.target.value})}
                  className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newStudent.class}
                  onChange={e => setNewStudent({...newStudent, class: e.target.value})}
                  className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="VII A">Kelas VII A</option>
                  <option value="VII B">Kelas VII B</option>
                  <option value="VIII A">Kelas VIII A</option>
                </select>
                <button type="submit" className="py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-sm transition">
                  + Simpan Siswa
                </button>
              </form>
            </div>

            {/* Student Database Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-800">Daftar Induk Siswa Terdaftar ({students.length})</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari nama/NISN..."
                      value={studentSearch}
                      onChange={e => setStudentSearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Nama Siswa</th>
                      <th className="p-3">NISN</th>
                      <th className="p-3">Kelas</th>
                      <th className="p-3">Gender</th>
                      <th className="p-3">Kehadiran</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase())).map(std => (
                      <tr key={std.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">{std.name}</td>
                        <td className="p-3 font-mono text-slate-500">{std.nisn}</td>
                        <td className="p-3 font-bold text-blue-800">{std.class}</td>
                        <td className="p-3">{std.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                        <td className="p-3 font-bold text-emerald-600">{std.attendanceRate}%</td>
                        <td className="p-3 text-right">
                          <button className="p-1 text-slate-400 hover:text-blue-600"><Edit3 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
