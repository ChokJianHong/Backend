const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

function sendEmail(mailOptions) {
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Email sent:", data);
    }
  });
}

module.exports = { sendEmail };
