# perfectionist-dfd

Beautify and/or normalize CSS files. Fork and update of a fork and update of an archived project.

## Status

[![perfectionist-dfd CI](https://github.com/danielfdickinson/perfectionist-dfd/actions/workflows/ci.yml/badge.svg)](https://github.com/danielfdickinson/perfectionist-dfd/actions/workflows/ci.yml) [![Coverage](https://coveralls.io/repos/github/danielfdickinson/perfectionist-dfd/badge.svg?branch=main)](https://coveralls.io/github/danielfdickinson/perfectionist-dfd?branch=main) [![Dependency status](https://img.shields.io/librariesio/release/npm/perfectionist-dfd)](https://github.com/danielfdickinson/perfectionist-dfd/blob/main/package.json) [![NPM version](https://img.shields.io/npm/v/perfectionist-dfd)](https://www.npmjs.com/package/perfectionist-dfd?activeTab=versions)

## Install

With [npm](https://npmjs.org/package/perfectionist-dfd) do:

```sh
npm install perfectionist-dfd --save
```

## Example

### Input

```css
h1   {
         color   :  red }
```

### Expanded output

```css
h1 {
    color: red;
}
```

### Compact output

```css
h1 { color: red; }
```

### Compressed output

```css
h1{color:red}
```

## API

### perfectionistDFD.process(css, [options])

#### css

Type: `string`
*Required option.*

Pass a CSS string to beautify it.

#### options

##### cascade

Type: `boolean`
Default: `true`

Set this to `false` to disable visual cascading of vendor prefixed properties.
Note that this transform only applies to the `expanded` format.

```css
/* true */
h1 {
    -webkit-border-radius: 12px;
            border-radius: 12px;
}

/* false */
h1 {
    -webkit-border-radius: 12px;
    border-radius: 12px;
}
```

##### colorCase

Type: `string`
Default: `lower`

Set either `lower` or `upper` to transform hexadecimal colors to the according case.

```css
/* upper */
p { color: #C8C8C8 }

/* lower */
p { color: #c8c8c8 }
```

##### colorShorthand

Type: `boolean`
Default: `true`

Set this to `true` to shorten hexadecimal colors.

```css
/* true */
p { color: #fff }

/* false */
p { color: #ffffff }
```

##### format

Type: `string`
Default: `expanded`

Pass either `expanded`, `compact` or `compressed`. Note that the `compressed`
format only facilitates simple whitespace compression around selectors &
declarations. For more powerful compression, see [cssnano].

##### indentChar

Type: `string`
Default: ' ' (space)

Specify `\t` here instead if you would like to use tabs for indentation.

##### indentSize

Type: `number`
Default: `4`

This number will be used as a basis for all indent levels, using the `expanded`
format.

##### trimLeadingZero

Type: `boolean`
Default: `true`

Set this to `true` to trim leading zero for fractional numbers less than 1.

```css
/* true */
p { line-height: .8 }

/* false */
p { line-height: 0.8 }
```

##### trimTrailingZeros

Type: `boolean`
Default: `true`

Set this to `true` to trim trailing zeros in numbers.

```css
/* true */
div { top: 50px }

/* false */
div { top: 50.000px }
```

##### maxAtRuleLength

Type: `boolean|number`
Default: `80`

If set to a positive integer, set a maximum width for at-rule parameters; if
they exceed this, they will be split up over multiple lines. If false, this
behaviour will not be performed. Note that this transform only applies to
the `expanded` format.

##### maxSelectorLength

Type: `boolean|number`
Default: `80`

If set to a positive integer, set a maximum width for a selector string; if
it exceeds this, it will be split up over multiple lines. If false, this
behaviour will not be performed. Note that this transform is excluded from the
`compressed` format.

##### maxValueLength

Type: `boolean|number`
Default: `80`

If set to a positive integer, set a maximum width for a property value; if
it exceeds this, it will be split up over multiple lines. If false, this
behaviour will not be performed. Note that this transform only applies to
the `expanded` format.

##### sourcemap

Type: `boolean`
Default: `false`

Generate a sourcemap with the transformed CSS.

##### syntax

Type: `string`

Specify `scss` if you would like to also format SCSS-style single line comments.
This loads the [postcss-scss](https://github.com/postcss/postcss-scss) plugin.

##### zeroLengthNoUnit

Type: `boolean`
Default: `true`

Set this to `true` to trim units after zero length.

```css
/* true */
div { padding: 0 }

/* false */
div { padding: 0px }
```

### `postcss([ perfectionistDFD(opts) ])`

perfectionist can also be consumed as a PostCSS plugin. See the
[documentation](https://github.com/postcss/postcss#usage) for examples for
your environment.

### CLI

perfectionist also ships with a CLI app. To see the available options, just run:

```sh
perfectionist-dfd --help
```

## Usage

See the [PostCSS documentation](https://github.com/postcss/postcss#usage) for
examples for your environment.

## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests
to cover it.

## License

MIT © 2015 [Ben Briggs](http://beneb.info) \
MIT © 2022 [Daniel F. Dickinson](https://www.wildtechgarden.ca/danielfdickinson/)
