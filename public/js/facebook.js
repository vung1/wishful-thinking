function statusChangeCallback(response) {
    // Called with the results from FB.getLoginStatus().
    console.log("statusChangeCallback");
    console.log(response); // The current login status of the person.
    if (response.status === "connected") {
        // Logged into your webpage and Facebook.
        testAPI();
    } else {
        // Not logged into your webpage or we are unable to tell.
        // document.getElementById("status").innerHTML =
        //     "Please log " + "into this webpage.";
    }
}

function checkLoginState() {
    // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function (response) {
        // See the onlogin handler
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function () {
    FB.init({
        // appId: "2635607500063399",
        appId: "2635607500063399",
        cookie: true, // Enable cookies to allow the server to access the session.
        xfbml: true, // Parse social plugins on this webpage.
        version: "v3.2", // Use this Graph API version for this call.
    });

    FB.getLoginStatus(function (response) {
        // Called after the JS SDK has been initialized.
        statusChangeCallback(response); // Returns the login status.
    });
};

function testAPI() {
    // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log("Welcome!  Fetching your information.... ");
    FB.api("/me?fields=name,picture.width(480),birthday", function (response) {
        console.log("Successful login for: " + response.name);

        const name = response.name;
        const picture = response.picture.data.url;
        const birthday = response.birthday;
        console.log("This is my birthday " + birthday);

        // window.location = "/profile?name=" + name + "&profile_pic=" + picture;
    });
}

function logout() {
    FB.logout(function (response) {
        // user is now logged out
    });
}
