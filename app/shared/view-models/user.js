var applicationSettings = require("application-settings");
var observable = require("data/observable");

var http = require("http");

var config = require("~/shared/config");
var md5 = require("~/lib/md5.js").md5;

// util function
var serialize = function (data) {
  return Object.keys(data).map(function (keyName) {
    return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
  }).join('&');
};

function User() {
  var savedEmail = applicationSettings.getString("username", "");
  var savedPassword = applicationSettings.getString("password", "");
  var savedSession = applicationSettings.getString("session", "");

  // You can add properties to observables on creation
  var viewModel = new observable.Observable({
      username: savedEmail,
      password: savedPassword,
      session: savedSession
  });

  viewModel.addEventListener(observable.Observable.propertyChangeEvent, function (ev) {
    var property = ev.propertyName.toString();
    var newValue = ev.value.toString();

    if (property === "username" || property === "password" || property === "session") {
      console.log("setting:", property, newValue);
      applicationSettings.setString(property, newValue);
    }
  });

  viewModel.login = function() {
    console.log("user login");

    var username = viewModel.get("username");
    var password = viewModel.get("password");

    // md5 the password
    if (password) {
      password = md5("pomme" + password);
    }

    var formData = serialize({
        name: username,
        password: password
    });

    return http.request({
      url: config.LOGIN_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      content: formData
    }).then(function(response) {
      var json = response.content.toJSON();

      // successful login
      if (json.session) {
        console.log("login success. session:", json.session);

        viewModel.set("session", json.session);
      // unsuccessful
      } else if (json.error) {
        console.log("error", json.error);

        if (json.error === "password") {
          viewModel.set("message", "This account requires a password.");
        } else if (json.error === "bad_password") {
          viewModel.set("message", "Incorrect password. Try again.");
        } else if (json.error === "illegal") {
          viewModel.set("message", "Illegal username. Pick another.");
        } else {
          viewModel.set("message", "Error. Try Again.");
        }
      }
    }, function(error) {
      console.log("error:", error);
    });
  };

  return viewModel;
}

module.exports = User;
