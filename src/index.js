import applyCompact from './applyCompact';
import applyCompressed from './applyCompressed';
import applyExpanded from './applyExpanded';

module.exports = (opts = {}) => {
    opts.format = opts.format || 'expanded';
    opts.indentSize = opts.indentSize || 4;
    opts.indentChar = opts.indentChar || ' ';
    opts.maxAtRuleLength = opts.maxAtRuleLength || 80;
    opts.maxSelectorLength = opts.maxSelectorLength || 80;
    opts.maxValueLength = opts.maxValueLength || 80;
    opts.colorCase = opts.colorCase || 'lower';
    if (opts.trimLeadingZero === null) {
        opts.trimLeadingZero = true;
    };
    if (opts.trimTrailingZeros === null) {
        opts.trimTrailingZeros = true;
    };
    if (opts.cascade === null) {
        opts.cascade = true;
    };
    if (opts.colorShorthand === null) {
        opts.colorShorthand = true;
    };
    if (opts.zeroLengthNoUnit === null) {
        opts.zeroLengthNoUnit = true;
    };

    opts.map = opts.map || (opts.sourcemap ? true : null);

    return {
        postcssPlugin: 'perfectionist-dfd',
        postcssVersion: '8.2.14',
        Once (root) {
            root.walk(node => {
                if (node.raws.before) {
                    node.raws.before = node.raws.before.replace(/[;\s]/g, '');
                };
            });
            switch (opts.format) {
            case 'compact':
                applyCompact(root, opts);
                break;
            case 'compressed':
                applyCompressed(root, opts);
                break;
            case 'expanded':
            default:
                applyExpanded(root, opts);
                break;
            }
        },
    };
};

module.exports.postcss = true;

