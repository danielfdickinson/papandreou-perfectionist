import postcss from 'postcss';
import ava from 'ava';
import { createRequire } from 'module';
import perfectionistDFDNewNode from '../src/index.mjs';
import semver from 'semver';

const requireShim = createRequire(import.meta.url);
const pkg = requireShim('../package.json');
const perfectionistDFDOldNode = requireShim('..');

var plugin;

    plugin = perfectionistDFDNewNode;
} else {
    plugin = perfectionistDFDOldNode;
}

function usage (t, instance) {
    const input = 'h1 { color: #fff }';
    return instance.process(input).then(({css}) => {
        t.deepEqual(css, 'h1 {\n    color: #fff;\n}\n', 'should be consumed');
    });
}

ava('can be used as a postcss plugin', usage, postcss().use(plugin()));
ava('can be used as a postcss plugin (2)', usage, postcss([ plugin() ]));
ava('can be used as a postcss plugin (3)', usage, postcss([ plugin ]));

ava('should use the postcss plugin api', t => {
    t.truthy(plugin().postcssVersion, 'should be able to access version');
    t.deepEqual(plugin().postcssPlugin, pkg.name, 'should be able to access name');
});
