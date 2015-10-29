var observable = require("data/observable");
var http = require("http");

var User = require("~/shared/view-models/user");
var user = new User();

var lobbyModel = new observable.Observable({
  user: user
});

lobbyModel.loaded = function(args) {
  var page = args.object;
  page.bindingContext = lobbyModel;

  lobbyModel.set("message", "Pick a game.");
};

lobbyModel.loadLobby = function () {
  console.log("lobby loaded");
  lobbyModel.set("message", "found 6 games");
};

exports.loaded = lobbyModel.loaded;
exports.loadLobby = lobbyModel.loadLobby;
