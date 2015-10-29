var textFieldModule = require("ui/text-field");
var observable = require("data/observable");
var http = require("http");
var md5 = require("~/lib/md5.js").md5;

var BASE_URL = "http://pomme.us:32123/"
var LOGIN_URL= BASE_URL + "user/login";
var POLL_URL = BASE_URL + "game/poll";

var loginModel = new observable.Observable();

loginModel.set("message", "Please enter a username");
loginModel.set("username", "asdfus");
loginModel.set("password", "");

var serialize = function (data) {
  return Object.keys(data).map(function (keyName) {
    return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
  }).join('&');
};

loginModel.login = function () {
    var username = loginModel.get("username");
    var password = loginModel.get("password");

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
        loginModel.set("message", "Session: " + json.session);
      // unsuccessful
      } else if (json.error) {
        if (json.error === "password") {
          loginModel.set("message", "This account requires a password.");
        } else if (json.error === "bad_password") {
          loginModel.set("message", "Incorrect password. Try again.");
        } else if (json.error === "illegal") {
          loginModel.set("message", "Illegal username. Pick another.");
        } else {
          loginModel.set("message", "Error. Try Again.");
        }
      }
    }, function(error) {
      console.log("error:", error);
    });
};

exports.loginModel = loginModel;
