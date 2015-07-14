var runtime = require('../_get-runtime.js')();
var assert = require('assert');

var SVG_NS = 'http://www.w3.org/2000/svg';
var HTML_NS = 'http://www.w3.org/1999/xhtml';

export var simple = () => {
  let elem = runtime.render(
    <div>
      text
    </div>
  ).__toMock();

  assert.deepEqual(
    elem, {
      tag: 'div',
      children: [{
        nodeType: '#text',
        value: 'text'
      }]
    }
  );
};