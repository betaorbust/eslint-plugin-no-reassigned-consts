"use strict";
/**
 * @fileoverview Rule to flag writing to constant variables or variables named like constants.
 * @author Jacques Favreau
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function noExternalWriteableVariables(context) {
    //--------------------------------------------------------------------------
    // Helpers
    // --------------------------------------------------------------------------
    var constNameRegex = /^[A-Z0-9_]+$/;

    /**
     * Assigns references to corresponding variable
     *
     * @param   {Scope}    scope    An escope object
     * @param   {Variable} variable Variable to apply references too
     * @returns {Variable}          returns the variable with references
     * @private
     */
    function transformGlobalVariables(scope, variable) {
        if (variable.references.length === 0) {
            scope.references.forEach(function(ref) {
                if (ref.identifier.name === variable.name) {
                    variable.references.push(ref);
                }
            });
        }

        return variable;
    }

    /**
     * Check if a node is a unary delete expression
     *
     * @param   {ASTNode} node The node to compare
     * @returns {boolean}      True if it's a unary delete expression, false if not.
     * @private
     */
    function isUnaryDelete(node) {
        return (
            node &&
            node.type === "UnaryExpression" &&
            node.operator === "delete" &&
            node.argument.type === "Identifier"
        );
    }

    /**
     * Determines if the reference should be counted as a re-assignment
     *
     * @param {Reference} ref The reference to check.
     * @returns {boolean} True if it"s a valid reassignment, false if not.
     * @private
     */
    function isReassignment(ref) {
        var isWrite = (ref.isWrite() || !ref.isReadOnly());

        if (!isWrite && isUnaryDelete(ref.identifier.parent)) {
            isWrite = true;
        }

        return isWrite;
    }

    /**
     * Check if a variable is a const or named like one.
     * @private
     * @param   {string}  name    Name of the variables
     * @param   {ASTNode} varDef  Variable definition
     * @returns {boolean}         True if variable is a constant value.
     */
    function isConst(name, varDef) {
        return varDef.kind === "const" || constNameRegex.test(name);
    }



    function checkScope(scope) {
        var variables = scope.variables;
        if (!scope.functionExpressionScope) {
            variables.forEach(function(variable) {
                if ((scope.type === "function" &&
                    variable.name === "arguments" &&
                    variable.identifiers.length === 0) ||
                    (!variable.defs[0]) ||
                    (!isConst(variable.name, variable.defs[0]))
                ) {
                    // Ignore implicit arguments variables and global environment variables
                    return;
                }

                var references = variable.references;
                var name = variable.name;
                var assignments = references.filter(isReassignment);

                if (assignments.length > 1) {
                    // remove original assigment
                    assignments.shift();

                    assignments.forEach(function(ref) {
                        context.report(ref.identifier, "{{name}} is a constant and should not be reassigned.", {name: name});
                    });
                }
                console.log(variable.name, variable.writeable);
            });
        }
        scope.childScopes.forEach(checkScope);
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------
    return {
        "Program:exit": function() {
            var scope = context.getScope();
            // https://github.com/estools/escope/issues/56
            if (scope.type === "global") {
                scope = {
                    childScopes: scope.childScopes,
                    variables: scope.variables.map(transformGlobalVariables.bind(null, scope))
                };
            }
            checkScope(scope);
        }
    };
}

module.exports = noExternalWriteableVariables;

module.exports.schema = [
    // JSON Schema for rule options goes here
];
