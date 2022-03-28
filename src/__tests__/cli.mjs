import path from 'path';
import {readFileSync as read} from 'fs';
import ava from 'ava';
import {execa as execa} from 'execa';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = path.resolve(path.join(__dirname, './fixtures/nested.fixture.css'));

function setup (args) {
    return execa(path.resolve(path.join(__dirname, '../../bin/cmd.js')), args, {stripEof: false, cwd: __dirname, stripFinalNewline: false});
}

ava('cli: defaults', t => {
    return setup([fixture]).then(({stdout}) => {
        t.deepEqual(stdout, read(path.resolve(path.join(__dirname, './fixtures/nested.expanded.css')), 'utf-8'), 'should transform the css');
    });
});

ava('cli: formatter', t => {
    return setup([fixture, '--format', 'compressed']).then(({stdout}) => {
        t.deepEqual(stdout, read(path.resolve(path.join(__dirname, './fixtures/nested.compressed.css')), 'utf-8'), 'should transform the css');
    });
});

ava('cli: sourcemaps', t => {
    return setup([fixture, '--sourcemap']).then(({stdout}) => {
        const hasMap = /sourceMappingURL=data:application\/json;base64/.test(stdout);
        t.truthy(hasMap, 'should generate a sourcemap');
    });
});
