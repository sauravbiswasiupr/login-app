var redis = require("redis");

var cache = function() {
  this.client = redis.createClient();
  this.isRunning = true;
};

cache.prototype.set = function(cacheInfo, expireTime, cb) {
  var self = this; 
  self.client.set(cacheInfo.key, cacheInfo.value, function(err, result) {
    if (err)
      cb(err, null);
    else {
      self.client.expire(cacheInfo.key, expireTime);
      cb(null, true);
    }
  });
};

cache.prototype.get = function(key, cb) {
  var self = this; 
  
  self.client.get(key, function(err, result) {
    if (err)
      cb(err, null);
    else
      cb(err, result);
  });
}; 

cache.prototype.getAllKeys = function(cb) {
  var self = this; 

  self.client.keys("*", function(err, keys) {
    if (err)
      return cb(err);
    else 
      cb(null, keys);
  });
}; 

cache.prototype.stop = function(cb) {
  var self = this;

  self.client.keys("*", function(err, keys) {
    if (err)
      return cb(err);
    else {
      keys.forEach(function(key, pos) {
        self.client.del(key, function(err, o) {
          if (err) 
            return cb(err);
        });
      });
      self.isRunning = false;
      cb(null);
    }
  });
};
module.exports = cache;
