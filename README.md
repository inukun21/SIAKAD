# 🎓 SIAKAD SMK - Sistem Informasi Akademik SMK

Sistem Informasi Akademik berbasis web untuk Sekolah Menengah Kejuruan (SMK) yang dibangun dengan **Next.js 16**, **TypeScript**, dan **Tailwind CSS**.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/inukun21/SIAKAD)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/inukun21/SIAKAD)
[![License](https://img.shields.io/badge/license-Educational-orange.svg)](https://github.com/inukun21/SIAKAD)

📋 **[View Changelog](CHANGELOG.md)** | 🚀 **[Live Demo](#)** | 📖 **[Documentation](#)**

---

## ✨ Fitur Utama

### 📊 **Dashboard & Analytics**
- Overview statistik sekolah real-time
- Grafik dan visualisasi data
- Quick actions untuk akses cepat

### 👥 **Manajemen Siswa**
- ✅ CRUD lengkap data siswa
- ✅ Multi-tab form (Data Pribadi, Akademik, Keluarga, Pendukung)
- ✅ Import data dari Excel
- ✅ Validasi dokumen
- ✅ **QR Code Generator** - Setiap siswa memiliki QR code unik
- ✅ Riwayat mutasi siswa
- ✅ Direktori siswa

### 🎯 **Master Data Management**
Semua dengan CRUD lengkap:
- ✅ **Program Keahlian** (Majors) - RPL, TKJ, DKV, AK, OTKP
- ✅ **Kelas & Wali Kelas** - Relasi dengan jurusan
- ✅ **Mata Pelajaran** - Umum & Produktif
- ✅ **Ruangan & Lab** - Kelas, Lab, Bengkel
- ✅ **Tahun Akademik** - Ganjil/Genap dengan status aktif

### 📱 **Sistem Absensi Real-time**

#### **QR Scanner (ZXing)** 🔲
- **Library**: @zxing/browser dengan BrowserMultiFormatReader
- **Real-time camera scanning**
- **Auto-detect QR codes**
- **Animated scanning line** - Garis biru bergerak atas-bawah
- **Visual feedback** - Corner markers, success animation
- **Auto-record** - Waktu tercatat otomatis saat scan
- **Recent attendance list** - 10 absensi terakhir
- **Access**: `/dashboard/attendance/scan`

#### **Presensi Harian** 📅
- Date selector untuk pilih tanggal
- **Real-time statistics** - Total, Hadir, Sakit, Izin, Alpa, Belum Absen
- Interactive table dengan tombol status
- **Auto-refresh** setiap 10 detik
- Data dari QR scan langsung muncul
- **Access**: `/dashboard/attendance/daily`

#### **Presensi Lainnya**
- Presensi Praktik
- Monitoring PKL
- Rekap Kehadiran

### 📝 **Evaluasi & Nilai**
- Nilai Teori
- Nilai Praktik
- Nilai PKL
- UKK (Uji Kompetensi Keahlian)
- Rapor Digital

### 🏢 **Hubungan Industri (DUDI)**
- Data Mitra DUDI
- Penempatan PKL
- Jurnal PKL

### 📦 **Manajemen Inventaris**
- Data Inventaris
- Peminjaman Barang
- Barang Habis Pakai

### 👨‍🏫 **Personalia**
- Data Guru
- Data Instruktur

### ⚙️ **Pengaturan & Sistem**
- User Management (RBAC)
- Activity Logs
- Backup & Restore

## 🚀 Teknologi & Optimasi

### **Tech Stack**
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **QR Generation**: qrcode
- **QR Scanning**: @zxing/browser, @zxing/library
- **Excel**: xlsx
- **Database**: JSON files (File-based)

### **Performance Optimizations** ⚡
- ✅ **React Hooks**: useCallback, useMemo untuk prevent re-renders
- ✅ **In-memory Caching**: TTL 3-5 detik untuk reduce I/O
- ✅ **Turbopack**: Fast dev server & HMR
- ✅ **Tree-shaking**: Modular imports untuk Lucide icons
- ✅ **Dynamic Imports**: ZXing loaded on-demand
- ✅ **Image Optimization**: WebP, AVIF support
- ✅ **Console Removal**: Production builds tanpa console logs

### **Code Quality**
- ✅ TypeScript strict mode
- ✅ ESLint configuration
- ✅ Component-based architecture
- ✅ Server Actions untuk data mutations
- ✅ Proper error handling
- ✅ Accessibility improvements (aria-labels, htmlFor)

## 📁 Struktur Database

```
data/
├── students.json          # Data siswa
├── majors.json           # Program keahlian
├── classes.json          # Kelas & wali kelas
├── subjects.json         # Mata pelajaran
├── rooms.json            # Ruangan & lab
├── academic-years.json   # Tahun akademik
└── attendance.json       # Data absensi
```

## 🛠️ Instalasi & Penggunaan

### **Prerequisites**
- Node.js 18+ 
- npm atau yarn

### **Installation**

```bash
# Clone repository
git clone https://github.com/inukun21/SIAKAD.git
cd SIAKAD

# Install dependencies
npm install

# Run development server (dengan Turbopack)
npm run dev

# Build untuk production
npm run build

# Start production server
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📱 Cara Menggunakan QR Scanner

### **Generate QR Code Siswa:**
1. Buka `/dashboard/students`
2. Klik tombol **"Lihat QR"** pada siswa yang diinginkan
3. QR Code akan ditampilkan dengan data lengkap siswa
4. Klik **Print** untuk mencetak atau **Download** untuk save sebagai PNG

### **Scan QR untuk Absensi:**
1. Buka `/dashboard/attendance/scan`
2. Izinkan akses kamera
3. Arahkan kamera ke QR Code siswa
4. Tunggu garis biru scanning bergerak
5. QR Code akan terdeteksi otomatis
6. Absensi tercatat dengan waktu real-time
7. Data langsung muncul di `/dashboard/attendance/daily`

## 🎨 Fitur UI/UX

- ✅ **Responsive Design** - Mobile, tablet, desktop
- ✅ **Modern UI** - Clean & professional
- ✅ **Color-coded Status** - Visual feedback jelas
- ✅ **Loading States** - Spinner & skeleton screens
- ✅ **Toast Notifications** - Success/error messages
- ✅ **Modal Dialogs** - Form input yang user-friendly
- ✅ **Animated Scanner** - Garis scanning bergerak
- ✅ **Real-time Updates** - Auto-refresh data
- ✅ **Accessibility** - ARIA labels & keyboard navigation

## 📊 Status Proyek

### **Completed Features** ✅
- [x] Dashboard & Analytics
- [x] Student Management (Full CRUD)
- [x] Master Data (5 modules)
- [x] QR Code System (Generate & Scan)
- [x] Daily Attendance (Real-time)
- [x] Performance Optimizations
- [x] GitHub Integration

### **In Progress** 🚧
- [ ] Grading System
- [ ] Industrial Relations
- [ ] Inventory Management
- [ ] User Management & RBAC

### **Planned** 📋
- [ ] Reports & Analytics
- [ ] Email Notifications
- [ ] Mobile App (React Native)
- [ ] API Documentation

## 🐛 Known Issues & Fixes

### **Fixed Issues** ✅
- ✅ Hydration errors on clock displays (added suppressHydrationWarning)
- ✅ ZXing listVideoInputDevices error (using navigator.mediaDevices)
- ✅ Scanner cleanup error (proper MediaStream handling)
- ✅ Next.js 15+ params Promise handling

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Project ini dibuat untuk keperluan pendidikan dan pengembangan sistem informasi sekolah.

## 👨‍💻 Developer

Dikembangkan dengan ❤️ untuk SMK

---

**Last Updated**: 2026-02-05  
**Version**: 1.0.0  
**Build Status**: ✅ Passing
