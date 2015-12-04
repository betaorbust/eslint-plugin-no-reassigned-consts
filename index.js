'use strict';
 module.exports = {
     rules: {
         'no-reassigned-consts': require('./rules/no-reassigned-consts')
     },
     rulesConfig: {
         'no-reassigned-consts': [2, {'constNameMatch': '^[A-Z0-9_]+$'}]
     }
 };
