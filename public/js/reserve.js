$(document).ready(function () {
    $.getJSON("../data.json", function (data) {});
    // Bind click event on all the buttons inside .card
    $(".wishlist button").click(function () {
        $.getJSON("../data.json", function (data) {});
        // Check if the clicked button has class `btn_s`
        if ($(this).hasClass("btn-success")) {
            $(this).html("Reserved").toggleClass("btn-success btn-danger");

            $(data.statements).each(function (i) {
                var d = data.statements[i];
                $.each(d, function (k, v) {
                    //get key and value of object
                    $("body").append("<p>" + k + ":" + v + "</p>");
                });
            });
        } else {
            $(this).html("Unreserved").toggleClass("btn-danger btn-success");
        }
    });
});

// $(data.statements).each(function (i) {
//     var d = data.statements[i];
//     $.each(d, function (k, v) { //get key and value of object
//         $("body").append("<p>"+k + ":" + v+"</p>");
//     });
// })
