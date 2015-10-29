var textFieldModule = require("ui/text-field");
var observable = require("data/observable");
var http = require("http");

var BASE_URL = "http://pomme.us:32123/"
var LIST_URL = BASE_URL + "game/list";

var lobbyModel = new observable.Observable();

lobbyModel.set("message", "Please enter a username");

lobbyModel.login = function () {
    http.request({
      url: LIST_URL,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
    }).then(function(response) {
      var json = response.content.toJSON();

      // successful login
      if (json.session) {
        lobbyModel.set("message", "Session: " + json.session);
      // unsuccessful
      } else if (json.error) {
        if (json.games) {
          console.log("games:", json.games.length, json.games);
        } else {
          lobbyModel.set("message", "Error. Try Again.");
        }
      }
    }, function(error) {
      console.log("error:", error);
    });
};

exports.lobbyModel = lobbyModel;
