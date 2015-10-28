var textFieldModule = require("ui/text-field");
var observable = require("data/observable");
var http = require("http");

var BASE_URL = "http://pomme.us:32123/"
var LOGIN_URL= BASE_URL + "user/login";
var POLL_URL = BASE_URL + "game/poll";

var mainViewModel = new observable.Observable();

mainViewModel.set("username", "asdfus");
mainViewModel.set("password", "");
mainViewModel.set("message", "Please enter a username");

var serialize = function (data) {
  return Object.keys(data).map(function (keyName) {
    return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
  }).join('&');
};

mainViewModel.login = function () {
    console.log("fetching", LOGIN_URL);
    console.log("username:", mainViewModel.get("username"));
    console.log("password:", mainViewModel.get("password"));

    http.request({
      url: LOGIN_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      content: serialize({
        name: mainViewModel.get("username")
        //password: mainViewModel.get("password"),
      })
    }).then(function(response) {
      var json = response.content.toJSON();

      // successful login
      if (json.session) {
        mainViewModel.set("message", "session" + json.session);
        console.log("message", "session" + json.session);
      // unsuccessful
      } else if (json.error) {
        if (json.error === "password") {
          mainViewModel.set("message", "Requires Password: " + json.error);
          console.log("message", "Requires Password: " + json.error);
        } else if (json.error === "bad_password") {
          mainViewModel.set("message", "Bad Password: " + json.error);
          console.log("message", "Bad Password: " + json.error);
        } else if (json.error === "illegal") {
          mainViewModel.set("message", "Illegal:" + json.error);
          console.log("message", "Illegal:" + json.error);
        } else {
          mainViewModel.set("message", "Error: " + json.error);
          console.log("message", "Error: " + json.error);
        }

        for (var key in json) {
          console.log("key:", key, json[key]);
        }
      }
    }, function(error) {
      console.log("error:", error);
    });
};
exports.mainViewModel = mainViewModel;
