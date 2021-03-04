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
const bodyParser = require("body-parser");

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
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
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

const convertBirthday = (birthdayFormat) => {
    let month = undefined;
    if (birthdayFormat.substring(5, 7) === "01") {
        month = "January";
    } else if (birthdayFormat.substring(5, 7) === "02") {
        month = "February";
    } else if (birthdayFormat.substring(5, 7) === "03") {
        month = "March";
    } else if (birthdayFormat.substring(5, 7) === "04") {
        month = "April";
    } else if (birthdayFormat.substring(5, 7) === "05") {
        month = "May";
    } else if (birthdayFormat.substring(5, 7) === "06") {
        month = "June";
    } else if (birthdayFormat.substring(5, 7) === "07") {
        month = "July";
    } else if (birthdayFormat.substring(5, 7) === "08") {
        month = "August";
    } else if (birthdayFormat.substring(5, 7) === "09") {
        month = "September";
    } else if (birthdayFormat.substring(5, 7) === "10") {
        month = "October";
    } else if (birthdayFormat.substring(5, 7) === "11") {
        month = "November";
    } else if (birthdayFormat.substring(5, 7) === "12") {
        month = "December";
    }

    const date = birthdayFormat.substring(8);

    return month + " " + date;
};

app.get("/editMe", function (req, res) {
    const name = req.query.name;
    let birthday = req.query.birthday;
    const profileImage = req.query.profileImage;

    birthday = convertBirthday(birthday);
    data.me.name = name;
    data.me.birthday = birthday;
    data.me.profileImage = profileImage;

    res.render("profile", { data });
});

app.get("/listItemDetails/:person/:itemName", (req, res) => {
    const person = req.params.person;
    const itemName = req.params.itemName;

    let itemDetail = undefined;
    for (personInfo of data.me.wishlistIdeas) {
        if (personInfo.name === person) {
            for (items of personInfo.items) {
                if (items.name == itemName) {
                    const name = items.name;
                    const description = items.description;
                    const price = items.price;
                    const link = items.link;
                    itemDetail = { name, description, price, link };
                }
            }
        }
    }

    res.render("listItemDetails", { itemDetail });
});

app.get("/addMyItem", function (req, res) {
    const name = req.query.name;
    const description = req.query.description;
    const price = req.query.price;
    const link = req.query.link;
    const newItem = { name, description, price, link };
    data.me.wishlist.push(newItem);
    res.render("profile", { data });
});

const formatDate = (date) => {
    const month = date.substring(5, 7);
    const day = date.substring(8);
    const year = date.substring(0, 4);

    return month + "-" + day + "-" + year;
};

app.get("/addMyList", function (req, res) {
    const name = req.query.name;
    const occasion = req.query.occasion;
    let date = req.query.date;
    date = formatDate(date);
    const newItem = { name, occasion, date };
    data.me.wishlistIdeas.push(newItem);
    res.render("profile", { data });
});

app.get("/", function (req, res) {
    res.render("home", { user: req.user });
});

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/signout", (req, res) => {
    res.redirect("/");
});

app.get("/profile", (req, res) => {
    res.render("profile", { data });
});

app.get("/friends", (req, res) => {
    res.render("friends", { data });
});

app.get("/addFriendList/:friendName", (req, res) => {
    const friendName = req.params.friendName;
    let i;
    let newFriend = undefined;

    for (i = 0; i < data.strangers.length; i++) {
        if (data.strangers[i].name === friendName) {
            newFriend = data.strangers.splice(i, i + 1);
            break;
        }
    }

    data.friends.push(newFriend[0]);

    res.render("friends", { data });
});

app.get("/calendar", (req, res) => {
    res.render("calendar", { data });
});

app.get("/help", (req, res) => {
    res.render("help", { data });
});

app.get("/addItem/:name", (req, res) => {
    const name = req.params.name;
    res.render("addItem", { name });
});

app.get("/addFriendItem/:person", (req, res) => {
    const person = req.params.person;

    const name = req.query.name;
    const description = req.query.description;
    const price = req.query.price;
    const link = req.query.link;
    const newItem = { name, description, price, link };

    let wishlistDetails = undefined;
    for (friend of data.me.wishlistIdeas) {
        if (friend.name === person) {
            friend.items.push(newItem);
            wishlistDetails = {
                name: friend.name,
                occasion: friend.occasion,
                date: friend.date,
                items: friend.items,
            };
        }
    }

    console.log(wishlistDetails);
    res.render(`listDetails`, { wishlistDetails });
});

app.get("/addWishListItem", (req, res) => {
    res.render("addWishListItem");
});

app.get("/addList", (req, res) => {
    res.render("addList");
});

app.get("/itemDetails/:itemName", (req, res) => {
    const itemName = req.params.itemName;
    let itemDetail = undefined;
    for (item of data.me.wishlist) {
        if (item.name === itemName) {
            const description = item.description;
            const price = item.price;
            const link = item.link;
            itemDetail = { itemName, description, price, link };
        }
    }

    res.render("itemDetails", { itemDetail });
});

app.get("/itemDetails/:friendName/:itemName", (req, res) => {
    const friendName = req.params.friendName;
    const itemName = req.params.itemName;

    let itemDetail = undefined;
    console.log(friendName);
    for (friend of data.friends) {
        if (friend.name === friendName) {
            for (wishlist of friend.wishlist) {
                if (wishlist.name === itemName) {
                    const description = wishlist.description;
                    const price = wishlist.price;
                    const link = wishlist.link;
                    itemDetail = { itemName, description, price, link };
                }
            }
        }
    }

    res.render("itemDetails", { itemDetail });
});

app.get("/listDetails/:name", (req, res) => {
    const name = req.params.name;
    let wishlistDetails = undefined;
    for (person of data.me.wishlistIdeas) {
        if (person.name === name) {
            const name = person.name;
            const occasion = person.occasion;
            const date = person.date;
            const items = person.items;
            wishlistDetails = { name, occasion, date, items };
        }
    }
    res.render("listDetails", { wishlistDetails });
});

app.get("/addFriend", (req, res) => {
    res.render("addFriend", { data });
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
