/**
 * Copyright 2015, Skookum Digital Works, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule instanceOf
 */

var is = require('./_util').is;
function value(o) { return o.value; }

module.exports = {
  is: is('instanceOf'),

  // React.PropTypes.instanceOf(Thing);
  resolve: function(o) {
    var value = o.arguments[0].name;
    return {
      key: 'propType',
      value: value,
    };
  }
};


