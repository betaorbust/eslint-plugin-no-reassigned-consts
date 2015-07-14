'use strict';

var eslint = require('eslint');
var ESLintTester = require('eslint-tester');

var eslintTester = new ESLintTester(eslint.linter);

eslintTester.addRuleTest('rules/no-reassigned-consts', {
    valid: [
        {
            code: 'var a = "a"; a = "b";'
        },
        {
            code: 'let a = "a"; a = "b";',
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: 'const a = "a";',
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: 'const a = {};',
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: 'const a = 0;',
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: 'const {a, b} = [1, 2];',
            ecmaFeatures: {
                blockBindings: true,
                destructuring: true
            }
        },
        {
            code: 'const a = {}; a.a = "a"; delete a.a; a.r = 0; ++a.r;',
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: 'var CONST_VAL = "Amy";'
        }
    ],
    invalid: [
        {
            code: 'const {a, b} = [1, 2]; a = 3;',
            errors: [{ message: 'a is a constant and should not be reassigned.' }],
            ecmaFeatures: {
                blockBindings: true,
                destructuring: true
            }
        },
        {
            code: 'const b = "b"; b = "c";',
            errors: [{ message: 'b is a constant and should not be reassigned.' }],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: 'const c = 0; ++c;',
            errors: [{ message: 'c is a constant and should not be reassigned.' }],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: 'function test() { const d = 0; delete d; }',
            errors: [{ message: 'd is a constant and should not be reassigned.' }],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: 'var CONST_VALUE = "Amy"; CONST_VALUE = "Rory";',
            errors: [{ message: 'CONST_VALUE is a constant and should not be reassigned.'}]
        }
    ]
});