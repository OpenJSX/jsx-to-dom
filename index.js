var jsx = require('jsx-runtime');
var hasOwn = Object.prototype.hasOwnProperty;

var emptyTags = require('./lib/empty-tags').reduce(function(map, tag) {
  map[tag] = true;
  return map;
}, Object.create(null));

var SVG_NS = 'http://www.w3.org/2000/svg';
var HTML_NS = 'http://www.w3.org/1999/xhtml';

var renderer = jsx.register('DOM', {
  before: function(element) {
    this.scope.namespaces = [];
    return element;
  },
  tags: {
    '*': {
      enter: function(tag, props) {
        var namespaces = this.scope.namespaces;

        if (tag === 'svg') {
          namespaces.unshift(SVG_NS);
        } else if (tag === 'foreignObject') {
          namespaces.unshift(HTML_NS);
        }

        var element;

        if (namespaces.length) {
          element = document.createElementNS(namespaces[0], tag);
        } else {
          element = document.createElement(tag);
        }

        for (var key in props) {
          if (!hasOwn.call(props, key)) continue;

          if (key === 'style') {
            applyStyle(element, props[key]);
          } else if (key.indexOf('-') !== -1) {
            // handle dashed props as attributes
            element.setAttribute(key, props[key]);
          } else {
            element[key] = props[key];
          }
        }

        return element;
      },
      leave: function(parent, tag) {
        if (
          tag === 'svg' && this.scope.namespaces[0] === SVG_NS ||
          tag === 'foreignObject' && this.scope.namespaces[0] === HTML_NS
        ) {
          this.scope.namespaces.shift();
        }

        return parent;
      },
      child: function(child, parent) {
        if (child instanceof Element) {
          // do nothing
        } else {
          child = document.createTextNode(child + '');
        }

        parent.appendChild(child);
        return parent;
      },
      children: function(children, parent, tag) {
        if (typeof emptyTags[tag.toLowerCase()] !== 'undefined') {
          throw new Error('Tag <' + tag + ' /> cannot have children');
        }

        return children;
      }
    }
  }
});

module.exports = renderer;

function applyStyle(element, style) {
  var elementStyle = element.style;

  for (var key in style) {
    if (!hasOwn.call(style, key)) continue;

    elementStyle[key] = style[key];
  }
}