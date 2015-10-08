"use strict";

var jsx = require('jsx-runtime');
var hasOwn = Object.prototype.hasOwnProperty;

var emptyTags = require('empty-tags').reduce(function(map, tag) {
  map[tag] = true;
  return map;
}, Object.create(null));

var SVG_NS = 'http://www.w3.org/2000/svg';
var HTML_NS = 'http://www.w3.org/1999/xhtml';

var renderer = jsx.register('DOM', {
  renderOne: function(target, element, props, children, index) {
    var result = this.render(element, props, children);
    var node = target.childNodes[index];

    if (node) {
      target.insertBefore(result, node.nextSibling);
    } else {
      target.appendChild(result);
    }
  },
  /*renderTo: function(target, element) {
    element = this._render(element);

    if (Array.isArray(element)) {
      var result = document.createDocumentFragment();

      element.forEach(function(node) {
        result.appendChild(node);
      });

      element = result;
    }

    target.appendChild(element);
  },*/

  before: function(element) {
    this.scope.namespaces = [];
    return element;
  },

  fragment: function() {
    return document.createDocumentFragment();
  },

  params: {
    renderType: 'individual',
    updateType: 'difference',
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

        applyProps(element, props);

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
        if (child instanceof jsx.Stream) {
          handleStream(child);
          return child;
        }

        parent.appendChild(handleChild(child));
        return child;

        function handleStream(child) {
          var lastCount = 0;

          var update = function() {
            var update = child.get()
            var index = update[0];
            var removeCount = update[1];
            var items = update[2];

            var fragment;

            if (items.length === 1) {
              fragment = handleChild(items[0]);
            } else {
              fragment = document.createDocumentFragment();

              items.forEach(function(item) {
                fragment.appendChild(handleChild(item));
              });
            }

            parent.insertBefore(fragment, parent.childNodes[index + 1]);

            for (var i = index, len = index + removeCount; i < len; i++) {
              parent.removeChild(parent.childNodes[i]);
            }
          }

          child.listen(update);
          update();
        }
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
  if (typeof style === 'string') {
    element.setAttribute('style', style);
    return;
  }

  var elementStyle = element.style;

  for (var key in style) {
    if (!hasOwn.call(style, key)) continue;

    elementStyle[key] = style[key];
  }
}

function applyProps(element, props) {
  for (var key in props) {
    if (!hasOwn.call(props, key)) continue;

    var val = props[key];

    switch (key) {
      case 'style': applyStyle(element, val); break;
      case 'class': element.className = val; break;
      case 'for': element.cssFor = val; break;

      case 'innerHTML':
      case 'outerHTML':
      case 'textContent':
      case 'innerText':
      case 'text':
        console.warn('Direct manipulation of tags content is not allowed');
        break;
      default: {
        if (key.indexOf('-') !== -1) {
          element.setAttribute(key, val);
        } else {
          element[key] = val;
        }
      }
    }
  }
}

function handleChild(child) {
  if (child instanceof Element) {
    return child;
  } else {
    return document.createTextNode(child + '');
  }
}