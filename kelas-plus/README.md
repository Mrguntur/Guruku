# KELAS+ — Sistem Manajemen Kelas, Pembelajaran, dan Administrasi Guru SMP

> **Tagline:** Kurangi Administrasi. Pahami Kelas. Tingkatkan Pembelajaran.

KELAS+ dirancang dengan prinsip **SEKALI INPUT → BANYAK MANFAAT** untuk mengurangi beban administrasi guru SMP di Indonesia hingga 60%.

---

## 🚀 Fitur Utama
1. **Absensi Cepat (1-Klik)** — Penandaan massal "Tandai Semua Hadir" dan perhitungan persentase otomatis.
2. **Classroom Pulse & Smart Journal** — Evaluasi dinamika kelas berbasis emotikon dan indikator yang langsung menghasilkan draf jurnal mengajar otomatis.
3. **Student Learning Map & Early Warning ⚠️** — Deteksi dini siswa yang membutuhkan pendampingan tanpa label negatif.
4. **AI Teaching Assistant** — Rekomendasi aktivitas pembelajaran kontekstual untuk seluruh mata pelajaran SMP (termasuk P5 & Muatan Lokal) dalam kondisi online maupun offline.
5. **Next Lesson Recommendation** — Rekomendasi apersepsi dan rencana pertemuan berikutnya berbasis refleksi kelas.
6. **Admin Dashboard & Import Data Siswa** — Pengelolaan data master sekolah, kelas, siswa, dan guru secara terpusat.
7. **Analytics Dampak Penggunaan** — Grafik penghematan waktu administrasi harian guru.

---

## 🛠️ Cara Menjalankan Project di Komputer Lokal

### Persyaratan
- **Node.js** (Versi 18 atau lebih baru)
- **npm** (Bawaan Node.js)

### Langkah-Langkah:
1. Ekstrak file `kelas-plus-app.zip`.
2. Buka Terminal / Command Prompt di folder hasil ekstrak:
   ```bash
   cd kelas-plus
   ```
3. Install seluruh paket dependensi:
   ```bash
   npm install
   ```
4. Jalankan aplikasi web versi lokal:
   ```bash
   npm run dev
   ```
5. Buka link yang muncul di terminal (biasanya `http://localhost:5173`) pada browser Anda.

---

## 🌐 Cara Hosting Online (Deployment Gratis)

### Opsi A: Vercel (Rekomendasi)
1. Install Vercel CLI: `npm install -g vercel`
2. Jalankan perintah `vercel` di folder project dan ikuti petunjuk layar.

### Opsi B: Netlify
1. Jalankan `npm run build`.
2. Upload/drag & drop folder `dist` yang dihasilkan ke [app.netlify.com/drop](https://app.netlify.com/drop).
