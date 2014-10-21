"use strict";

var mongoose = require("mongoose"); 
var Schema   = mongoose.Schema; 
var form; 

var formSchema = new Schema({
  author    : String, 
  questions : [String]
});

form = mongoose.model("Form", formSchema);

exports.form = form; 
