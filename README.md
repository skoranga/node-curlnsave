node-curlnsave
==============

[![Build Status](https://travis-ci.org/skoranga/node-curlnsave.png)](https://travis-ci.org/skoranga/node-curlnsave)


Node module to curl a remote url and cache locally


### Usage

```javascript
    var curlnsave = require('curlnsave');

    var curl = curlnsave.create({ outdir: './localCache' });
    var uri = 'http://www.example.com';

    // first time this call will download and cache the url &
    // subsequent calls will use the cached copy.
    // result { name: 'local name', data: 'data body', isFromCache: true|false}
    curl.fetch(uri, function (err, result) {
        ...
        ...
    });
```
