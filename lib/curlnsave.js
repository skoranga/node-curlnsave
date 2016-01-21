'use strict';

var fs = require('fs-extra'),
    url = require('url'),
    path = require('path'),
    request = require('request'),
    assert = require('assert'),
    urlUtil = require('url');

function writeFileLocally (local, body) {
    try {
        fs.outputFileSync(local, body);
    } catch (e) {
        console.error('failed writing %s', local);
    }
}

var prototype = {

    fetch: function (uri, filename, callback) {
        var local, result = {};

        if (typeof filename === 'function') {
            callback = filename;
            filename = undefined;
        }

        if (!filename) {
            filename = url.parse(uri).pathname;
            filename = path.basename(filename);
            filename = filename || 'out.txt';
        }

        local = path.join(this.outdir, filename);
        result.name = local;
        if (fs.existsSync(local)) {
            fs.readFile(local, 'utf8', function (err, data) {
                result.data = data;
                result.isFromCache = true;
                callback(err, result);
            });
        } else {
            request({
                uri: uri,
                followRedirect: false
            }, function (err, resp, body) {
                var urlObj = urlUtil.parse(uri),
                    maskedURI = uri.replace(urlObj.auth, "xxx");

                if (err) {
                    console.error(err);
                }
                else if (resp && resp.statusCode !== 200) {
                    console.error('HTTP' + resp.statusCode + ' failed loading %s', uri);
                    err = new Error('HTTP' + resp.statusCode + ' failed loading %s', uri);
                }
                else {
                    console.log('%s -> %s', maskedURI, local);
                    writeFileLocally(local, body);

                    result.data = body;
                    result.isFromCache = false;
                }
                callback(err, result);
            });
        }
    }

};

exports.create = function (config) {
    assert.ok(config.outdir, 'A output dir must be provided.');

    if (!fs.ensureDirSync(config.outdir)) {
        fs.mkdirsSync(config.outdir);
    }

    return Object.create(prototype, {
        outdir: {
            value: config.outdir,
            enumerable: true,
            writable: false
        }
    });
};
