import path from 'path';
import fs from 'fs';
import ava from 'ava';
import postcss from 'postcss';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import semver from 'semver';
import pluginNewNode from '../src/index.mjs';

const requireShim = createRequire(import.meta.url);
const pluginOldNode = requireShim('..');

var plugin;

if (semver.gt(process.version, 'v16.0.0')) {
    plugin = pluginNewNode;
} else {
    plugin = pluginOldNode;
}

function perfectionistDFD (css, options) {
    return plugin.process(css, options).css;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const base = path.resolve(path.join(__dirname,'./fixtures'));

let specs = fs.readdirSync(base).reduce((tests, css) => {
    let [spec, style] = css.split('.');
    if (!tests[spec]) {
        tests[spec] = {};
    }
    tests[spec][style] = fs.readFileSync(path.join(base, css), 'utf-8');
    return tests;
}, {});

Object.keys(specs).forEach(name => {
    let spec = specs[name];
    ava(`fixture: ${name}`, t => {
        t.plan(3);
        Object.keys(spec).slice(0, 3).forEach(s => {
            let result = perfectionistDFD(spec.fixture, {format: s});
            t.deepEqual(result, spec[s], `should output the expected result (${s})`);
        });
    });
});

const scss = (css, format) => {
    return plugin.process(css, {
        format: format,
        syntax: 'scss',
    }).css;
};

ava('handle single line comments', t => {
    const input = 'h1{\n  // test \n  color: red;\n}\n';
    t.deepEqual(scss(input, 'expanded'), 'h1 {\n    // test \n    color: red;\n}\n', 'should output the expected result');
    t.deepEqual(scss(input, 'compact'), 'h1 {/* test */ color: red; }\n', 'should output the expected result');
    t.deepEqual(scss(input, 'compressed'), 'h1{/* test */color:red}', 'should output the expected result');
});

ava('handle single line comments in @import', t => {
    const css = 'a, a:visited {\n    //@include border-radius(5px);\n    @include transition(background-color 0.2s ease);\n}\n';
    t.deepEqual(scss(css), css, 'should output the expected result');
});

let ensureRed = () => {
    return {
        postcssPlugin: 'ensure-red',
        Once(css) {
            let rule = postcss.rule({selector: '*'});
            rule.append(postcss.decl({
                prop: 'color',
                value: 'red',
                important: true,
            }));
            css.append(rule);
        }
    };
};

function handleRaws (t, opts = {}) {
    return postcss([ensureRed, plugin(opts)]).process('h1 { color: blue }', {from: undefined}).then(({css}) => {
        t.falsy(!!~css.indexOf('undefined'), 'should be falsy');
    });
}

ava('handle declarations added without raw properties: default', handleRaws);
ava('handle declarations added without raw properties: compact', handleRaws, {format: 'compact'});
ava('handle declarations added without raw properties: compressed', handleRaws, {format: 'compressed'});
