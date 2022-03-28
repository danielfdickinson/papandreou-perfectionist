import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
    {
        input: 'src/index.mjs',
        external: [
            'defined',
            'module',
            'postcss',
            'postcss-value-parser',
            'string.prototype.repeat'
        ],
        output: [
            {
                exports: 'default',
                file: 'dist/perfectionist-dfd.js',
                format: 'cjs',
            },
            {
                exports: 'default',
                file: 'dist/perfectionist-dfd.min.js',
                format: 'cjs',
                plugins: [terser()]
            },
            {
                file: 'dist/perfectionist-dfd.mjs',
                format: 'es',
            },
            {
                file: 'dist/perfectionist-dfd.min.mjs',
                format: 'es',
                plugins: [terser()]
            },
        ],
        plugins: [
            commonjs(),
            resolve()
        ]
    }
];
