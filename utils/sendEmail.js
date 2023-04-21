const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendEmail = async function ({ to, subject, html }) {
  
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport(nodemailerConfig);
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to,
    subject,
    html,
  });
  return info;
  // However, since this is an async function we can also return directly without await
  // return transporter.sendMail(emailObject);
};

module.exports = sendEmail;
