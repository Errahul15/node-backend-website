require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const clientSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique:true
  },
  tokens: [
    {
      token: {
        type: String,
        require: true,
      },
    },
  ],
});


// generating tokens
clientSchema.methods.generateAuthToken = async function () {
    try {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    res.send(error);
  }
};

// hashing of password
clientSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Register = new mongoose.model("Register", clientSchema);

module.exports = Register;
