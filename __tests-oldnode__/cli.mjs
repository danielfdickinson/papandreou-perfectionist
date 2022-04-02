import path from 'path';
import {readFileSync as read} from 'fs';
import ava from 'ava';
import {execa as execa} from 'execa';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const requireShim = createRequire(import.meta.url);
const versionString = requireShim('../package.json').version;

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = path.resolve(path.join(__dirname, './../__tests__/fixtures/nested.fixture.css'));

function setup (args) {
    return execa(path.resolve(path.join(__dirname, '../bin/cmd.js')), args, {stripEof: false, cwd: __dirname, stripFinalNewline: false});
}

ava('cli: version', t => {
    return setup(['--version']).then(({stdout}) => {
        t.deepEqual(stdout, versionString + '\n', 'should report the package version');
    });
});

ava('cli: help', t => {
    return setup(['--help']).then(({stdout}) => {
        t.deepEqual(stdout, read(path.resolve(path.join(__dirname, './../bin/usage.txt')), 'utf-8'), 'should report the help (usage) text');
    });
});

ava('cli: defaults', t => {
    return setup([fixture]).then(({stdout}) => {
        t.deepEqual(stdout, read(path.resolve(path.join(__dirname, './../__tests__/fixtures/nested.expanded.css')), 'utf-8'), 'should transform the css');
    });
});

ava('cli: formatter', t => {
    return setup([fixture, '--format', 'compressed']).then(({stdout}) => {
        t.deepEqual(stdout, read(path.resolve(path.join(__dirname, './../__tests__/fixtures/nested.compressed.css')), 'utf-8'), 'should transform the css');
    });
});

ava('cli: sourcemaps', t => {
    return setup([fixture, '--sourcemap']).then(({stdout}) => {
        const hasMap = /sourceMappingURL=data:application\/json;base64/.test(stdout);
        t.truthy(hasMap, 'should generate a sourcemap');
    });
});
