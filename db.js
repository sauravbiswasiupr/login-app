var mongoose = require("mongoose");

var Db = {
  connect: function(uri, cb) {
    var self = this;
    mongoose.connect(uri);
    this.db = mongoose.connection;

    this.db.on("error", function(err) {
      cb(err, null);
    });

    this.db.once("open", function(result) {
      cb(null, result);
    });
  }, 
  
  close: function(cb) {
    var self = this;
    self.db.close(function() {
      cb(null);
    });
  }
};
module.exports = Db;
