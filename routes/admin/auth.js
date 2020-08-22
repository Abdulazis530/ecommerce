const express = require("express");

const { handleErrors } = require("./midllewares");
const usersRepo = require("../../repository/users");
const signUpTemplate = require("../../views/admin/auth/signup");
const signInTemplate = require("../../views/admin/auth/signin");
const {
  requiredEmail,
  requiredPassword,
  requiredPasscom,
  requireEmailExist,
  requireValidPasswordForUser,
} = require("./validation");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signUpTemplate({ req }));
});

router.post(
  "/signup",
  [requiredEmail, requiredPassword, requiredPasscom],
  handleErrors(signUpTemplate),
  async (req, res) => {
    const { email, password, passCom } = req.body;
    const user = await usersRepo.create({ email, password });

    req.session.usersId = user.id;
    res.redirect("/admin/products");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("<h1>you are log out</h1>");
});

router.get("/signin", (req, res) => {
  res.send(signInTemplate({}));
});

router.post(
  "/signin",
  [requireEmailExist, requireValidPasswordForUser],
  handleErrors(signInTemplate),
  async (req, res) => {
    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });

    req.session.usersId = user.id;

    res.redirect("/admin/products");
  }
);

module.exports = router;
