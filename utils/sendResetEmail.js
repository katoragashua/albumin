const sendEmail = require("./sendEmail");

const sendResetEmail = async ({ name, email, passwordToken, origin }) => {
  const resetLink = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`;
  const message = `<p>Please use this <a href="${resetLink}">link</a> to reset your password</p>
  <small>Note: Link expires in 1 hour.</small>`;
  return sendEmail({
    to: email,
    subject: "Reset password",
    html: `<h2>Hello, ${name.split(" ")[0]}!</h2> 
    ${message}`,
  });
};

module.exports = sendResetEmail;
