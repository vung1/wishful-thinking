const { response } = require("express");
var data = require("../data.json");

exports.addFriend = function (request, response) {
    newItem = {
        name: request.query.name,
        birthday: request.query.birthday,
        month: request.query.month,
        profileImage:
            "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
        wishlist: request.query.month,
        id: request.query.month,
    };

    data.friends.push(newFriend);
    response.render("index", data);
};
