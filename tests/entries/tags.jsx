var runtime = require('../_get-runtime.js')();
var assert = require('assert');
var emptyTags = require('../../lib/empty-tags');

var SVG_NS = 'http://www.w3.org/2000/svg';
var HTML_NS = 'http://www.w3.org/1999/xhtml';

export var div = () => {
  let elem = runtime.render(<div></div>);

  assert.equal(
    elem.tagName, 'div'
  );
};

export var svg_namespace = () => {
  let elem = runtime.render(
    <div>
      <svg></svg>
    </div>
  ).__toMock();

  assert.deepEqual(elem, {
    tag: 'div',
    children: [{
      tag: 'svg',
      namespaceURI: SVG_NS
    }]
  });
};

export var html_namespace = () => {
  let elem = runtime.render(
    <div>
      <svg>
        <foreignObject />
      </svg>
    </div>
  ).__toMock();

  assert.deepEqual(elem, {
    tag: 'div',
    children: [{
      tag: 'svg',
      namespaceURI: SVG_NS,
      children: [{
        tag: 'foreignObject',
        namespaceURI: HTML_NS
      }]
    }]
  });
};

export var custom_tags = () => {
  let elem = runtime.render(
    <div>
      <custom-tag></custom-tag>
    </div>
  ).__toMock();

  assert.deepEqual(elem, {
    tag: 'div',
    children: [{
      tag: 'custom-tag'
    }]
  });
};

export var scope_tags = () => {
  var Scoped = function() {
    return <span></span>
  };

  let elem = runtime.render(
    <div>
      <Scoped />
    </div>
  ).__toMock();

  assert.deepEqual(elem, {
    tag: 'div',
    children: [{
      tag: 'span'
    }]
  });
};

export var empty_tags = () => {
  emptyTags.forEach(function(tag, i) {
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
  });
}