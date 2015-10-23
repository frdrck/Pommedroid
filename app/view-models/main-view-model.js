var textFieldModule = require("ui/text-field");
var observable = require("data/observable");
var http = require("http");

var BASE_URL = "http://pomme.us:32123/"
var LOGIN_URL= BASE_URL + "login";
var POLL_URL = BASE_URL + "game/poll";

var mainViewModel = new observable.Observable();

mainViewModel.set("username", "asdfus");
mainViewModel.set("password", "");
mainViewModel.set("message", "You must log in.");

mainViewModel.login = function () {
    console.log("fetching");
    console.log("username:", mainViewModel.get("username"));
    console.log("password:", mainViewModel.get("password"));

    http.request({
      url: POLL_URL,
      method: "POST",
      content: JSON.stringify({
        username: mainViewModel.get("username"),
        password: mainViewModel.get("password"),
      })
    }).then(function(response) {
      console.log("response:", response);
      var json = response.content.toJSON();

      if (json.error) {
        mainViewModel.set("message", "Error: " + json.error);
      }

      for (var key in json) {
        console.log("key:", key, json[key]);
      }
    }, function(error) {
      console.log("error:", error);
    });
};
exports.mainViewModel = mainViewModel;
