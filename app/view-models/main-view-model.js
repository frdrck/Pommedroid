var textFieldModule = require("ui/text-field");
var observable = require("data/observable");
var http = require("http");
var md5 = require("../lib/md5.js").md5;

var BASE_URL = "http://pomme.us:32123/"
var LOGIN_URL= BASE_URL + "user/login";
var POLL_URL = BASE_URL + "game/poll";

var mainViewModel = new observable.Observable();

mainViewModel.set("message", "Please enter a username");
mainViewModel.set("username", "asdfus");
mainViewModel.set("password", "");

var serialize = function (data) {
  return Object.keys(data).map(function (keyName) {
    return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
  }).join('&');
};

mainViewModel.login = function () {
    var username = mainViewModel.get("username");
    var password = mainViewModel.get("password");

    // md5 the password
    if (password) {
      password = md5("pomme" + password);
    }

    var formData = serialize({
        name: username,
        password: password
    });

    http.request({
      url: LOGIN_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      content: formData
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
