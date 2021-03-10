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
const help = require("./help.json");

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

const convertDate = (birthdayFormat) => {
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

    let date = birthdayFormat.substring(8);
    if (date.substring(0, 1) === "0") {
        date = date.substring(1);
    }

    return month + " " + date;
};

app.get("/removeFriend/:friendName", (req, res) => {
    const friendName = req.params.friendName;

    let i;
    let stranger = undefined;
    for (i = 0; i < data.strangers.length; i++) {
        if (data.friends[i].name === friendName) {
            stranger = data.friends.splice(i, i + 1);
            break;
        }
    }

    console.log(data.friends);

    data.strangers.push(stranger[0]);
    res.render("friends", { data });
});

app.get("/editMe", function (req, res) {
    const name = req.query.name;
    let birthday = req.query.birthday;
    const profileImage = req.query.profileImage;

    birthday = convertDate(birthday);
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

app.get("/addMyDate", function (req, res) {
    const name = req.query.name;
    const date = convertDate(req.query.date);
    const description = req.query.description;

    const newDate = { name, date, description };
    data.dates.push(newDate);
    res.redirect("calendar");
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
    const items = [];
    const newItem = { name, occasion, date, items };
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
    data.me.name = "John Doe";
    data.me.profileImage = "https://i.imgur.com/XVmQnQQ.png";
    res.redirect("/");
});

app.get("/profile", (req, res) => {
    const link = req._parsedOriginalUrl.href;
    if (link.length > 8) {
        let name = link.substring(14, link.indexOf("profile_pic") - 1);
        name = name.split("%20").join(" ");
        const profileImage = link.substring(link.indexOf("profile_pic") + 12);
        console.log(data.me.name);

        data.me.name = name;
        data.me.profileImage = profileImage;
    }
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

    res.redirect("/friends");
    // res.render("friends", { data });
});

const convertMonth = (date) => {
    if (date === "January") {
        return 1;
    } else if (date === "February") {
        return 2;
    } else if (date === "March") {
        return 3;
    } else if (date === "April") {
        return 4;
    } else if (date === "May") {
        return 5;
    } else if (date === "June") {
        return 6;
    } else if (date === "July") {
        return 7;
    } else if (date === "August") {
        return 8;
    } else if (date === "September") {
        return 9;
    } else if (date === "October") {
        return 10;
    } else if (date === "November") {
        return 11;
    } else if (date === "December") {
        return 12;
    }
};

const compare = (date1, date2) => {
    const month1 = date1.substring(0, date1.indexOf(" "));
    const month2 = date2.substring(0, date2.indexOf(" "));

    const numMonth1 = convertMonth(month1);
    const numMonth2 = convertMonth(month2);

    if (numMonth1 > numMonth2) {
        return true;
    } else if (numMonth1 === numMonth2) {
        console.log("HERE");
        const day1 = date1.substring(date1.indexOf(" ") + 1);
        const day2 = date2.substring(date2.indexOf(" ") + 1);

        if (parseInt(day1) > parseInt(day2)) {
            console.log("IN RETURN");
            return true;
        }
    }
};

const sortDate = () => {
    for (let i = 0; i < data.dates.length - 1; i++) {
        for (let j = 0; j < data.dates.length - i - 1; j++) {
            const date1 = data.dates[j].date;
            const date2 = data.dates[j + 1].date;

            if (compare(date1, date2) == true) {
                const temp = data.dates[j];
                data.dates[j] = data.dates[j + 1];
                data.dates[j + 1] = temp;
            }
        }
    }
};

app.get("/help", (req, res) => {
    res.render("help", { help });
});

app.get("/addItem/:name", (req, res) => {
    const name = req.params.name;
    res.render("addItem", { name });
});

app.get("/addFriend", (req, res) => {
    res.render("addFriend", { data });
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

app.get("/editProfile", (req, res) => {
    res.render("editProfile");
});

app.get("/addDate", (req, res) => {
    res.render("addDate", { data });
});

app.get("/removeWishlistItem/:itemName", (req, res) => {
    const itemName = req.params.itemName;

    for (let i = 0; i < data.me.wishlist.length; i++) {
        if (data.me.wishlist[i].name === itemName) {
            data.me.wishlist.splice(i, i + 1);
        }
    }

    res.render("profile", { data });
});

app.get("/removeListDetails/:name", (req, res) => {
    const name = req.params.name;

    for (let i = 0; i < data.me.wishlistIdeas.length; i++) {
        if (data.me.wishlistIdeas[i].name === name) {
            data.me.wishlistIdeas.splice(i, i + 1);
        }
    }

    res.render("profile", { data });
});

app.get("/removeListDetailsItem/:name/:itemName", (req, res) => {
    const name = req.params.name;
    const itemName = req.params.itemName;

    for (let i = 0; i < data.me.wishlistIdeas.length; i++) {
        for (let j = 0; j < data.me.wishlistIdeas[i].items.length; j++) {
            if (data.me.wishlistIdeas[i].items[j].name === itemName) {
                data.me.wishlistIdeas[i].items.splice(j, j + 1);
            }
        }
    }

    res.redirect("back");
});

let ifCalled = false;

app.get("/calendar", async (req, res) => {
    for (friend of data.friends) {
        let existed = false;
        for (date of data.dates) {
            if (date.name === friend.name + "'s " + "Birthday") {
                existed = true;
            }
        }
        if (!existed && !ifCalled) {
            const name = friend.name + "'s " + "Birthday";
            const date = friend.birthday;
            const description = "Wish " + friend.name + " a happy birthday!";
            const newDate = { name, date, description };
            data.dates.push(newDate);
        }
    }
    ifCalled = true;
    sortDate();
    res.render("calendar", { data });
});

app.get("/removeCalendarItem/:name/", (req, res) => {
    const name = req.params.name;

    for (let i = 0; i < data.dates.length; i++) {
        if (data.dates[i].name === name) {
            data.dates.splice(i, i + 1);
        }
    }

    res.render("calendar", { data });
});

http.createServer(app).listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
});
