import ava from 'ava';
import { createRequire } from 'module';
import semver from 'semver';
import pluginNewNode from '../src/index.mjs';

const requireShim = createRequire(import.meta.url);
const pluginOldNode = requireShim('..');

var plugin;

if (semver.gt(process.version, '16.0.0')) {
    plugin = pluginNewNode;
} else {
    plugin = pluginOldNode;
}

let tests = [{
    message: 'should have a configurable indent size',
    fixture: 'h1{color:black}',
    expected: 'h1 {\n  color: black;\n}\n',
    options: {indentSize: 2},
}, {
    message: 'should have a configurable indent type',
    fixture: 'h1{color:black}',
    expected: 'h1 {\n	color: black;\n}\n',
    options: {indentChar: '\t', indentSize: 1},
}, {
    message: 'should allow disabling of the cascade',
    fixture: 'h1{-webkit-border-radius: 12px; border-radius: 12px; }',
    expected: 'h1 {\n    -webkit-border-radius: 12px;\n    border-radius: 12px;\n}\n',
    options: {cascade: false},
}, {
    message: 'should convert hex colours to uppercase',
    fixture: 'h1{color:#fff}',
    expected: 'h1 {\n    color: #FFF;\n}\n',
    options: {colorCase: 'upper'},
}, {
    message: 'should expand shorthand hex',
    fixture: 'h1{color:#fff}',
    expected: 'h1 {\n    color: #ffffff;\n}\n',
    options: {colorShorthand: false},
}, {
    message: 'should expand shorthand hex',
    fixture: 'h1{color:#ffffff}',
    expected: 'h1 {\n    color: #ffffff;\n}\n',
    options: {colorShorthand: false},
}, {
    message: 'should not remove units from zero lengths',
    fixture: 'h1{width:0px}',
    expected: 'h1 {\n    width: 0px;\n}\n',
    options: {zeroLengthNoUnit: false},
}, {
    message: 'should add leading zeroes',
    fixture: 'h1{width:.5px}',
    expected: 'h1 {\n    width: 0.5px;\n}\n',
    options: {trimLeadingZero: false},
}, {
    message: 'should not trim trailing zeroes',
    fixture: 'h1{width:10.000px}',
    expected: 'h1 {\n    width: 10.000px;\n}\n',
    options: {trimTrailingZeros: false},
}];

let mapTests = [{
    message: 'should expand css',
    fixture: 'h1{color:black}',
    options: {map: true},
}, {
    message: 'should expand css (2)',
    fixture: 'h1{color:black}',
    options: {map: false, sourcemap: true},
}];

function perfectionistDFD (css, options) {
    return plugin.process(css, options).css;
}

ava('perfectionistDFD options', (t) => {
    tests.forEach(({fixture, expected, options, message}) => {
        t.deepEqual(perfectionistDFD(fixture, options || {}), expected, message);
    });
});

ava('perfectionistDFD map options', (t) => {
    mapTests.forEach(({fixture, options, message}) => {
        const hasMap = /sourceMappingURL=data:application\/json;base64/.test(perfectionistDFD(fixture, options || {}));
        t.truthy(hasMap, message);
    });
});
