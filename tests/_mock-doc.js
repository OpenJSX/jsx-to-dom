"use strict";

var document = {
  createElement: function(tag) {
    return new Element(tag);
  },
  createElementNS: function(ns, tag) {
    return new Element(tag, ns);
  },
  createTextNode: function(str) {
    return new Text(str);
  }
};

var Element = function(tag, ns) {
  this.tagName = tag;
  this.namespaceURI = ns || '';
  this.attributes = {};
  this.children = [];
  this.style = {};
  this.nodeType = 0;
};

Element.prototype = {
  appendChild: function(child) {
    if (!(child instanceof Element) && !(child instanceof Text)) {
      throw new Error('Incorrect child');
    }

    this.children.push(child);
  },
  setAttribute: function(name, value) {
    this.attributes[name + ''] = value + '';
  },

  __toMock: function(props) {
    var mock = {
      tag: this.tagName
    };

    if (this.children.length) {
      mock.children = this.children.map(function(child) {
        return child instanceof Element ? child.__toMock() : child;
      });
    }

    if (Object.keys(this.attributes).length) {
      mock.attributes = this.attributes;
    }

    if (Object.keys(this.style).length) {
      mock.style = this.style;
    }

    if (this.namespaceURI) {
      mock.namespaceURI = this.namespaceURI;
    }

    if (Array.isArray(props) && props.length) {
      mock.props = {};
      props.forEach(function(prop) {
        mock.props[prop] = this[prop];
      }, this);
    }

    return mock;
  }
};

var Text = function(text) {
  this.nodeType = '#text';
  this.value = text + '';
};