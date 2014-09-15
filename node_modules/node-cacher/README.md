A node.js module that lets you store data in a cache and can be used in conjunction with any server that you write.

[![Build Status](https://travis-ci.org/sauravbiswasiupr/node-cacher.svg)](https://travis-ci.org/sauravbiswasiupr/node-cacher)

##Installation

```bash
$ npm install node-cacher
```
##Usage

```js
var Cache = require("node-cacher");

var cache = new Cache();

cache.set({ key: "TEST", value: "TEST" }, 1000, function(err, result) {});
cache.get({ "TEST", function(err, result) {});
```
#Result

The key value pair can be stored in the cache for a time of x seconds, where x is 1000 in this case

## License

The MIT License (MIT)

Copyright (c) 2014  Saurav Biswas <sauravmaximus@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
