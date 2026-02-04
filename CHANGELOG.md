# Changelog

All notable changes to SIAKAD SMK project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-05

### Added
- **QR Code System** 🔲
  - QR Code generator for each student with complete data
  - Student QR page with print and download functionality
  - QR Scanner using @zxing/browser library
  - Animated scanning line (top-to-bottom movement)
  - Real-time camera scanning with visual feedback
  - Corner markers and scanning overlay
  - Success/error animations

- **Attendance System** 📋
  - Online attendance page with QR scanner (`/dashboard/attendance/scan`)
  - Real-time clock display (updates every second)
  - Date display in Indonesian format
  - Recent attendance list (last 10 scans)
  - Auto-record attendance with timestamp
  - Daily attendance page (`/dashboard/attendance/daily`)
  - Interactive status buttons (Hadir, Sakit, Izin, Alpa)
  - Real-time statistics (Total, Hadir, Sakit, Izin, Alpa, Belum Absen)
  - Auto-refresh every 10 seconds
  - Date selector for viewing past attendance

- **Master Data Management** 📊
  - Program Keahlian (Majors) - Full CRUD
  - Kelas & Wali Kelas (Classes) - Full CRUD with major relation
  - Mata Pelajaran (Subjects) - Full CRUD with type filter
  - Ruangan & Lab (Rooms) - Full CRUD with color-coded types
  - Tahun Akademik (Academic Years) - Full CRUD with active status

- **Student Management** 👥
  - Multi-tab form (Personal, Academic, Family, Supporting data)
  - Excel import functionality
  - Document validation
  - Student directory
  - Mutation history

- **Performance Optimizations** ⚡
  - React hooks (useCallback, useMemo) for preventing re-renders
  - In-memory caching with TTL (3-5 seconds)
  - Turbopack for faster dev server and HMR
  - Tree-shaking for Lucide React icons
  - Dynamic imports for ZXing library
  - Image optimization (WebP, AVIF)
  - Console removal in production builds

- **Database**
  - JSON-based file storage
  - 7 database files (students, majors, classes, subjects, rooms, academic-years, attendance)
  - CRUD operations with caching
  - Server actions for data mutations

### Fixed
- **Hydration Errors**
  - Fixed clock display hydration mismatch with `suppressHydrationWarning`
  - Fixed date display hydration mismatch
  - Fixed last update timestamp hydration error

- **ZXing Scanner Issues**
  - Fixed `listVideoInputDevices is not a function` by using `navigator.mediaDevices.enumerateDevices()`
  - Fixed `reset is not a function` by properly stopping MediaStream tracks
  - Fixed null reference error with proper null checks for `videoRef.current`

- **Next.js 15+ Compatibility**
  - Fixed params Promise handling in dynamic routes
  - Updated all dynamic route pages to await params

### Changed
- Migrated from `html5-qrcode` to `@zxing/browser` for better performance
- Updated scanning UI with animated line instead of static pulse
- Improved error handling in QR scanner component
- Enhanced visual feedback for scanning process

### Dependencies
- Added `qrcode` and `@types/qrcode` for QR generation
- Added `@zxing/browser` and `@zxing/library` for QR scanning
- Removed `html5-qrcode` (replaced with ZXing)
- Using Next.js 16.1.6 with Turbopack
- TypeScript 5.x
- Tailwind CSS
- Lucide React for icons

### Documentation
- Comprehensive README.md with all features
- Installation and usage instructions
- QR Scanner usage guide
- Tech stack documentation
- Performance optimization details
- Known issues and fixes

---

## [0.1.0] - 2026-02-04

### Added
- Initial project setup with Next.js 16
- Basic dashboard layout
- Sidebar navigation
- Student management foundation
- Master data scaffolding

---

**Legend:**
- 🔲 QR Code features
- 📋 Attendance features
- 📊 Master Data features
- 👥 Student Management features
- ⚡ Performance improvements
- 🐛 Bug fixes
