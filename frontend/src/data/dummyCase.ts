import type { Case } from '../types/case'

export const dummyCases: Case[] = [
  {
    id: 'case-001',
    caseNumber: 'Case #001',
    title: 'The Missing Evidence',
    description: 'Sebuah sampel penelitian penting dilaporkan hilang dari laboratorium riset pada pukul 22:15 malam. Sistem brankas dibuka secara paksa dan CCTV utama mendadak dinonaktifkan.',
    difficulty: 'Medium',
    location: 'Research Laboratory & Forensic Storage',
    time: '22:15 WIB',
    objective: 'Telusuri TKP laboratorium, koridor, dan ruang arsip penyimpanan untuk menemukan bukti-bukti kunci, mengidentifikasi tersangka utama, dan menyusun kesimpulan investigasi.',
    initialInfo: 'Penjaga gedung melapor bahwa lampu lab sempat padam selama 5 menit sekitar pukul 22:10. Tidak ada tanda kerusakan pada pintu luar gedung.',
    status: 'Available',
    coverImage: '/panoramas/laboratory.jpg',
    initialSceneId: 'laboratory',
    scenes: [
      {
        id: 'laboratory',
        name: 'Laboratory (TKP Utama)',
        description: 'Ruang kerja penelitian tempat sampel utama disimpan dan diamati.',
        panoramaPath: '/panoramas/laboratory.jpg',
        orderIndex: 1,
        hotspots: [
          {
            id: 'hs-laptop',
            type: 'evidence',
            name: 'Laptop Menyala',
            description: 'Laptop di atas meja kerja masih menyala dengan dokumen rahasia terbuka.',
            yaw: '40deg',
            pitch: '-8deg',
            evidenceId: 'ev-laptop'
          },
          {
            id: 'hs-cctv',
            type: 'evidence',
            name: 'Kamera Pengawas CCTV',
            description: 'Kamera di sudut dinding tampak mati dan lampu indikatornya padam.',
            yaw: '135deg',
            pitch: '10deg',
            evidenceId: 'ev-cctv'
          },
          {
            id: 'hs-access-card',
            type: 'evidence',
            name: 'Kartu Akses Master',
            description: 'Kartu identitas pegawai terjatuh di bawah laci meja berkas.',
            yaw: '-40deg',
            pitch: '-22deg',
            evidenceId: 'ev-access-card'
          },
          {
            id: 'hs-door-to-corridor',
            type: 'navigation',
            name: 'Pintu Koridor',
            description: 'Pintu keluar menuju lorong koridor laboratorium.',
            yaw: '-155deg',
            pitch: '-3deg',
            targetSceneId: 'corridor'
          }
        ]
      },
      {
        id: 'corridor',
        name: 'Corridor (Lorong Gedung)',
        description: 'Lorong penghubung antar laboratorium dan ruang penyimpanan barang bukti.',
        panoramaPath: '/panoramas/corridor.jpg',
        orderIndex: 2,
        hotspots: [
          {
            id: 'hs-footprint',
            type: 'evidence',
            name: 'Jejak Sepatu Basah',
            description: 'Terdapat bekas jejak lumpur basah berukuran sepatu boot pria nomor 42.',
            yaw: '55deg',
            pitch: '-26deg',
            evidenceId: 'ev-footprint'
          },
          {
            id: 'hs-door-to-lab',
            type: 'navigation',
            name: 'Masuk Laboratorium',
            description: 'Pintu menuju ruang laboratorium penelitian.',
            yaw: '-95deg',
            pitch: '-2deg',
            targetSceneId: 'laboratory'
          },
          {
            id: 'hs-door-to-storage',
            type: 'navigation',
            name: 'Ruang Penyimpanan (Storage)',
            description: 'Pintu besi menuju ruang arsip dan brankas penyimpanan barang bukti.',
            yaw: '95deg',
            pitch: '-2deg',
            targetSceneId: 'storage-room'
          }
        ]
      },
      {
        id: 'storage-room',
        name: 'Storage Room (Ruang Penyimpanan)',
        description: 'Ruang arsip dokumen dan brankas tempat penyimpanan bukti kasus lama.',
        panoramaPath: '/panoramas/storage-room.jpg',
        orderIndex: 3,
        hotspots: [
          {
            id: 'hs-document',
            type: 'evidence',
            name: 'Buku Log Berkas',
            description: 'Buku catatan serah terima kunci brankas dengan tanda tangan mencurigakan.',
            yaw: '-65deg',
            pitch: '-18deg',
            evidenceId: 'ev-document'
          },
          {
            id: 'hs-door-to-corridor-from-storage',
            type: 'navigation',
            name: 'Kembali ke Koridor',
            description: 'Pintu keluar kembali ke lorong koridor gedung.',
            yaw: '175deg',
            pitch: '-2deg',
            targetSceneId: 'corridor'
          }
        ]
      }
    ],
    evidences: [
      {
        id: 'ev-laptop',
        name: 'Laptop Korban',
        description: 'Laptop ditemukan dalam keadaan menyala. Ada file log akses brankas yang diunduh pada pukul 22:07.',
        detailedAnalysis: 'Analisis forensik digital menunjukkan upaya menghapus rekaman riwayat akses 8 menit sebelum pemadaman listrik.',
        discoveredSceneId: 'laboratory',
        discoveredSceneName: 'Laboratory (TKP Utama)',
        importance: 'Critical',
        relatedSuspectIds: ['suspect-andi'],
        relatedEvidenceIds: ['ev-access-card']
      },
      {
        id: 'ev-cctv',
        name: 'Kabel Kamera CCTV',
        description: 'Kabel daya CCTV di sudut laboratorium dipotong rapi dengan tang pemotong listrik presisi.',
        detailedAnalysis: 'Potongan kabel sangat rapi, mengindikasikan pelaku paham tata letak instalasi kabel gedung.',
        discoveredSceneId: 'laboratory',
        discoveredSceneName: 'Laboratory (TKP Utama)',
        importance: 'Supporting',
        relatedSuspectIds: ['suspect-budi']
      },
      {
        id: 'ev-access-card',
        name: 'Kartu Akses Master #088',
        description: 'Kartu akses berkode ID 088 atas nama asisten lab ditemukan tertinggal dekat brankas.',
        detailedAnalysis: 'Terdapat sidik jari yang cocok dengan pemegang kartu, membuktikan kartu digunakan secara fisik pada jam kejadian.',
        discoveredSceneId: 'laboratory',
        discoveredSceneName: 'Laboratory (TKP Utama)',
        importance: 'Critical',
        relatedSuspectIds: ['suspect-andi']
      },
      {
        id: 'ev-footprint',
        name: 'Jejak Sepatu Basah',
        description: 'Jejak lumpur dari sepatu boot ukuran 42 mengarah tergesa-gesa dari lab menuju ruang arsip.',
        detailedAnalysis: 'Bahan sol sepatu identik dengan sepatu dinas petugas teknis atau petugas keamanan.',
        discoveredSceneId: 'corridor',
        discoveredSceneName: 'Corridor (Lorong Gedung)',
        importance: 'Supporting',
        relatedSuspectIds: ['suspect-budi', 'suspect-andi']
      },
      {
        id: 'ev-document',
        name: 'Buku Log Berkas Brankas',
        description: 'Catatan serah terima spesimen menunjukkan brankas dibuka pada pukul 22:12 dengan tanda tangan palsu.',
        detailedAnalysis: 'Tinta tanda tangan masih baru dan coretan tangan tidak sesuai dengan tanda tangan kepala riset.',
        discoveredSceneId: 'storage-room',
        discoveredSceneName: 'Storage Room (Ruang Penyimpanan)',
        importance: 'Critical',
        relatedSuspectIds: ['suspect-andi', 'suspect-citra']
      }
    ],
    suspects: [
      {
        id: 'suspect-andi',
        name: 'Andi Saputra',
        role: 'Asisten Laboratorium',
        description: 'Memiliki akses langsung ke komputer riset dan mengetahui kode kombinasi awal brankas.',
        alibi: 'Mengaku sudah meninggalkan gedung jam 21:00, namun kartu aksesnya terbukti aktif pukul 22:05.',
        accessLevel: 'Laboratorium & Ruang Komputer',
        relatedEvidenceIds: ['ev-laptop', 'ev-access-card', 'ev-document']
      },
      {
        id: 'suspect-budi',
        name: 'Budi Santoso',
        role: 'Petugas Keamanan Malam',
        description: 'Bertanggung jawab atas pengawasan CCTV dan kunci cadangan lorong koridor.',
        alibi: 'Mengklaim sedang mengecek gerbang utama saat listrik padam, tidak berada di dekat koridor lab.',
        accessLevel: 'Seluruh Gedung',
        relatedEvidenceIds: ['ev-cctv', 'ev-footprint']
      },
      {
        id: 'suspect-citra',
        name: 'Dr. Citra Lestari',
        role: 'Peneliti Utama (Lead Researcher)',
        description: 'Pemilik lisensi utama sampel yang hilang. Memiliki kepentingan klaim asuransi riset.',
        alibi: 'Bekerja lembur di ruang kantor lantai 3 hingga larut malam.',
        accessLevel: 'Laboratorium & Ruang Penyimpanan',
        relatedEvidenceIds: ['ev-document']
      }
    ],
    solution: {
      correctSuspectId: 'suspect-andi',
      keyEvidenceIds: ['ev-laptop', 'ev-access-card', 'ev-document'],
      explanationKeywords: ['andi', 'laptop', 'akses', 'kartu', 'brankas', 'log']
    }
  }
]
