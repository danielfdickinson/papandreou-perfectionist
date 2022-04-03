import postcss from 'postcss';
import { createRequire } from 'module';
import applyCompact from './applyCompact.mjs';
import applyCompressed from './applyCompressed.mjs';
import applyExpanded from './applyExpanded.mjs';

const requireShim = createRequire(import.meta.url);

function checkOpts(defOpts, opts = {}) {
    var retOpts = opts;

    Object.keys(defOpts).forEach(key => {
        if (typeof opts[key] === 'undefined') {
            retOpts[key] = defOpts[key];
        }
    });

    return retOpts;
}

const defaultOpts = {
    cascade: true,
    colorCase: 'lower',
    colorShorthand: true,
    format: 'expanded',
    from: undefined,
    indentSize: 4,
    indentChar: ' ',
    maxAtRuleLength: 80,
    maxSelectorLength: 80,
    maxValueLength: 80,
    trimLeadingZero: true,
    trimTrailingZeros: true,
    zeroLengthNoUnit: true
};

const perfectionistDFD = (opts = {}) => {

    opts = checkOpts(defaultOpts, opts);

    return {
        postcssPlugin: 'perfectionist-dfd',
        postcssVersion: '8.0.0',
        Once (css) {
            css.walk(node => {
                if (node.raws.before) {
                    node.raws.before = node.raws.before.replace(/[;\s]/g, '');
                }
            });
            switch (opts.format) {
            case 'compact':
                applyCompact(css, opts);
                break;
            case 'compressed':
                applyCompressed(css, opts);
                break;
            case 'expanded':
            default:
                applyExpanded(css, opts);
                break;
            }
        }
    };
};

const perfectionistDFDProcess = (css, opts = {}) => {
    opts = checkOpts({
        from: undefined,
        map: undefined,
        sourcemap: undefined,
        syntax: undefined,
        to: undefined
    }, opts);

    opts = checkOpts(defaultOpts, opts);

    opts.map = opts.map || (opts.sourcemap ? true : undefined);

    if (opts.syntax === 'scss') {
        opts.syntax = requireShim('postcss-scss');
    }

    let processor = postcss([ perfectionistDFD(opts) ]);
    return processor.process(css, opts);
};

perfectionistDFD.postcss = true;
perfectionistDFD.process = perfectionistDFDProcess;

export { perfectionistDFD as default };
