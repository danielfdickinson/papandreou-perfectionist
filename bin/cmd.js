#!/usr/bin/env node

const fs = require('fs');
const {exit} = require('process');
const postcss = require('postcss');
const read = require('read-file-stdin');
const write = require('write-file-stdout');

const opts = require('minimist')(process.argv.slice(2), {
    alias: {
        f: 'format',
        h: 'help',
        s: 'sourcemap',
        t: 'syntax',
        v: 'version',
    },
});

const perfectionist = require('../dist');

if (opts.version) {
    exit(console.log(require('../package.json').version));
}

let file = opts._[0];
let out  = opts._[1];

if (file === 'help' || opts.help) {
    exit(fs.createReadStream(__dirname + '/usage.txt')
        .pipe(process.stdout)
        .on('close', () => {
            process.exit(1);
        }));
}

let procopts = {};

if (opts.syntax === 'scss') {
    procopts.syntax = require('postcss-scss');
}

read(file, (err, buf) => {
    if (err) {
        throw err;
    }
    if (file) {
        opts.from = file;
    }
    if (out) {
        opts.to = out;
    }
    write(out, String(postcss([perfectionist(opts)]).process(String(buf), procopts)));
});
