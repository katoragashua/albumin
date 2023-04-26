const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");
const sgMail = require("@sendgrid/mail");

// const sendEmail = async function ({ to, subject, html }) {
//   let testAccount = await nodemailer.createTestAccount();
//   let transporter = nodemailer.createTransport(nodemailerConfig);
//   let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to,
//     subject,
//     html,
//   });
//   return info;
//   // However, since this is an async function we can also return directly without await
//   // return transporter.sendMail(emailObject);
// };

const sendEmail = async ( {to, subject, html}) => {
    sgMail.setApiKey(process.env.BANANA_BANDIT_KEY)
    const msg = {
      to, // Change to your recipient
      from: "katoragashua@outlook.com", // Change to your verified sender
      subject,
      html,
    };
    const info = await sgMail.send(msg);
    return info
}

module.exports = sendEmail;
