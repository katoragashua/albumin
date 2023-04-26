const sendEmail = require("./sendEmail");

const sendResetEmail = async ({ name, email, passwordToken, origin }) => {
  const resetLink = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`;
  const message = `<h4>Please use this <a href="${resetLink}">link</a> to reset your password</h4>
  <small>Note: Link expires in 1 hour.</small>`;
  return sendEmail({
    to: email,
    subject: "Reset password",
    html: `<h3>Hello, ${name.split(" ")[0]}!</h3> 
    ${message}`,
  });
};

module.exports = sendResetEmail;
