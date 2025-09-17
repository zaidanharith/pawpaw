# 🌱 KidConnect

Aplikasi web untuk memberikan **_live update_ kegiatan siswa TK** kepada orang tua secara langsung.  
Orang tua bisa melihat aktivitas harian anak, cuaca, hingga laporan berkala, sementara guru dapat mengunggah laporan kegiatan dan pengumuman.

## ✅ To-do List

1. Install tools yang belum lengkap (Express, dll) — _Minggu ini_
2. Pelajari & eksplorasi fitur-fitur aplikasi — _Minggu ini_
3. Cari referensi sesuai case — _Minggu ini_

📌 Jadwal ketemuan: **TIAP RABU HABIS REKDAT (TILL DROP)‼️**

⌚ Deadline Milestone 1: **Rabu, 1 Oktober 2025, 06.59 WIB (BACK-END)**

## 👨‍💻 Developer (Kelompok 13)

- Agatha Husna Amalia (23/515562/TK/56686)
- Amira Syafika Pohan (23/514788/TK/56518)
- Joecelyn Aurora Majesty (23/514716/TK/56510)
- Zaidan Harith (23/512629/TK/56334)
- Zaki Fadhila Rahman (23/520148/TK/57327)

## 📖 User Story: Pengembangan Sistem Baru (US3)

- **Login & Role**

  - Login menggunakan akun yang sudah diberikan (tanpa fitur register).
  - Role: **Orang Tua** & **Guru/Admin**.

- **Fitur untuk Orang Tua**

  - Melihat kegiatan yang sedang berlangsung (senam, bermain, bercerita, makan siang).
  - Melihat detail data siswa (anaknya).
  - Melihat prediksi cuaca (dari API) untuk persiapan jika hujan.
  - Memberikan informasi ke guru (misalnya anak sedang sakit atau ada kebutuhan khusus).

- **Fitur untuk Guru/Admin**
  - Posting live report kegiatan siswa setiap hari.
  - Posting pengumuman.
  - Menghasilkan laporan otomatis setiap 3 bulan (trending aktivitas & catatan siswa untuk rapat orang tua).

## 🕒 Batasan & Asumsi

- Hari sekolah: **Senin – Rabu**
- Jam sekolah: **08.00 – 12.00**
- Kegiatan harian: **Senam, Bermain, Bercerita, dan Makan Siang**
- Pertemuan orang tua: **Setiap 3 bulan sekali**

## 🛠️ Tech Stack

- **Frontend**: React / Next.js
- **Backend**: Express.js
- **Database**: MongoDB
- **API**: Weather API (untuk prediksi cuaca)

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
│   │   ├── cron/
│   │   └── server.js
│   ├── package.json
│   └── README.md
├── client/
│   ├── package.json
├── .gitignore
└── README.md
```

## 📌 Notes

- Repo ini digunakan untuk pengembangan project kuliah kelompok.
- Semua fitur dan jadwal masih bisa berubah sesuai kebutuhan dan hasil diskusi tim.
