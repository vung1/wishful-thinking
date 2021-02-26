/**
 * Module dependencies.
 */
const createError = require("http-errors");
const express = require("express");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const data = require("./data.json");

const app = express();

// all environments
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

// app.use(express.favicon());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());
// app.use(express.session());
// app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/signout", (req, res) => {
  res.redirect("/");
});

app.get("/profile", (req, res) => {
  res.render("profile");
});

app.get("/friends", (req, res) => {
  res.render("friends", { data });
});

app.get("/calendar", (req, res) => {
  res.render("calendar", { data });
});

app.get("/help", (req, res) => {
  res.render("help", { data });
});

app.get("/addItem", (req, res) => {
  res.render("addItem");
});

app.get("/addItemDummy", (req, res) => {
  res.render("addItemDummy");
});

app.get("/addWishListItem", (req, res) => {
  res.render("addWishListItem");
});

app.get("/addWishListItemDummy", (req, res) => {
  res.render("addWishListItemDummy");
});

app.get("/addList", (req, res) => {
  res.render("addList");
});

app.get("/addListDummy", (req, res) => {
  res.render("addListDummy");
});

app.get("/itemDetails", (req, res) => {
  res.render("itemDetails");
});

app.get("/listDetails", (req, res) => {
  res.render("listDetails");
});

app.get("/addFriend", (req, res) => {
  res.render("addFriend");
});

app.get("/addFriendDummy", (req, res) => {
  res.render("addFriendDummy", { data });
});

app.get("/searchDummy", (req, res) => {
  res.render("searchDummy");
});

app.get("/loading", (req, res) => {
  res.render("loading");
});

app.get("/editProfile", (req, res) => {
  res.render("editProfile");
});

app.get("/editProfileDummy", (req, res) => {
  res.render("editProfileDummy");
});

app.get("/dateDetails", (req, res) => {
  res.render("dateDetails");
});

app.get("/addDateDummy", (req, res) => {
  res.render("addDateDummy", { data });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/addDate", (req, res) => {
  res.render("addDate");
});

http.createServer(app).listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});
