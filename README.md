# 🌱 KidConnect App

Aplikasi web untuk memberikan **_live update_ kegiatan siswa TK** kepada orang tua secara langsung.  
Orang tua bisa melihat aktivitas harian anak, cuaca, hingga laporan berkala, sementara guru dapat mengunggah laporan kegiatan dan pengumuman.

## 👨‍💻 Developer (Kelompok 13)

- Agatha Husna Amalia (23/515562/TK/56686)
- Amira Syafika Pohan (23/514788/TK/56518)
- Joecelyn Aurora Majesty (23/514716/TK/56510)
- Zaidan Harith (23/512629/TK/56334)
- Zaki Fadhila Rahman (23/520148/TK/57327)

## ⚙️ Cara Menjalankan Program **(Back-End Only)**

1. Pastikan file `.env` sudah ada di folder `/server`. Jika belum, silakan buat dengan _template_ di `.env.example`.

2. Program hanya bisa dijalankan melalui folder `/server`. Maka, jalankan _command prompt_ berikut di folder root.

```
cd server
npm install
npm run dev
```

## 📂 File Directory

```
pawpaw/
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── client/
│   ├── package.json
├── .gitignore
└── README.md
```

## 📖 User Story: Pengembangan Sistem Baru (US3)

- **Login & Role**

  - Login menggunakan akun yang sudah diberikan (tanpa fitur _register_).
  - Role User: Guru (**Teacher**), orang tua (**Parent**), dan **Admin**.

- **Fitur untuk Orang Tua**

  - Melihat kegiatan yang sedang berlangsung (senam, bermain, bercerita, makan siang).
  - Melihat detail data siswa (anaknya).
  - Melihat prediksi cuaca (dari API) untuk persiapan jika hujan.
  - Memberikan informasi ke guru (misalnya anak sedang sakit atau ada kebutuhan khusus).

- **Fitur untuk Guru/Admin**

  - Posting live report kegiatan siswa setiap hari.
  - Posting pengumuman.
  - Menghasilkan laporan otomatis setiap 3 bulan (Laporan Triwulan) yang berisi aktivitas yang _trending_ & catatan siswa untuk rapat orang tua.

- **Fitur khusus untuk Admin**
  - Mendaftarkan (_register_) orang tua dan guru
  - Melihat daftar orang tua dan guru

## 🕒 Batasan & Asumsi

- Hari sekolah: **Senin – Rabu**
- Jam sekolah: **08.00 – 12.00**
- Kegiatan harian: **Senam, Bermain, Bercerita, dan Makan Siang**
- Pertemuan orang tua: **Setiap 3 bulan sekali**

## 🛠️ Tech Stack

- **Frontend**: React / Next.js
- **Backend**: Express.js
- **Database**: MongoDB
- **Cloud**: Cloudinary
- **API UI**: Swagger UI
- **API Eksternal**: Weather API (untuk prediksi cuaca)
