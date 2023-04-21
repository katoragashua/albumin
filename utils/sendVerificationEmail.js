const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verificationLink = `${origin}/users/verify-email?token=${verificationToken}&email=${email}`;
  const verificationMessage = `<p>Please click on the <a href=${verificationLink}>link</a> to verify your account.</p>`;

  await sendEmail({
    to: email,
    subject: "Verify Email",
    html: `<h2>Hello, ${name.split(" ")[0]}</h2> ${verificationMessage}`,
  });
};

module.exports = sendVerificationEmail;
