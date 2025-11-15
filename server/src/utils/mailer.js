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

function sendWelcomeEmail(to, name, username, password) {
  return transporter.sendMail({
    from: `"KidConnect Application" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Akun KidConnect Anda Telah Dibuat',
    html: `
      <div>
        <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:18px;box-shadow:0 4px 16px rgba(63,144,101,0.09);padding:24px 16px;font-family:'Inter',sans-serif;border:1px solid #fefaef;">
            <div style="text-align:center;">
                <img src="https://res.cloudinary.com/daaeu39vt/image/upload/v1762916437/uploads/favicon-96x96-1762916430637.png" alt="KidConnect" style="width:80px;margin-bottom:8px;" />
                <h2 style="color:#3f9065;margin-bottom:8px;font-size:1.5rem;">Selamat Datang di KidConnect!</h2>
            </div>
            <p style="font-size:16px;color:#282828;margin-bottom:16px;text-align:center;">
                Halo <b>${name}</b>,
                <br>
                Akun Anda telah berhasil dibuat oleh admin.<br>
                Silakan login menggunakan kredensial berikut untuk mengakses Aplikasi KidConnect.
            </p>
            <div style="background:#fefaef;border-radius:14px;padding:12px 0 18px 0;margin-bottom:28px;text-align:center;box-shadow:0 2px 8px rgba(63,144,101,0.06);">
                <div style="font-size:15px;margin-bottom:12px;">Kredensial Akun Anda:</div>
                <table style="margin:0 auto;border-collapse:separate;border-spacing:0 8px;">
                    <tr>
                        <td style="font-size:15px;color:#3f9065;font-weight:500;padding:0 8px;text-align:right;">Username</td>
                        <td style="font-size:15px;color:#282828;padding:0 8px;text-align:left;">
                            <span style="font-weight:600;letter-spacing:1px;">${username}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size:15px;color:#3f9065;font-weight:500;padding:0 8px;text-align:right;">Password</td>
                        <td style="font-size:15px;color:#282828;padding:0 8px;text-align:left;">
                            <span style="font-weight:600;letter-spacing:1px;">${password}</span>
                        </td>
                    </tr>
                </table>
                <div style="font-size:12px;color:#b34a97;margin-top:14px;">Jangan lupa untuk melakukan <b>RESET PASSWORD</b> pada kredensial anda.</div>
            </div>
            <div style="text-align:center;margin-bottom:28px;">
                <a href="https://kidconnect.vercel.app/login" style="display:inline-block;padding:13px 36px;background:#f5bb00;color:#282828;font-weight:bold;border-radius:9px;text-decoration:none;font-size:17px;box-shadow:0 2px 8px rgba(245,187,0,0.08);transition:background 0.2s;">
                    Login Sekarang
                </a>
            </div>
            <hr style="border:none;border-top:1px solid #eee;margin:28px 0;">
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