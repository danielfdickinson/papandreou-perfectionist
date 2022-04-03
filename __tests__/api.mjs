import postcss from 'postcss';
import ava from 'ava';
import { createRequire } from 'module';
import perfectionistDFDNewNode from '../src/index.mjs';
import semver from 'semver';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');
const perfectionistDFDOldNode = require('..');

var perfectionistDFD;

if (semver.gt(process.version, '16.0.0')) {
    perfectionistDFD = perfectionistDFDNewNode;
} else {
    perfectionistDFD = perfectionistDFDOldNode;
}

function usage (t, instance) {
    const input = 'h1 { color: #fff }';
    return instance.process(input).then(({css}) => {
        t.deepEqual(css, 'h1 {\n    color: #fff;\n}\n', 'should be consumed');
    });
}

ava('can be used as a postcss plugin', usage, postcss().use(perfectionistDFD()));
ava('can be used as a postcss plugin (2)', usage, postcss([ perfectionistDFD() ]));
ava('can be used as a postcss plugin (3)', usage, postcss([ perfectionistDFD ]));

ava('should use the postcss plugin api', t => {
    t.truthy(perfectionistDFD().postcssVersion, 'should be able to access version');
    t.deepEqual(perfectionistDFD().postcssPlugin, pkg.name, 'should be able to access name');
});
