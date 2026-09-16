# Crime Investigation — Panorama 360° Web Game (Prototype)

Aplikasi web game investigasi kasus kriminal (*Crime Investigation*) berbasis panorama 360° equirectangular seperti Google Street View. Pemain dapat menelusuri lokasi kejadian perkara (TKP), memeriksa barang bukti melalui hotspot interaktif, berpindah ruangan secara dinamis, menginterogasi tersangka, menyalakan senter UV forensik, menghindari bukti pengalih (*decoy*), dan merumuskan kesimpulan kasus kriminal.

Project ini dibuat secara **modular, ringan, dan mandiri (Local-First)** untuk menguji batas ide dan mengeksplorasi rancangan konsep (*Proof of Concept*) sebelum implementasi skala produksi.

---

## 🌟 Fitur Utama Prototype

1. **Eksplorasi 360° Realistis**: Navigasi panorama equirectangular menggunakan Photo Sphere Viewer, drag mouse, zoom, dan perpindahan antar ruangan secara mulus tanpa reload halaman.
2. **Senter UV Forensik**: Toggle blacklight UV yang meredupkan cahaya dan mengungkap sidik jari laten serta pendaran residu kimia tersembunyi.
3. **Chained / Locked Evidence**: Teka-teki berantai di mana objek tertentu (seperti brankas arsip) terproteksi dan membutuhkan barang bukti kunci otorisasi untuk dapat dibuka.
4. **Sistem Decoy (Red Herrings)**: Barang bukti pengalih yang sangat menggoda dan mengarah ke tersangka lain, menguji ketajaman mahasiswa dengan penalti skor jika keliru memilih bukti.
5. **Sidang Kesimpulan & Rekonstruksi**: Penentuan tersangka, pemilihan modus operandi operasional, serta evaluasi analisis kronologis.
6. **Portal Dosen & Interactive 360° Hotspot Editor**: Klik langsung sembarang titik pada panorama 360° untuk menangkap koordinat `yaw` dan `pitch` secara otomatis guna menambahkan barang bukti, pintu navigasi, ataupun decoy.

---

## 📁 Struktur Folder Project

```
testpanorama/
├── frontend/
│   ├── public/
│   │   └── panoramas/
│   │       ├── laboratory.jpg          # Panorama TKP Laboratorium
│   │       ├── corridor.jpg            # Panorama Lorong Gedung
│   │       └── storage-room.jpg        # Panorama Ruang Arsip & Brankas
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── panorama/
│   │   │   │   └── PanoramaViewer.vue  # Viewer 360° + Markers + Mode Senter UV
│   │   │   ├── evidence/
│   │   │   │   ├── EvidenceModal.vue   # Modal temuan bukti interaktif (netral)
│   │   │   │   └── EvidenceCard.vue    # Kartu barang bukti
│   │   │   ├── suspect/
│   │   │   │   └── SuspectCard.vue     # Kartu alibi & profil tersangka
│   │   │   └── ui/
│   │   │       └── TimerBadge.vue      # Timer stopwatch realtime
│   │   │
│   │   ├── views/
│   │   │   ├── HomeView.vue            # Halaman utama daftar kasus
│   │   │   ├── CaseBriefView.vue       # Berkas briefing kasus
│   │   │   ├── InvestigationView.vue   # Halaman investigasi 360° + Senter UV
│   │   │   ├── EvidenceView.vue        # Papan bukti (Evidence Board)
│   │   │   ├── SuspectView.vue         # Papan tersangka (Suspects Board)
│   │   │   ├── ConclusionView.vue      # Form kesimpulan akhir & Modus Operandi
│   │   │   ├── ResultView.vue          # Skor & evaluasi debrief forensik
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── AdminDashboardView.vue  # Ringkasan analitik kasus
│   │   │       ├── CaseManagementView.vue  # Manajemen skenario kasus (CRUD)
│   │   │       ├── CaseEditorView.vue      # Editor skenario kasus
│   │   │       └── SceneEditorView.vue     # Interactive 360° Hotspot Editor
│   │   │
│   │   ├── stores/
│   │   │   ├── caseStore.ts            # State kasus & localStorage sync
│   │   │   ├── investigationStore.ts   # State bukti, timer, & penilaian
│   │   │   └── userStore.ts            # State pengguna
│   │   │
│   │   ├── types/                      # TypeScript interfaces
│   │   ├── data/
│   │   │   └── dummyCase.ts            # Kasus default #001 lengkap dengan decoy & UV
│   │   ├── router/index.ts             # Routing Vue Router
│   │   ├── App.vue
│   │   ├── main.ts
│   │   └── style.css
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── package.json                        # Root helper runner
└── README.md
```

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi murni menggunakan Node.js dan Vite, tanpa dependensi server Python eksternal:

```bash
# 1. Masuk ke root directory
cd testpanorama

# 2. Install dependensi
npm --prefix frontend install

# 3. Jalankan aplikasi (Dev Server)
npm run dev
```

Buka peramban di:
**`http://127.0.0.1:5173/`**

---

## 🎮 Alur Gameplay Pemain

1. **Home (`/`)**: Memilih kasus yang tersedia (Case #001 — The Missing Evidence).
2. **Case Brief (`/cases/:id`)**: Membaca ringkasan insiden, waktu, lokasi, alibi saksi, dan target objektif.
3. **Investigation 360° (`/cases/:id/investigate`)**:
   - Memutar kamera 360° ke segala arah dan zoom in/out.
   - Klik hotspot **🔎 Laptop**, **🔎 CCTV**, dll untuk membuka modal detail bukti dan menyimpannya.
   - Klik hotspot **🚪 Pintu** untuk berpindah antar ruangan (Laboratory ↔ Corridor ↔ Storage Room) secara instan tanpa reload.
   - Tulis catatan investigasi di tab *Catatan*.
4. **Evidence Board (`/cases/:id/evidence`)**: Menginspeksi barang bukti yang telah dikumpulkan.
5. **Suspect Board (`/cases/:id/suspects`)**: Mempelajari alibi dan hak akses dari para tersangka.
6. **Conclusion (`/cases/:id/conclusion`)**: Memilih tersangka utama, menulis kronologi kejadian, dan memilih bukti pendukung.
7. **Result (`/cases/:id/result`)**: Mendapatkan skor evaluasi investigasi (0–100), akurasi kesimpulan, dan rekapitulasi waktu penyidikan.

---

## ⚙️ Portal Admin & Dosen

1. **Dashboard Admin (`/admin`)**: Ringkasan jumlah kasus, scene 360°, bukti, dan tersangka terdaftar.
2. **Manajemen Kasus (`/admin/cases`)**: Daftar skenario kasus dengan filter, status publikasi (*Draft* / *Published*), tombol edit, hapus, dan reset.
3. **Case Editor (`/admin/cases/create` & `/admin/cases/:id/edit`)**: Mengonfigurasi informasi dasar, TKP, tingkat kesulitan, target objektif, dan kata kunci kesimpulan kasus.
4. **Interactive 360° Hotspot Editor (`/admin/cases/:id/scenes`)**:
   - Membuka ruangan 360° dalam mode editor.
   - Mengarahkan kamera dan **mengklik posisi sembarang pada panorama** untuk secara otomatis menangkap koordinat `yaw` dan `pitch`.
   - Menentukan tipe hotspot: *Evidence*, *Navigation* (pindah ruangan), *Information*, atau *Secret*.
   - Menyimpan hotspot secara instan dan langsung teruji di TKP virtual.

