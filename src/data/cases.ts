export interface Evidence {
  id: string
  name: string
  description: string
  yaw: string
  pitch: string
}

export interface Scene {
  id: string
  name: string
  panorama: string
  evidences: Evidence[]
}

export interface CaseData {
  id: number
  title: string
  description: string
  scenes: Scene[]
}

export const caseData: CaseData = {
  id: 1,
  title: 'Hilangnya Barang Bukti',
  description:
    'Sebuah barang bukti dilaporkan hilang dari ruang penyimpanan pada pukul 22:15.',
  scenes: [
    {
      id: 'tkp-utama',
      name: 'TKP Utama',
      panorama: '/panoramas/tkp-utama.jpg',
      evidences: [
        {
          id: 'evidence-01',
          name: 'Laptop',
          description: 'Laptop ditemukan dalam keadaan menyala. Ada file terakhir yang dibuka pukul 22:07.',
          yaw: '45deg',
          pitch: '-5deg'
        },
        {
          id: 'evidence-02',
          name: 'CCTV',
          description: 'CCTV ditemukan dalam kondisi mati dan kabel daya terputus rapi.',
          yaw: '120deg',
          pitch: '5deg'
        }
      ]
    }
  ]
}
