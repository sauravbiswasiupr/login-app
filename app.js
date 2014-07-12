var express = require("express");
var cache   = require("./cache.js");

var app = express();
app.set("view options", { layout: false });
app.use(express.static(__dirname + "/"));

app.use(express.bodyParser());
cache.construct(function(err, result) {});

app.get("/", function(req, res) {
  cache.construct(function(err, result) {});
  res.writeHead(200, {
    "Content-Type": "text/html"
  });
  //res.end("<h1>Welcome to this Page. Login or Signup</h1>");
  res.render("index.html");
});

app.post("/login", function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  
  cache.get(email, function(err, result) {
    if (err)
      console.log(err);
    else {
      var name = email.match(/.*\@/g)[0].slice(0, -1)
      if (result !== null)
        res.end("<h1>You are already logged in "+ name + "</h1><form name='Logout' method='post' action='/logout'><input type='submit' value='logout' /></form>");
      else {
        cache.set({ key: email, value: password }, 120000, function(err, result) {
          if (err)
            console.log(err);
          else
            res.end("<h1>Profile Page</h1><h2>Welcome " + name + "</h2><p>This is your profile page</p><form name='logout' method='post' action='/logout'><input type='submit' value='logout' /></form>");
        });
      }
    }
  });                                  
});

app.post("/logout", function(req, res) {
  //res.end("<h1>You are successfully logged out</h1>");
  res.redirect("/");
  cache.stop(function(err, result) {});
});

app.listen(3000, "127.0.0.1");
