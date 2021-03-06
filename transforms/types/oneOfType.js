/**
 * Copyright 2015, Skookum Digital Works, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule oneOfType
 */

var is = require('./_util').is;
var getValue = function(o) { return o[0].value; }

module.exports = {
  is: is('oneOfType'),

  // React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
  resolve: function(o) {
    // require these late to avoid circular dependency issues
    var annotators = require('../annotators/');

    var value = o.arguments[0];
    value = o.arguments[0].elements
      .map(function(node) {
        return annotators[node.type](node);
      })
      .map(getValue);

    return {
      key: 'propType',
      value: {
        type: 'ArrayExpression',
        elements: value.map(function(v) {
          return {type: 'Literal', value: v};
        })
      }
    };
  }
};

