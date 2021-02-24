var express = require("express");
var router = express.Router();

/* GET home page. */

router.get("/profile", (req, res) => {
  res.render("profile");
});

router.get("/friends", (req, res) => {
  res.render("friends");
});

router.get("/calendar", (req, res) => {
  res.render("calendar");
});

router.get("/help", (req, res) => {
  res.render("help");
});

router.get("/additem", (req, res) => {
  res.render("addItem");
});

router.get("/addList", (req, res) => {
  res.render("addList");
});

router.get("/itemDetails", (req, res) => {
  res.render("itemDetails");
});

router.get("/listDetails", (req, res) => {
  res.render("listDetails");
});

router.get("/userProfile", (req, res) => {
  res.render("userProfile");
});

router.get("/addFriend", (req, res) => {
  res.render("addFriend");
});

module.exports = router;
