var textFieldModule = require("ui/text-field");
var observable = require("data/observable");
var http = require("http");

var BASE_URL = "http://pomme.us:32123/"
var LOGIN_URL= BASE_URL + "user/login";
var POLL_URL = BASE_URL + "game/poll";

var mainViewModel = new observable.Observable();

mainViewModel.set("message", "Please enter a username");
mainViewModel.set("username", "moon");
mainViewModel.set("password", "teveaver");

var serialize = function (data) {
  return Object.keys(data).map(function (keyName) {
    return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
  }).join('&');
};

mainViewModel.login = function () {
    var username = mainViewModel.get("username");
    var password = mainViewModel.get("password");

    console.log("fetching", LOGIN_URL);
    console.log("username:", username);
    console.log("password:", password)

    http.request({
      url: LOGIN_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      content: serialize({
        name: mainViewModel.get("username"),
        password: mainViewModel.get("password")
      })
    }).then(function(response) {
      var json = response.content.toJSON();

      // successful login
      if (json.session) {
        mainViewModel.set("message", "Session: " + json.session);
      // unsuccessful
      } else if (json.error) {
        if (json.error === "password") {
          mainViewModel.set("message", "This account requires a password.");
        } else if (json.error === "bad_password") {
          mainViewModel.set("message", "Incorrect password. Try again.");
        } else if (json.error === "illegal") {
          mainViewModel.set("message", "Illegal username. Pick another.");
        } else {
          mainViewModel.set("message", "Error. Try Again.");
        }
      }
    }, function(error) {
      console.log("error:", error);
    });
};
exports.mainViewModel = mainViewModel;
