import postcss from 'postcss';
import ava from 'ava';
import perfectionist from '../';
import {name} from '../../package.json';

async function usage (t, instance) {
    const input = 'h1 { color: #fff }';
    let result = await instance.process(input, {from: undefined});
    t.deepEqual(result.css, 'h1 {\n    color: #fff;\n}\n', 'should be consumed');
}

ava('can be used as a postcss plugin', (t) => {
    usage(t, postcss().use(perfectionist()));
});
ava('can be used as a postcss plugin (2)', (t) => {
    usage(t, postcss([perfectionist()]));
});
ava('can be used as a postcss plugin (3)', (t) => {
    usage(t, postcss([perfectionist]));
});

ava('should use the postcss plugin api', t => {
    t.truthy(perfectionist().postcssVersion, 'should be able to access version');
    t.deepEqual(perfectionist().postcssPlugin, name, 'should be able to access name');
});
