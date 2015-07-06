var jsx = require('jsx-runtime');
var hasOwn = Object.prototype.hasOwnProperty;

var renderer = jsx.register('DOM', {
  tags: {
    '*': {
      enter: function(tag, props) {
        // handle namespaces
        var element = document.createElement(tag);

        for (var key in props) {
          if (!hasOwn.call(props, key)) continue;

          if (key === 'style') {
            applyStyle(element, props[key]);
          } else {
            element[key] = props[key];
          }
        }

        return element;
      },
      child: function(child, parent) {
        if (child instanceof Element) {
          // do nothing
        } else {
          child = document.createTextNode(child + '');
        }

        parent.appendChild(child);
        return parent;
      }
    }
  }
});

module.exports = function(tree) {
  return renderer.render(tree);
};

function applyStyle(element, style) {
  var elementStyle = element.style;

  for (var key in style) {
    if (!hasOwn(style, key)) continue;

    elementStyle[key] = style[key];
  }
}