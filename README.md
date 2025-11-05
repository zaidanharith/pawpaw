# 🏫 KidConnect Application 🎒

Aplikasi web untuk memberikan **_live update_ kegiatan siswa TK** kepada orang tua secara langsung.  
Orang tua bisa melihat aktivitas harian anak, cuaca, hingga laporan berkala, sementara guru dapat mengunggah laporan kegiatan dan pengumuman.

## 👨‍💻 Developer (Kelompok 13)

- Agatha Husna Amalia (23/515562/TK/56686)
- Amira Syafika Pohan (23/514788/TK/56518)
- Joecelyn Aurora Majesty (23/514716/TK/56510)
- Zaidan Harith (23/512629/TK/56334)
- Zaki Fadhila Rahman (23/520148/TK/57327)

## ⚙️ Cara Menjalankan Program

1. Pastikan file `.env` sudah ada di folder `/server` dan file `.env.local` sudah ada di folder `/client`. Jika belum, silakan buat dengan _template_ di `.env.example` di setiap foldernya.

2. Jalankan _command prompt_ berikut di folder root (`/pawpaw`).

```bash
npm run install:all
npm run dev
```

3. Akses aplikasi:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **API Documentation (Swagger)**: http://localhost:5000/api/docs

## 📝 Penjelasan Detail Tentang Aplikasi

🔗 [Laporan Kelompok 13 PAW_US3 : KidConnect Application](https://drive.google.com/drive/folders/1BU8iePVpYhGK1ela7MJdZAZUS7w8tawK?usp=sharing)

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
│
├── client/
│   ├── .env.local
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── public/
│   └── src/
│       ├── app/
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── components/
│       └── styles/
│
├── package.json
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

### Backend
<p>
  <img src="https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white"/>
  <img src="https://img.shields.io/badge/-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black"/>
  <img src="https://img.shields.io/badge/-Weather%20API-FF9A00?style=for-the-badge&logo=openweathermap&logoColor=white"/>
</p>

### Frontend
<p>
  <img src="https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
</p>

## 📜 Available Scripts

```bash
# Install semua dependencies (frontend + backend)
npm run install:all

# Development mode (jalankan frontend + backend sekaligus)
npm run dev

# Jalankan backend saja
npm run server

# Jalankan frontend saja
npm run client

# Build untuk production
npm run build

# Build frontend + backend
npm run build:all

# Hapus cache
npm run clean:cache

# Hapus semua dependencies dan cache
npm run clean
```

## 🔐 Environment Variables

### Backend (server/.env)
```env
MONGO_URI=your_mongodb_uri
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
WEATHER_API_KEY=your_weather_api_key
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
```

### Frontend (client/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📄 License

ISC © Kelompok 13
