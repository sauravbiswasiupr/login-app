var redis = require("redis");

var cache = function() {
  cache.prototype.construct = function(cb) {
    var self = this; 
    self.client = redis.createClient();
    self.isRunning = true;
    cb(null, true);
  }; 

  cache.prototype.set = function(cacheInfo, expireTime, cb) {
    var self = this; 
    self.client.set(cacheInfo.key, cacheInfo.value);
    self.client.expire(cacheInfo.key, expireTime);
    cb(null, true);
  };

  cache.prototype.get = function(key, cb) {
    var self = this; 
    self.client.get(key, function(err, result) {
      if (err)
        cb(err, null);
      else {
        if (result !== null)
          cb(err, result);
        else
          cb(err, null);
      }
    });
  }; 

  cache.prototype.stop = function(cb) {
    var self = this; 
    self.client.keys("*", function(err, keys) {
      keys.forEach(function(key, pos) {
        self.client.del(key, function(err, o) {
          if (err)
            cb(err, null);
          else {
            self.isRunning = false;
            cb(null, null);
          }
        });
      });
    });
  }
};
module.exports = cache;
