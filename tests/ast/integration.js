var path = require('path');
var readFile = require('fs').readFileSync;
var esprima = require('esprima-fb');
var estraverse = require('estraverse-fb');
var escodegen = require('escodegen');
var assert = require('assert');

var results;
var spyOnReturn = function(obj, method) {
  var orig = obj[method];
  results = [];
  obj[method] = function() {
    var result = orig.apply(obj, arguments);
    results.push(
      escodegen.generate(result)
    );
    return result;
  }
}

module.exports = function(type) {
  spyOnReturn(require('../../transforms/annotationsFor'), 'annotate');

  var contents = readFile(path.join(__dirname, '..', 'fixtures', type + '.js'), 'utf8');

  var transformer = require('../../esprima-transformer');

  var ast = estraverse[transformer.type](
    esprima.parse(contents),
    transformer
  );

  // TODO: add support for default values
  var expected = [
    '{propType: \'array\', defaultValue: \'[]\'}',
    '{propType: \'bool\', defaultValue: \'false\'}',
    '{propType: \'func\', defaultValue: \'this.props.clickHandler\'}',
    '{propType: \'number\', defaultValue: -1}',
    '{propType: \'object\', optionalObject: \'{}\'}',
    '{propType: \'string\', optionalString: \'Hello, React\'}',
    '{propType: \'node\'}',
    '{propType: \'element\'}',
    '{propType: \'Message\'}',
    '{propType: [\'News\', \'Photos\'], defaultValue: \'News\'}',
    '{propType: [\'string\', \'number\', \'Message\']}',
    '{propType: \'number[]\'}',
    '{propType: \'number{}\'}',
    '{propType: {color: \'string\', fontSize: \'number\'}}',
    '{propType: \'func\', isRequired: true}',
    '{propType: \'any\', isRequired: true}',
  ];

  if (results.length === 0) {
    throw new Error(
      'No results were parsed. Expected ' + expected.length + ' annotations.'
    );
  }

  results.forEach(function(r, i) {
    var a = r.replace(/\s+/g, '');
    var b = expected[i].replace(/\s+/g, '');
    assert.equal(a, b, 'Expected ' + a + ' to be ' + b);
  });
};

