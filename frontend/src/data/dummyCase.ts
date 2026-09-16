import type { Case } from '../types/case'

export const dummyCases: Case[] = [
  {
    id: 'case-001',
    caseNumber: 'Case #001',
    title: 'The Missing Evidence',
    description: 'Sebuah sampel penelitian bernilai tinggi dilaporkan hilang dari brankas laboratorium riset. Alarm sensor brankas berbunyi pada pukul 22:15 WIB. Listrik gedung sempat padam mendadak selama 5 menit sebelum insiden.',
    difficulty: 'Medium',
    location: 'Research Laboratory & Forensic Storage',
    time: '22:15 WIB',
    objective: 'Temukan bukti-bukti otentik di TKP, bedakan fakta forensik dari petunjuk palsu, pecahkan kode akses brankas, dan ungkap pelaku sebenarnya.',
    initialInfo: 'Penjaga gedung melapor lampu lab padam pukul 22:10. Tidak ada kerusakan fisik pada pintu luar gedung. Hujan lebat baru mulai mengguyur area sekitar pada pukul 22:08.',
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
            name: 'Perangkat Komputer',
            description: 'Komputer meja di ruang penelitian dengan layar monitor yang masih aktif.',
            yaw: '40deg',
            pitch: '-8deg',
            evidenceId: 'ev-laptop'
          },
          {
            id: 'hs-cctv',
            type: 'evidence',
            name: 'Instalasi Kabel Sudut',
            description: 'Sambungan kabel kelistrikan dan pengawasan di sudut langit-langit ruangan.',
            yaw: '135deg',
            pitch: '10deg',
            evidenceId: 'ev-cctv'
          },
          {
            id: 'hs-access-card',
            type: 'evidence',
            name: 'Objek di Bawah Laci',
            description: 'Benda plastik tipis berlogo instansi terjatuh dan terselip di bawah laci berkas.',
            yaw: '-40deg',
            pitch: '-22deg',
            evidenceId: 'ev-access-card'
          },
          {
            id: 'hs-decoy-debt',
            type: 'decoy',
            name: 'Map Dokumen Meja Peneliti',
            description: 'Map arsip keuangan terbuka berisi berkas somasi hutang riset dan tenggat waktu pendanaan.',
            yaw: '15deg',
            pitch: '-18deg',
            evidenceId: 'ev-decoy-debt'
          },
          {
            id: 'hs-door-to-corridor',
            type: 'navigation',
            name: 'Pintu Keluar Lorong',
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
            name: 'Noda di Lantai',
            description: 'Noda kecokelatan basah yang tampak seperti bekas pijakan sol sepatu.',
            yaw: '55deg',
            pitch: '-26deg',
            evidenceId: 'ev-footprint'
          },
          {
            id: 'hs-decoy-glove',
            type: 'decoy',
            name: 'Kisi Ventilasi Udara',
            description: 'Celah ventilasi udara koridor yang sedikit renggang dengan sehelai kain hitam terselip.',
            yaw: '20deg',
            pitch: '-28deg',
            evidenceId: 'ev-decoy-glove'
          },
          {
            id: 'hs-decoy-key',
            type: 'decoy',
            name: 'Benda Dekat Tangga Darurat',
            description: 'Sebuah anak kunci logam dengan gantungan label fisik tergeletak di sudut tangga.',
            yaw: '-45deg',
            pitch: '-26deg',
            evidenceId: 'ev-decoy-key'
          },
          {
            id: 'hs-uv-fingerprint',
            type: 'secret',
            name: 'Pendaran Kimia Gagang Pintu',
            description: 'Residu pendaran fluoresens tak kasat mata yang hanya tampak di bawah sinar ultraviolet.',
            yaw: '-115deg',
            pitch: '-14deg',
            evidenceId: 'ev-uv-fingerprint'
          },
          {
            id: 'hs-door-to-lab',
            type: 'navigation',
            name: 'Pintu Laboratorium',
            description: 'Pintu menuju ruang laboratorium penelitian.',
            yaw: '-95deg',
            pitch: '-2deg',
            targetSceneId: 'laboratory'
          },
          {
            id: 'hs-door-to-storage',
            type: 'navigation',
            name: 'Pintu Besi Storage',
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
            name: 'Brankas Arsip Digital',
            description: 'Perangkat brankas dengan pemindai kartu otorisasi dan buku register pembukaan.',
            yaw: '-65deg',
            pitch: '-18deg',
            evidenceId: 'ev-document',
            requiresEvidenceId: 'ev-access-card'
          },
          {
            id: 'hs-door-to-corridor-from-storage',
            type: 'navigation',
            name: 'Pintu Keluar Koridor',
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
        name: 'Log Forensik Digital Laptop',
        description: 'Layar komputer menampilkan unduhan file terenkripsi pada pukul 22:07 menggunakan kredensial internal.',
        detailedAnalysis: 'Analisis jejak digital menunjukkan adanya upaya penghapusan riwayat aktivitas 3 menit sebelum pemadaman listrik.',
        discoveredSceneId: 'laboratory',
        discoveredSceneName: 'Laboratory (TKP Utama)',
        importance: 'Critical',
        category: 'Digital',
        relatedSuspectIds: ['suspect-andi'],
        relatedEvidenceIds: ['ev-access-card']
      },
      {
        id: 'ev-cctv',
        name: 'Potongan Kabel Sudut 45°',
        description: 'Kabel daya kamera pengawas dipotong rapi dengan tang pemotong listrik tegangan tinggi berisolasi.',
        detailedAnalysis: 'Potongan bersih bersudut 45° membuktikan pelaku memiliki keterampilan teknis kelistrikan dan paham tata kabel gedung.',
        discoveredSceneId: 'laboratory',
        discoveredSceneName: 'Laboratory (TKP Utama)',
        importance: 'Supporting',
        category: 'Fisik',
        relatedSuspectIds: ['suspect-budi']
      },
      {
        id: 'ev-access-card',
        name: 'Kartu Akses Master #088',
        description: 'Kartu RFID master yang diterbitkan khusus untuk staf riset senior dan asisten lab.',
        detailedAnalysis: 'Nomor seri ID #088 tercatat atas nama asisten riset. Kartu ini digunakan untuk mengaktifkan pemindai brankas pada jam kejadian.',
        discoveredSceneId: 'laboratory',
        discoveredSceneName: 'Laboratory (TKP Utama)',
        importance: 'Critical',
        category: 'Fisik',
        relatedSuspectIds: ['suspect-andi']
      },
      {
        id: 'ev-footprint',
        name: 'Jejak Sepatu Berlumpur Basah',
        description: 'Tapak sepatu boot nomor 42 dengan lumpur basah mengarah tergesa-gesa ke ruang brankas.',
        detailedAnalysis: 'Kadar kelembapan tanah membuktikan jejak dibuat saat hujan lebat yang baru turun pukul 22:08 WIB.',
        discoveredSceneId: 'corridor',
        discoveredSceneName: 'Corridor (Lorong Gedung)',
        importance: 'Supporting',
        category: 'Biometrik',
        relatedSuspectIds: ['suspect-budi', 'suspect-andi']
      },
      {
        id: 'ev-document',
        name: 'Buku Log Pembukaan Brankas',
        description: 'Catatan serah terima spesimen menunjukkan brankas dibuka pada pukul 22:12 dengan paraf tergesa-gesa.',
        detailedAnalysis: 'Tinta paraf masih basah. Tanda tangan dipalsukan dan tidak cocok dengan spesimen tanda tangan kepala riset.',
        discoveredSceneId: 'storage-room',
        discoveredSceneName: 'Storage Room (Ruang Penyimpanan)',
        importance: 'Critical',
        category: 'Dokumen',
        relatedSuspectIds: ['suspect-andi', 'suspect-citra']
      },
      {
        id: 'ev-uv-fingerprint',
        name: 'Sidik Jari Laten UV di Gagang Pintu',
        description: 'Pendaran residu fluoresens di bawah sinar UV mengungkap cetakan sidik jari jempol kanan dengan bekas luka gores khas.',
        detailedAnalysis: 'Ciri goresan luka jempol kanan cocok 100% dengan rekam biometrik Andi Saputra, mematahkan klaim bahwa ia tidak berada di TKP.',
        discoveredSceneId: 'corridor',
        discoveredSceneName: 'Corridor (Lorong Gedung)',
        importance: 'Critical',
        category: 'Biometrik',
        relatedSuspectIds: ['suspect-andi']
      },
      // Red Herrings (Bukti Decoy / Pengalih yang Sangat Menggoda)
      {
        id: 'ev-decoy-debt',
        name: 'Surat Somasi & Penolakan Hibah Riset',
        description: 'Surat peringatan keras dari dekanat yang menuntut pertanggungjawaban dana miliaran rupiah atau laboratorium Dr. Citra akan dibekukan.',
        detailedAnalysis: 'Tampak memberi motif kejahatan yang luar biasa kuat bagi Dr. Citra untuk merekayasa pencurian demi asuransi. Namun verifikasi stempel rektorat membuktikan Dr. Citra sedang menandatangani berkas tersebut secara fisik di Gedung Rektorat lantai 3 pada pukul 22:15 WIB.',
        discoveredSceneId: 'laboratory',
        discoveredSceneName: 'Laboratory (TKP Utama)',
        importance: 'Decoy',
        category: 'Dokumen',
        isRedHerring: true,
        relatedSuspectIds: ['suspect-citra']
      },
      {
        id: 'ev-decoy-glove',
        name: 'Sarung Tangan Kerja Hitam Berlumur Oli',
        description: 'Sarung tangan kain tebal dengan serat identik seragam regu pengamanan malam, terselip di kisi ventilasi koridor.',
        detailedAnalysis: 'Sangat mencurigakan dan tampak mengarah langsung ke satpam Budi Santoso. Namun uji laboratorium mendeteksi partikel debu tebal dan ketiadaan residu brankas—sarung tangan ini terjatuh saat servis ventilasi AC dua minggu lalu.',
        discoveredSceneId: 'corridor',
        discoveredSceneName: 'Corridor (Lorong Gedung)',
        importance: 'Decoy',
        category: 'Fisik',
        isRedHerring: true,
        relatedSuspectIds: ['suspect-budi']
      },
      {
        id: 'ev-decoy-key',
        name: 'Gantungan Kunci Cadangan Koridor #02',
        description: 'Anak kunci fisik berlabel satpam bertuliskan "Pintu Darurat & Lab #02" yang tergeletak di sudut tangga darurat.',
        detailedAnalysis: 'Gerigi kunci sudah aus dan berkarat. Silinder pintu laboratorium telah dimodernisasi menggunakan kunci elektronik magnetik, sehingga kunci fisik ini mustahil dipakai membobol ruangan pada malam kejadian.',
        discoveredSceneId: 'corridor',
        discoveredSceneName: 'Corridor (Lorong Gedung)',
        importance: 'Decoy',
        category: 'Fisik',
        isRedHerring: true,
        relatedSuspectIds: ['suspect-budi']
      }
    ],
    suspects: [
      {
        id: 'suspect-andi',
        name: 'Andi Saputra',
        role: 'Asisten Laboratorium',
        description: 'Memiliki akses ke komputer riset dan memegang kartu akses master ID #088.',
        alibi: 'Mengklaim sudah pulang pukul 21:00 dan tidak pernah menginjakkan kaki di gedung saat hujan turun.',
        accessLevel: 'Laboratorium & Ruang Komputer',
        relatedEvidenceIds: ['ev-laptop', 'ev-access-card', 'ev-document', 'ev-uv-fingerprint']
      },
      {
        id: 'suspect-budi',
        name: 'Budi Santoso',
        role: 'Petugas Keamanan Malam',
        description: 'Memegang kunci cadangan fisik koridor dan memakai sepatu dinas boot ukuran 42. Menjadi sasaran kecurigaan utama akibat sarung tangan dan kunci cadangan.',
        alibi: 'Mengaku berada di pos gerbang utama yang berjarak 100 meter saat pemadaman listrik terjadi.',
        accessLevel: 'Seluruh Gedung',
        relatedEvidenceIds: ['ev-cctv', 'ev-footprint', 'ev-decoy-glove', 'ev-decoy-key']
      },
      {
        id: 'suspect-citra',
        name: 'Dr. Citra Lestari',
        role: 'Peneliti Utama (Lead Researcher)',
        description: 'Penanggung jawab formula riset yang hilang. Menghadapi batas waktu pendanaan proyek dan surat somasi penutupan lab.',
        alibi: 'Lembur di ruang kantor lantai 3 dan menandatangani berkas rektorat sampai alarm berbunyi.',
        accessLevel: 'Laboratorium & Ruang Penyimpanan',
        relatedEvidenceIds: ['ev-document', 'ev-decoy-debt']
      }
    ],
    solution: {
      correctSuspectId: 'suspect-andi',
      correctModusOperandi: 'modus-andi',
      keyEvidenceIds: ['ev-laptop', 'ev-access-card', 'ev-document', 'ev-uv-fingerprint'],
      redHerringEvidenceIds: ['ev-decoy-debt', 'ev-decoy-glove', 'ev-decoy-key'],
      explanationKeywords: ['andi', 'kartu', 'akses', 'laptop', 'sidik', 'brankas', 'lumpur', 'hujan', 'cctv', 'paraf']
    }
  }
]
