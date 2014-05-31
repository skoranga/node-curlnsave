'use strict';

var fs = require('fs'),
    url = require('url'),
    path = require('path'),
    needle = require('needle'),
    assert = require('assert');


var prototype = {

    fetch: function (uri, filename, callback) {
        var local;

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
        if (fs.existsSync(local)) {
            fs.readFile(local, 'utf8', function (err, data) {
                callback(err, data, true);
            });
        } else {
            needle.get(uri, { output: local }, function (err, resp, body) {
                err || console.log('%s -> %s', uri, local);
                callback(err, body, false);
            });
        }
    }

};

exports.create = function (config) {
    assert.ok(config.outdir, 'A output dir must be provided.');

    if (!fs.existsSync(config.outdir)) {
        fs.mkdirSync(config.outdir);
    }

    return Object.create(prototype, {
        outdir: {
            value: config.outdir,
            enumerable: true,
            writable: false
        }
    });
};