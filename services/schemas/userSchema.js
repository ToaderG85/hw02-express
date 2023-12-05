const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const gravatar =  require("gravatar");

const userSchema = new Schema (
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
    }
  }
);

userSchema.methods.hashPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
 };
 
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
 };

userSchema.pre("save", function (next) {
  if (!this.avatarUrl) {
    this.avatarUrl = gravatar.url(this.email,{s:200,r:"pg",d:"identicon"}, true);
  }
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;