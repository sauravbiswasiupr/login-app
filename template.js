"use strict"; 

var _ = require("lodash");
var path = require("path");
var fs   = require("fs");

var template  = path.join(__dirname + "/form.html");
var uTemplate = _.template(fs.readFileSync(template));

var generateHTML = function(data) {
  return uTemplate({
    data: data
  });
}; 
exports.generateHTML = generateHTML; 

