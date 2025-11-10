const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    accessToken: process.env.GOOGLE_ACCESS_TOKEN,
  },
});

function sendWelcomeEmail(to, name) {
  return transporter.sendMail({
    from: `"KidConnect Application" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Akun KidConnect Anda Telah Dibuat',
    html: `
      <div style="background:#fefaef;padding:32px 0;">
        <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.07);padding:32px;font-family:sans-serif;">
          <div style="text-align:center;">
            <img src="https://i.ibb.co/6bJvYyH/kidconnect-logo.png" alt="KidConnect" style="width:80px;margin-bottom:16px;" />
            <h2 style="color:#3f9065;margin-bottom:8px;">Selamat Datang di KidConnect!</h2>
          </div>
          <p style="font-size:16px;color:#282828;margin-bottom:24px;">
            Halo <b>${name}</b>,<br>
            Akun Anda telah berhasil dibuat oleh admin.<br>
            Silakan login menggunakan email ini untuk mengakses sistem manajemen sekolah TK.
          </p>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="https://kidconnect.app/login" style="display:inline-block;padding:12px 32px;background:#f5bb00;color:#282828;font-weight:bold;border-radius:8px;text-decoration:none;font-size:16px;">
              Login Sekarang
            </a>
          </div>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="font-size:13px;color:#888;text-align:center;">
            Jika Anda tidak merasa membuat akun ini, abaikan email ini.<br>
            &copy; ${new Date().getFullYear()} KidConnect
          </p>
        </div>
      </div>
    `,
  });
}

module.exports = { sendWelcomeEmail };