var db = require("./db.js");
var uri = "mongodb://localhost/test";

describe("test the db api", function() {
 it("should connect to the test db successfully", function() {
   db.connect(uri, function(err, result) {
     expect(err).toBeNull();
   });

   db.close(function(err) {
     expect(err).toBeNull();
   });
 });
});
