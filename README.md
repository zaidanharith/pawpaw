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

2. _Clone_ Repository GitHub ini.

```bash
git clone https://github.com/zaidanharith/pawpaw.git
cd pawpaw
```

3. Jalankan _command prompt_ berikut di folder root (`/pawpaw`).

```bash
npm run install:all
npm run dev
```

3. Akses aplikasi:
  - **Frontend**: <a href="https://kidconnect.vercel.app" target="_blank" rel="noopener noreferrer">https://kidconnect.vercel.app</a>  
  - **Backend API**: <a href="https://api-kidconnect.vercel.app" target="_blank" rel="noopener noreferrer">https://api-kidconnect.vercel.app</a>

## 📝 Penjelasan Detail Tentang Aplikasi dan Link Video Demo

🔗 [Laporan Kelompok 13 PAW_US3 : KidConnect Application](https://drive.google.com/drive/folders/1BU8iePVpYhGK1ela7MJdZAZUS7w8tawK?usp=sharing)


🔗 [Video Demo : KidConnect Application](https://drive.google.com/drive/folders/1EPUovRzS4Pk-QA-Hbb7jKz7DHd7jGYBK?usp=sharing)

## 📂 File Directory

```
pawpaw/
├── server/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── prisma.config.ts
│   ├── README.md
│   ├── prisma/
│   │   ├── reset.js
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── config/
│       │   ├── cloudinary.js
│       │   ├── prisma.js
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
│   ├── middleware.ts
│   ├── next.config.ts
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── tsconfig.json
|   ├── .next
|   ├── node_modules/
│   ├── public/
│   |   ├── images/
|   |   ├── models/
│   └── src/
│       ├── app/
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   ├── page.tsx
|       |   ├── not.found.tsx
|       |   ├── error.tsx
|       |   ├── favicon.ico
│       │   ├── api/
│       │   │   └── auth/
│       │   │       └── [...nextauth]/
│       │   │           └── route.ts
│       │   ├── dashboard/
│       │   │   ├── [page]
|       |   |   |    ├──layout.tsx
|       |   |   |    ├── page.tsx
│       │   ├── login/
│       │   │   ├── page.tsx
|       |   |   ├── layput.tsx
│       │   ├── privacy-policy/
│       │   |   └── page.tsx
|       |   └── terms-of-services/
|       |   |   └── page.tsx
│       ├── components/
│       │   ├── auth/
│       │   │   ├── LoginForm.tsx
|       |   |   ├── FaceLogin.tsx
|       |   |   ├── LoginGoogleButton.tsx
│       │   │   └── RegisterForm.tsx
|       |   ├── dashboard/
|       |   |    ├── Admin.tsx
|       |   |    ├── Parent.tsx
|       |   |    ├── Teacher.tsx
|       |   |    └── index.ts
│       │   ├── layout/
│       │   │   ├── Navbar.tsx
|       |   |   ├── Footer.tsx
│       │   │   └── Sidebar.tsx
│       │   ├── providers/
│       │   │   └── SessionProvider.tsx
│       │   └── ui/
│       │   |   ├── dashboard/
|       |   |        ├── AddAnnouncement.tsx
|       |   |        ├── AddClass.tsx
|       |   |        ├── AddReport.tsx
|       |   |        ├── AddStudent.tsx
|       |   |        ├── AddUser.tsx
|       |   |        ├── Announcement.tsx
|       |   |        ├── AnnouncementDetail.tsx
|       |   |        ├── AnnouncementPage.tsx
|       |   |        ├── Attendance.tsx
|       |   |        ├── AttendanceRecap.tsx
|       |   |        ├── ClassPage.tsx
|       |   |        ├── DasboardPageTitle.tsx
|       |   |        ├── DetailQuarterlyReport.tsx
|       |   |        ├── DetailReport.tsx
|       |   |        ├── EditAnnouncement.tsx
|       |   |        ├── EditClass.tsx
|       |   |        ├── EditProfile.tsx
|       |   |        ├── EditQuarterlyReport.tsx
|       |   |        ├── EditReport.tsx
|       |   |        ├── EditStudent.tsx
|       |   |        ├── EditUser.tsx
|       |   |        ├── FaceRegister.tsx
|       |   |        ├── FormQuarterlyReport.tsx
|       |   |        ├── index.ts
|       |   |        ├── LiveReport.tsx
|       |   |        ├── LiveReport.tsc
|       |   |        ├── LiveReportCard.tsx
|       |   |        ├── LiveReportFilter.tsx
|       |   |        ├── LiveReportPage.tsx
|       |   |        ├── MenuNotFound.tsx
|       |   |        ├── PreviewChat.tsx
|       |   |        ├── Profile.tsx
|       |   |        ├── QuarterlyReportList.tsx
|       |   |        ├── QuarterlyReportPage.tsx
|       |   |        ├── RecentAnnouncement.tsx
|       |   |        ├── RecentMessage.tsx
|       |   |        ├── ReportPage.tsx
|       |   |        ├── ResetPassword.tsx
|       |   |        ├── RoleLabel.tsx
|       |   |        ├── Statistic.tsx
|       |   |        ├── StudentTable.tsx
|       |   |        ├── UserTable.tsx
|       |   |        ├── Weather.tsx
|       |   |   ├── BurgerButton.tsx
|       |   |   ├── ChatList.tsx
|       |   |   ├── DeleteConfirmation.tsx
|       |   |   ├── FeatureCard.tsx
|       |   |   ├── Gallery.tsx
|       |   |   ├── Input.tsx
|       |   |   ├── LiveChat.tsx
|       |   |   ├── Loading.tsx
|       |   |   └── Button.tsx
│       ├── hooks/
│       │   └── useAuth.ts
│       ├── lib/
│       │   └── api.ts
│       ├── services/
│       │   ├── auth.service.ts
|       |   └── faceAuth.service.ts
│       ├── styles/
│       └── types/
│           └── next-auth.d.ts
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
  <img src="https://img.shields.io/badge/-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/>
  <img src="https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white"/>
  <img src="https://img.shields.io/badge/-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black"/>
  <img src="https://img.shields.io/badge/-Weather%20API-FF9A00?style=for-the-badge&logo=openweathermap&logoColor=white"/>
  <img src="https://img.shields.io/badge/-Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white"/>
  <img src="https://img.shields.io/badge/-Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=white"/>
  <img src="https://img.shields.io/badge/-Helmet.js-4C4C4C?style=for-the-badge&logo=helmet&logoColor=white"/>
</p>

### Frontend
<p>
  <img src="https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/-NextAuth.js-000000?style=for-the-badge&logo=next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/-FACE/API.js-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
</p>

### Authentication & Authorization
<p>
  <img src="https://img.shields.io/badge/-Google%20OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
  <img src="https://img.shields.io/badge/-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
  <img src="https://img.shields.io/badge/-NextAuth.js-000000?style=for-the-badge&logo=next.js&logoColor=white"/>
</p>

## 📄 License

ISC © Kelompok 13
