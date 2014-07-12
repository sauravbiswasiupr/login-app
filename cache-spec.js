var cache = require("./cache");

var cacheInfo = {
  key  : "TEST", 
  value: "TEST"
};

describe("Test the cache API", function() {
  it("should set a key value and retrieve it", function() {
    var initialized = false;
    var set;
    var got;
    runs(function() {
      cache.construct(function(err, result) {
        expect(err).toBeNull();
        initialized = true;
      });
    });

    waitsFor(function() {
      return initialized;
    });

    runs(function() {
      cache.set(cacheInfo, 1000, function(err, result) {
        expect(err).toBeNull();
        set = true;
        expect(result).toBeTruthy();
        cache.get(cacheInfo.key, function(err, result) {
          expect(err).toBeNull();
          expect(result).toEqual("TEST");
          got = true;
        });
      });
    });

    waitsFor(function() {
      return got && set;
    });

    runs(function() {
      cache.stop(function(err, result) {
        expect(err).toBeNull();
      });
    });

    waitsFor(function() {
      return !cache.isRunning;
    });
  });
});
