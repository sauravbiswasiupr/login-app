var nodemailer = require("nodemailer");

var mailer = {
  construct: function() {
    this.transport = nodemailer.createTransport("SMTP", {
      service: "Gmail", 
      auth   : {
        user: "sauravmaximus@gmail.com", 
        pass: "kerberos"
      }
    }); 
  }, 
  
  send: function(options, cb) {
    var self = this;
    self.transport.sendMail(
      options
    , function(err, result) {
      if (err)
        cb(err, null);
      else
        cb(null, null);
    });
  }
};
module.exports = mailer;
