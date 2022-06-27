const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async (req, res, next) => {
  try {
    const token = req.cookie.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

    const user = await Register.findOne({ _id: verifyUser._id });
    console.log(user);

    req.token = token;
    req.user = token;

    next();
  } catch (error) {
    res.status(401).send(`<h1>You are not registered<h1>`);
  }
};

module.exports = auth;
