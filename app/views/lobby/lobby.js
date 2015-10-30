var observableArrayModule = require("data/observable-array");
var observable = require("data/observable");
var http = require("http");
var formurlencoded = require('form-urlencoded/index');
var _ = require('lodash/index');

var config = require("~/shared/config");
var User = require("~/shared/view-models/user");
var user = new User();

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
  var formData = formurlencoded.encode({
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

lobbyModel.join = function(args) {
  console.log("clicked join");

  // error on this next line vv
  //var item = args.view.bindingContext;
  //var index = lobbyModel.games.indexOf(item);
  //console.log("item:", item);
  //console.log("name:", lobbyModel.games[index].name);
};

exports.loaded = lobbyModel.loaded;
exports.loadLobby = lobbyModel.loadLobby;
exports.join = lobbyModel.join;
