const { Schema, default: mongoose } = require("mongoose");
const Isemail = require("isemail");
const bcrypt = require("bcryptjs");
const CustomError = require("../errors/index")

// Create a UserSchema
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter a name."],
    trim: true,
    minlength: 2,
    maxlength: 30,
  },

  firstName: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 30,
  },
  lastName: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, "Please enter an email."],
    trim: true,
    maxlength: 30,
    unique: true,
    trim: true,
    validate: [(val) => Isemail.validate(val), "Enter a valid email address."],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password."],
    minlength: [6, "Password must not be less than 6 characters."],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  verified: {
    type: Date,
  },
  userImage: {
    type: String,
  },
  passwordToken: {
    type: String,
  },
  passwordTokenExpiration: {
    type: Date,
  },
}, {timestamps: true});

// Using mongoose hooks, hash the password before saving
UserSchema.pre("save", async function () {
    // The if block is used to make sure the password in only hashed if it has changed
    if(!this.isModified("password")) {
        return
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
});


module.exports = mongoose.model("User", UserSchema);