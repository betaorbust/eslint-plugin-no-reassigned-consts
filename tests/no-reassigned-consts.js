'use strict';

var ESLintTester = require('eslint').RuleTester;
var rule = require('../rules/no-reassigned-consts');

var eslintTester = new ESLintTester();

var parserOptions = {
    ecmaVersion: 6
};

eslintTester.run('no-reassigned-consts', rule, {
    valid: [
        'var a = "a"; a = "b";',
        'var CONST_VAL = "Amy";',        
        {
            code: 'let a = "a"; a = "b";',
            parserOptions: parserOptions
        },
        {
            code: 'const a = "a";',
            parserOptions: parserOptions
        },
        {
            code: 'const a = {};',
            parserOptions: parserOptions
        },
        {
            code: 'const a = 0;',
            parserOptions: parserOptions
        },
        {
            code: 'const {a, b} = [1, 2];',
            parserOptions: parserOptions
        },
        {
            code: 'const a = {}; a.a = "a"; delete a.a; a.r = 0; ++a.r;',
            parserOptions: parserOptions
        }
    ],
    invalid: [
        {
            code: 'const {a, b} = [1, 2]; a = 3;',
            errors: [{ message: 'a is a constant and should not be reassigned.' }],
            parserOptions: parserOptions
        },
        {
            code: 'const b = "b"; b = "c";',
            errors: [{ message: 'b is a constant and should not be reassigned.' }],
            parserOptions: parserOptions
        },
        {
            code: 'const c = 0; ++c;',
            errors: [{ message: 'c is a constant and should not be reassigned.' }],
            parserOptions: parserOptions
        },
        {
            code: 'function test() { const d = 0; delete d; }',
            errors: [{ message: 'd is a constant and should not be reassigned.' }],
            parserOptions: parserOptions
        },
        {
            code: 'var CONST_VALUE = "Amy"; CONST_VALUE = "Rory";',
            errors: [{ message: 'CONST_VALUE is a constant and should not be reassigned.'}]
        }
    ]
});