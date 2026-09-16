# Crime Investigation — Panorama 360° Web Game

Aplikasi web game investigasi kasus kriminal (*Crime Investigation*) berbasis panorama 360° equirectangular seperti Google Street View. Pemain dapat menelusuri lokasi kejadian perkara (TKP), memeriksa barang bukti melalui hotspot interaktif, berpindah ruangan secara dinamis, menginterogasi tersangka, dan merumuskan kesimpulan kasus kriminal.

Selain sisi pemain, aplikasi dilengkapi dengan **Admin & Lecturer Portal** untuk membuat skenario kasus baru, mengatur adegan ruangan (scene), serta menentukan koordinat hotspot 360° secara interaktif (*click-to-pick* derajat yaw dan pitch).

---

## 📁 Struktur Project Monorepo

```
testpanorama/ (crime-investigation)
├── frontend/
│   ├── public/
│   │   └── panoramas/
│   │       ├── laboratory.jpg       # Panorama TKP Laboratorium
│   │       ├── corridor.jpg         # Panorama Lorong Gedung
│   │       └── storage-room.jpg     # Panorama Ruang Penyimpanan
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── panorama/
│   │   │   │   └── PanoramaViewer.vue  # Viewer 360° + MarkersPlugin + Editor Mode
│   │   │   ├── evidence/
│   │   │   │   ├── EvidenceModal.vue   # Modal temuan bukti interaktif
│   │   │   │   └── EvidenceCard.vue    # Kartu barang bukti
│   │   │   ├── suspect/
│   │   │   │   └── SuspectCard.vue     # Kartu alibi & profil tersangka
│   │   │   └── ui/
│   │   │       └── TimerBadge.vue      # Timer stopwatch realtime
│   │   │
│   │   ├── views/
│   │   │   ├── HomeView.vue            # Halaman utama daftar kasus
│   │   │   ├── CaseBriefView.vue       # Berkas briefing kasus
│   │   │   ├── InvestigationView.vue   # Halaman utama investigasi 360°
│   │   │   ├── EvidenceView.vue        # Papan bukti (Evidence Board)
│   │   │   ├── SuspectView.vue         # Papan tersangka (Suspects Board)
│   │   │   ├── ConclusionView.vue      # Form kesimpulan akhir
│   │   │   ├── ResultView.vue          # Skor & evaluasi investigasi
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── AdminDashboardView.vue  # Dashboard ringkasan dosen/admin
│   │   │       ├── CaseManagementView.vue  # Manajemen daftar kasus (CRUD & Publish)
│   │   │       ├── CaseEditorView.vue      # Editor skenario kasus & penilaian
│   │   │       └── SceneEditorView.vue     # Interactive 360° Scene & Hotspot Editor
│   │   │
│   │   ├── stores/
│   │   │   ├── caseStore.ts            # State kasus, adegan aktif, & localStorage sync
│   │   │   ├── investigationStore.ts   # State timer, bukti terkumpul, & skor
│   │   │   └── userStore.ts            # State profil pengguna & role
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts                  # HTTP client layer
│   │   │   ├── caseService.ts          # Layanan REST API kasus & fallback
│   │   │   └── evidenceService.ts      # Layanan bukti
│   │   │
│   │   ├── types/                      # Interface data TypeScript (case, scene, evidence, suspect)
│   │   ├── data/
│   │   │   └── dummyCase.ts            # Data kasus #001 & koordinat hotspot default
│   │   ├── router/index.ts             # Routing halaman game & portal admin
│   │   ├── App.vue
│   │   ├── main.ts
│   │   └── style.css
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── cases.py            # Endpoint CRUD /api/cases
│   │   │   ├── scenes.py           # Endpoint CRUD /api/scenes & /api/hotspots
│   │   │   ├── evidences.py        # Endpoint /api/cases/<id>/evidences
│   │   │   ├── suspects.py         # Endpoint /api/cases/<id>/suspects
│   │   │   ├── investigations.py   # Endpoint sesi investigasi & kesimpulan
│   │   │   └── auth.py             # Endpoint autentikasi & profile
│   │   │
│   │   ├── models/                 # Model relasional kasus, ruangan, bukti, tersangka, user
│   │   ├── config.py
│   │   └── __init__.py             # Factory app Flask + CORS
│   │
│   ├── run.py
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 Cara Menjalankan

### 1. Frontend (Vue 3 + Vite + TypeScript)

Masuk ke folder `frontend`:
```bash
cd frontend
npm install
npm run dev
```

Buka browser di:
`http://127.0.0.1:5173/`

### 2. Backend (Flask REST API)

Masuk ke folder `backend`:
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Backend REST API berjalan di:
`http://127.0.0.1:5000/`

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

