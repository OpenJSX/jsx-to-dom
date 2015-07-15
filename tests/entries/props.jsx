var runtime = require('../_get-runtime.js')();
var assert = require('assert');

export var simple = () => {
  let elem = runtime.render(
    <div
      className="test"
    ></div>
  ).__toMock(['className']);

  assert.deepEqual(
    elem, {
      tag: 'div',
      props: {
        className: 'test'
      }
    }
  );
};

export var js_values = () => {
  let elem = runtime.render(
    <div
      _boolean={ true }
      _number={ 1 }
      _string={ 'str' }
      _object={ {} }
      _array={ [1, 2, 3] }
    ></div>
  ).__toMock([
    '_boolean',
    '_number',
    '_string',
    '_object',
    '_array'
  ]);

  assert.deepEqual(
    elem, {
      tag: 'div',
      props: {
        _boolean: true,
        _number: 1,
        _string: 'str',
        _object: {},
        _array: [1, 2, 3]
      }
    }
  );
};

export var attr_isnt_prop = () => {
  let elem = runtime.render(
    <div data-test="test" className="test" _prop={ true }></div>
  ).__toMock(['className', '_prop', 'data-test']);

  assert.deepEqual(
    elem, {
      tag: 'div',
      attributes: {
        'data-test': 'test'
      },
      props: {
        className: 'test',
        _prop: true,
        'data-test': void 0
      }
    }
  );
}

export var props_transform = () => {
  let elem = runtime.render(
    <div class="test" for="thing"></div>
  ).__toMock(['className', 'cssFor', 'class', 'for']);

  assert.deepEqual(
    elem, {
      tag: 'div',
      props: {
        className: 'test',
        cssFor: 'thing',
        'class': void 0,
        'for': void 0
      }
    }
  );
}

export var content_manipulation = () => {
  let originalWarn = global.console.warn;
  global.console.warn = function() {};

  let elem = runtime.render(
    <div
      innerHTML="<span></span>"
      outerHTML="<span></span>"
      textContent="<span></span>"
      innerText="<span></span>"
      text="<span></span>"
    ></div>
  ).__toMock([
    'innerHTML',
    'outerHTML',
    'textContent',
    'innerText',
    'text'
  ]);

  global.console.warn = originalWarn;

  assert.deepEqual(
    elem, {
      tag: 'div',
      props: {
        'innerHTML': void 0,
        'outerHTML': void 0,
        'textContent': void 0,
        'innerText': void 0,
        'text': void 0,
      }
    }
  );
}