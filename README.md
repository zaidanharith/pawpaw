# 🏫 KidConnect Application 🎒

Aplikasi web untuk memberikan **_live update_ kegiatan siswa TK** kepada orang tua secara langsung.  
Orang tua bisa melihat aktivitas harian anak, cuaca, hingga laporan berkala, sementara guru dapat mengunggah laporan kegiatan dan pengumuman.

## 👨‍💻 Developer (Kelompok 13)

- Agatha Husna Amalia (23/515562/TK/56686)
- Amira Syafika Pohan (23/514788/TK/56518)
- Joecelyn Aurora Majesty (23/514716/TK/56510)
- Zaidan Harith (23/512629/TK/56334)
- Zaki Fadhila Rahman (23/520148/TK/57327)

## Penjelasan Detail Tentang Aplikasi

🔗 [Laporan Kelompok 13 PAW_US3 : KidConnect Application](https://drive.google.com/drive/folders/1BU8iePVpYhGK1ela7MJdZAZUS7w8tawK?usp=sharing)

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
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   └── src/
│       ├── config/
│       │   ├── cloudinary.js
│       │   ├── database.js
│       │   └── swagger.js
│       ├── controllers/
│       │   ├── activity.controller.js
│       │   ├── announcement.controller.js
│       │   ├── attendance.controller.js
│       │   ├── auth.controller.js
│       │   ├── classroom.controller.js
│       │   ├── liveReport.controller.js
│       │   ├── message.controller.js
│       │   ├── quarterlyReport.controller.js
│       │   ├── student.controller.js
│       │   ├── upload.controller.js
│       │   ├── user.controller.js
│       │   └── weather.controller.js
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   └── upload.middleware.js
│       ├── models/
│       │   ├── Activity.js
│       │   ├── Announcement.js
│       │   ├── Attendance.js
│       │   ├── Classroom.js
│       │   ├── index.js
│       │   ├── LiveReport.js
│       │   ├── Message.js
│       │   ├── QuarterlyReport.js
│       │   ├── Student.js
│       │   ├── Upload.js
│       │   └── User.js
│       ├── routes/
│       │   ├── activity.route.js
│       │   ├── announcement.route.js
│       │   ├── attendance.route.js
│       │   ├── auth.route.js
│       │   ├── classroom.route.js
│       │   ├── index.js
│       │   ├── liveReport.route.js
│       │   ├── message.route.js
│       │   ├── quarterlyReport.route.js
│       │   ├── student.route.js
│       │   ├── upload.route.js
│       │   └── weather.route.js
│       ├── services/
│       │   └── weather.service.js
│       ├── utils/
│       │   └── jwt.js
│       └── server.js
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

## 🕒 Batasan & Asumsi pada Aplikasi

- Hari sekolah: **Senin – Rabu**
- Jam sekolah: **08.00 – 12.00**
- Kegiatan harian: **Senam, Bermain, Bercerita, dan Makan Siang**
- Pertemuan orang tua: **Setiap 3 bulan sekali**

## 🛠️ Tech Stack yang Digunakan

<p>
  <img src="https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white"/>
  <img src="https://img.shields.io/badge/-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black"/>
  <img src="https://img.shields.io/badge/-Weather%20API-FF9A00?style=for-the-badge&logo=openweathermap&logoColor=white"/>
</p>
