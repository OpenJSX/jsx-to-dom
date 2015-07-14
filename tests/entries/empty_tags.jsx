var runtime = require('../_get-runtime.js')();
var assert = require('assert');
var emptyTags = require('../../lib/empty-tags');

var SVG_NS = 'http://www.w3.org/2000/svg';
var HTML_NS = 'http://www.w3.org/1999/xhtml';


emptyTags.forEach(function(tag) {
  module.exports[tag] = function() {
    var Empty = function() {
      return {
        tag: tag,
        children: [<div />],
        props: null
      }
    };

    assert.throws(function() {
      runtime.render(<Empty />);
    }, function(e) {
      if (e.message === 'Tag <' + tag + ' /> cannot have children') {
        return true;
      }
    }, 'Tag <' + tag + '> cannot have children, but it has');
  };
});