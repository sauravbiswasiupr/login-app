var express = require("express");
var Cache   = require("node-cacher");
var mailer  = require("./mailer.js");
var mongoose = require("mongoose");
var crypto  = require("crypto");
var fs      = require("fs");
var form    = require("./schema").form; 

var generateHTML = require("./template").generateHTML; 
var exec    = require("child_process").exec;
var child; 

var token, secretKey;
var route = "localhost:3000/signup";
var cache = new Cache(); 

var generateToken = function() {
  var text = "I love to play";
  var key  = "abcdefg";
  hash = crypto.createHmac("sha1", key).update(text).digest("hex");
  return hash;
};

var app = express();
mongoose.connect("mongodb://localhost/dashboard");

var questionnaire = new form; 

app.set("view options", { layout: false });
app.use(express.static(__dirname + "/"));

app.use(express.bodyParser());

token = generateToken();

app.get("/", function(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/html"
  });
  res.render("index.html");
});

app.post("/admin", function(req, res) {
  var admEmail = req.body.email; 
  var name = admEmail.match(/.*\@/g)[0].slice(0, -1);
  if (name === "admin")
    res.sendfile("admin.html");
  else
    res.redirect("/");
});

app.get("/createForm", function(req, res) {
  res.sendfile("welcome-admin.html");
});

app.post("/createform/postvals", function(req, res) {
  var qlist = [];
  for (var i = 0; i < req.body.body.length; i++) {
    questionnaire.questions.push(req.body.body[i]);
    qlist.push(req.body.body[i]);
  }

  console.log("questions: ", qlist);

  questionnaire.save(function(err) {
    if (err)
      console.log(err);
    else {
      console.log("saved to db");
      res.send("success");
    }
  }); 
});

app.post("/signup", function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  secretKey =  email.match(/.*\@/g)[0].slice(0, -1) + token; 
  
  mailer.construct();
  var options = {
    from   : "YOUR EMAIL", 
    to     : email, 
    subject: "Registration email", 
    html   : "<html><head></head><body>Hi ! Thank you for signing up. Please click on the confirmation link to signup <a href='http://localhost:3000/signup/"+ token + "'>Confirm your registration</a></body></html>"
  };
  mailer.send(options, function(err, result) {
    if (err)
      console.log(err);
    else {
      route = route + "/" + token;
      res.send("<h1>You have been sent an email with a confirmation link</h1>");
    
    }
  });
});

app.get("/signup/:token", function(req, res) {
  setTimeout(function() {
    res.redirect("/login/submitForm");
  }, 2000);
});

app.post("/login", function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  secretKey =  email.match(/.*\@/g)[0].slice(0, -1) + token; 
  
  cache.get(email, function(err, result) {
    if (err)
      console.log(err);
    else {
      var name = email.match(/.*\@/g)[0].slice(0, -1)
      if (result !== null)
        res.end("<h1>You are already logged in "+ name + "</h1><h2>Go to Questionnaire</h2><a href='/login/submitForm'>Questionnaire</a>");
      else {
        cache.set({ key: email, value: password }, 120000, function(err, result) {
          if (err)
            console.log(err);
          else
            res.end("<h1>Profile Page</h1><h2>Welcome " + name + "</h2><p>This is your profile page</p><div><a href='/login/submitForm'>Try out our survey</a></div>");
        });
      }
    }
  });                                  
});

app.get("/login/submitForm", function(req, res) {
  //res.sendfile("form.html");
  // generate html from template and send back
  // to user.
  form.find(function(err, data) {
    if (err)
      console.log("Error while querying db: ", err);
    else {
      var resp = data[0].questions;
      var html = generateHTML(resp);
      res.send(html);
    }
  });
});

app.post("/login/submitForm/results", function(req, res) {
  console.log("REQ payload: ", req.body);   
  var ans = {};
  for (var i = 0; i < req.body.answer.length; i++) {
    var id = "answer_" + (i+1).toString();
    ans[id] = req.body.answer[i];
  }
  cache.set({ key: secretKey, value: JSON.stringify(ans) }, 120000, function(err, result) {
    if (err)
      console.log("Error: ", err);
    else
      res.send("<h1>Thanks for your response. Your answers have been recorded. You can close the browser now.</h1><br>");
  });
});

app.post("/logout", function(req, res) {
  res.redirect("/");
  cache.stop(function(err, result) {});
});

app.get("/seeResults", function(req, res) {
  form.find(function(err, data) {
    var length = data[0].questions.length;
    var keys;

    var myKeys = [];
    for (var i = 0; i < length; i++)
      myKeys.push("answer_" + (i+1).toString());

    var userResponse = {};
    var admName = "admin"; 
    if (admName !== "admin")
      res.redirect("/");
    else {
      cache.getAllKeys(function(err, cacheKeys) {
        if (err)
          console.log(err);
        else {
          keys = cacheKeys;
          keys.forEach(function(key, pos) {
           if (key.match(/.*\@.*/) === null) {
            cache.get(key, function(err, result) {

              var result = JSON.parse(result);
              userResponse[key] = [];
              for (var i = 0; i < myKeys.length; i++) {
                if (key !== "submit")
                  userResponse[key].push(result[myKeys[i]]);
              }
              console.log("USERRESPONSE: ", userResponse);
            });
           }
          });
          setTimeout(function() {
            fs.writeFile("data.txt", JSON.stringify(userResponse), function(err) {
              if (err)
                console.log("Error while writing to file: ", err);
              else {
                res.send("<h1>Welcome to your dashboard admin</h1><a href='/seeResults/plot'>See results</a>");
              }
            });
          }, 1000);
        }
      });
    }
  });
});

app.get("/seeResults/plot", function(req, res) {
  child = exec("python createPlot.py", function(err, stdout, stderr) {
    if (err)
      console.log("Error while creating plot: ", err);
  });
  res.sendfile("img.html");
});

app.listen(3000, "127.0.0.1");
