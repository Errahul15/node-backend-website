require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");  ``
require("./db/conn");
const Register = require("./models/registers");
const jwt = require("jsonwebtoken");
const { json } = require("express");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", auth, (req, res) => {
  res.render("login");
});


// logout option
// app.get("/logout", async (req, res) => {
//   try {
//     req.user.tokens = req.user.token.filter((currElement) => {
//       return currElement.token !== req.token;
//     });

//     res.clearCookie("jwt");
//     console.log("logout succesfully");
//     await req.user.save();
//     res.render("login");
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

app.post("/register", async (req, res) => {
  try {
    const registerClient = new Register({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      phone: req.body.phone,
    });

    const token = await registerClient.generateAuthToken();

    //   cookies

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 30000),
      httpOnly: true,
    });

    const registered = await registerClient.save();
    res.status(201).render("index");
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await Register.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, useremail.password);

    const token = await useremail.generateAuthToken();

    //   cookies

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 500000),
      httpOnly: true,
      // secure:true
    });

    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.send("email and password mismatch");
    }
  } catch (error) {
   res.status(400).send("invalid email");
  }
});

const createToken = async () => {
  const token = await jwt.sign({ _id: this._id }, process.env.SECRET_KEY);

  const userVer = await jwt.verify(token, process.env.SECRET_KEY);
};
createToken();

app.listen(port, () => {
  console.log(`Server is running at port no ${port}`);
});
