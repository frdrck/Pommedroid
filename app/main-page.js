var vmModule = require("./views/login/login");

function pageLoaded(args) {
  var page = args.object;
  page.bindingContext = vmModule.loginModel;
}

exports.pageLoaded = pageLoaded;
