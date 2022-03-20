import path from 'path';
import fs from 'fs';
import ava from 'ava';
import postcss from 'postcss';
import plugin from '../';

let base = path.join(__dirname, 'fixtures');

function perfectionist (input, options, procoptions) {
    if (!procoptions) {
        procoptions = {from: undefined};
    }
    let result = postcss([plugin(options)]).process(input, procoptions);
    return result.css;
}

fs.readdir(base, {encoding: 'utf-8'}, specfiles => {
    if (!specfiles) {
        return;
    }
    let [spec, style] = specfiles.split('.');
    fs.readFile(path.join(base, spec), {encoding: 'utf-8'}, fixture => {
        ava(`fixture: ${spec}`, t => {
            t.plan(3);
            fs.readFile(path.join(base, specfiles), {encoding: 'utf-8'}, expected => {
                t.deepEqual(perfectionist(fixture, {format: style}), expected, `should output the expected result (${style})`);
            });
        });
    });
});

ava('should handle single line comments', t => {
    let lineinput = 'h1{\n  // test \n  color: red;\n}\n';
    let expected = 'h1 {\n    // test \n    color: red;\n}\n';
    let format = 'expanded';
    let procoptions = {
        from: undefined,
        syntax: require('postcss-scss'),
        parser: require('postcss-scss'),
    };
    t.deepEqual(perfectionist(lineinput, {format: format}, procoptions), expected, `should output the expected result (${format})`);
    expected = 'h1 {/* test */ color: red; }\n';
    format = 'compact';
    t.deepEqual(perfectionist(lineinput, {format: format}, procoptions), expected, `should output the expected result (${format})`);
    expected = 'h1{/* test */color:red}';
    format = 'compressed';
    t.deepEqual(perfectionist(lineinput, {format: format}, procoptions), expected, `should output the expected result (${format})`);
});

ava('should handle single line comments in @import', t => {
    let procoptions = {
        from: undefined,
        syntax: require('postcss-scss'),
        parser: require('postcss-scss'),
    };
    let linecss = 'a, a:visited {\n    //@include border-radius(5px);\n    @include transition(background-color 0.2s ease);\n}\n';
    t.deepEqual(perfectionist(linecss, {}, procoptions), linecss, `should output the expected result (default expanded scss)`);
});

const ensureRed = () => {
    return {
        postcssPlugin: 'ensure-red',
        postcssVersion: '8.2.14',
        Declaration: {
            color: decl => {
                decl.value = 'red';
            },
        },
    };
};

ava("should make any color red", t => {
    let css = postcss([ensureRed()]).process('h1 { color: blue }');
    return t.deepEqual('h1 { color: red }', css.css);
});

function handleRaws (t, opts = {}) {
    let css = postcss([ensureRed(), plugin(opts)]).process('h1 { color: blue }');
    t.falsy(!!~css.css.indexOf('undefined'));
}

ava('should handle declarations added without raw properties (default)', handleRaws);
ava('should handle declarations added without raw properties (compact)', handleRaws, {format: 'compact'});
ava('should handle declarations added without raw properties (compressed)', handleRaws, {format: 'compressed'});
