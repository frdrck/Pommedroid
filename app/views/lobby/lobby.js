var observableArrayModule = require("data/observable-array");
var observable = require("data/observable");
var http = require("http");

var config = require("~/shared/config");
var User = require("~/shared/view-models/user");
var user = new User();

// util. refactor.
var serialize = function (data) {
  return Object.keys(data).map(function (keyName) {
    return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
  }).join('&');
};


var lobbyModel = new observable.Observable({
  user: user,
  games: new observableArrayModule.ObservableArray()
});

lobbyModel.loaded = function(args) {
  var page = args.object;
  page.bindingContext = lobbyModel;

  lobbyModel.set("message", "Pick A Game");

  lobbyModel.loadLobby();
};

lobbyModel.loadLobby = function () {
  var formData = serialize({
    session: user.get("session"),
  });

  http.request({
    url: config.LIST_URL,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    content: formData
  }).then(function(response) {
    var json = response.content.toJSON();

    var games = [];
    for (var game in json.games) {
      if (game !== "lobbychat") {
        games.push({
          name: game,
          players: json.games[game].players.length,
          capacity: json.games[game].capacity
        });
      }
    }

    lobbyModel.set("games", new observableArrayModule.ObservableArray(games));
  });
};

exports.loaded = lobbyModel.loaded;
exports.loadLobby = lobbyModel.loadLobby;
