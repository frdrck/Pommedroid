var frameModule = require("ui/frame");
var observable = require("data/observable");

var User = require("~/shared/view-models/user");
var user = new User();

var loginModel = new observable.Observable({
  user: user
});

loginModel.loaded = function(args) {
  var page = args.object;
  page.bindingContext = loginModel;
  loginModel.set("message", "Please enter a username");
}

loginModel.login = function () {
  user.login().then(function(response) {
    loginModel.set("message", "Session: " + user.get("session"));

    var topmost = frameModule.topmost();
    topmost.navigate("views/lobby/lobby");
  }, function(error) {
    console.log("login view fail");
  });
};

loginModel.loadLobby = function () {
  console.log("reload lobby");
};

exports.loaded = loginModel.loaded;
exports.login = loginModel.login;
exports.loadLobby = loginModel.loadLobby;
