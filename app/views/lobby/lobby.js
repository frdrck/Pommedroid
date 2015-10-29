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
  user: user
});

lobbyModel.loaded = function(args) {
  var page = args.object;
  page.bindingContext = lobbyModel;

  lobbyModel.set("message", "Pick a game.");
};

lobbyModel.loadLobby = function () {
  lobbyModel.set("message", "found 6 games");

  var formData = serialize({
    session: user.get("session"),
  });

  console.log("listing games", formData);

  http.request({
    url: config.LIST_URL,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    content: formData
  }).then(function(response) {
    console.log("list success", response.content);
    lobbyModel.set("message", response.content);

    var json = response.content.toJSON();
    console.log(json);
  }, function(error) {
    console.log("list error", error);
  });
};

exports.loaded = lobbyModel.loaded;
exports.loadLobby = lobbyModel.loadLobby;
