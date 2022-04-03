#!/usr/bin/env node

var fs = require('fs');
var read = require('read-file-stdin');
var write = require('write-file-stdout');
var perfectionistDFD = require('../dist/perfectionist-dfd.min.js');

var opts = require('minimist')(process.argv.slice(2), {
    alias: {
        f: 'format',
        h: 'help',
        s: 'sourcemap',
        t: 'syntax',
        v: 'version'
    }
});

if (opts.version) {
    process.exit(console.log(require('../package.json').version));
}

var file = opts._[0];
var out  = opts._[1];

if (file === 'help' || opts.help) {
    const reader = fs.createReadStream(__dirname + '/usage.txt');
    reader.pipe(process.stdout);
    reader.on('end', () => {
        process.exit(0);
    });
}

read(file, function (err, buf) {
    if (err) {
        throw err;
    }
    if (file) {
        opts.from = file;
    }
    if (out) {
        opts.to = out;
    }
    write(out, String(perfectionistDFD.process(String(buf), opts)));
});
