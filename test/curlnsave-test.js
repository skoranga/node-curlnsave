/*global describe: false, it: false, before: false, after: false*/
'use strict';

var fs = require('fs-extra'),
    url = require('url'),
    path = require('path'),
    curlnsave = require('../lib/curlnsave'),
    assert = require('chai').assert;

var URLS = {
    sample1: 'https://github.com/skoranga',
    sample2: 'http://www.ebay.com'
};


describe('curlnsave', function () {

    describe('fetch', function () {

        var curl, testOutDir = './test/tempfolder';

        before(function () {
            fs.deleteSync(testOutDir);
            curl = curlnsave.create({ outdir: testOutDir });
        });


        after(function () {
            fs.deleteSync(testOutDir);
        });


        it('should load and cache remote files', function (next) {
            this.timeout(5000);
            var uri, filename, location;

            uri = URLS.sample1;
            filename = url.parse(uri).pathname;
            filename = path.basename(filename);
            location = path.join(testOutDir, filename);

            curl.fetch(uri, function (err, result) {
                assert.isNotObject(err);
                assert.isDefined(result.name);
                assert.isDefined(result.data);
                assert.isFalse(result.isFromCache);
                assert.isTrue(fs.existsSync(location));

                next();
            });
        });


        it('should support an optional local name', function (next) {
            this.timeout(5000);
            var uri, filename, location;

            uri = URLS.sample2;
            filename = 'smurf.txt';
            location = path.join(testOutDir, filename);

            curl.fetch(uri, filename, function (err, result) {
                assert.isNotObject(err);
                assert.isDefined(result.name);
                assert.isDefined(result.data);
                assert.isFalse(result.isFromCache);
                assert.isTrue(fs.existsSync(location));

                next();
            });
        });


        it('should serve previously requested files from disk', function (next) {
            this.timeout(5000);
            var uri, filename, location;

            uri = URLS.sample2;
            filename = 'smurf.txt';
            location = path.join(testOutDir, filename);

            curl.fetch(uri, filename, function (err, result) {
                assert.isNotObject(err);
                assert.isDefined(result.name);
                assert.isDefined(result.data);
                assert.isTrue(result.isFromCache);
                assert.isTrue(fs.existsSync(location));

                next();
            });
        });

    });

});