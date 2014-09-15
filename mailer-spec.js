var mailer = require("./mailer.js");

describe("should test the mailer API",  function() {
  it("should send mail successfully", function() {
    mailer.construct();
    var options = {
      from   : "sauravmaximus@gmail.com", 
      to     : "saurav.iitkgp2k7@gmail.com", 
      subject: "TEST EMAIL", 
      html   : "<html><head><title></title></head><body>Hi from nodemailer</body></html>"
    }; 
    mailer.send(options, function(err, result) {
      expect(err).toBeNull();
    });
  });
});
