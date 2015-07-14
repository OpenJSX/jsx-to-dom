var runtime = require('../_get-runtime.js')();
var assert = require('assert');

export var simple = () => {
  let elem = runtime.render(
    <div data-test="test"></div>
  ).__toMock();

  assert.deepEqual(
    elem, {
      tag: 'div',
      attributes: {
        'data-test': 'test'
      }
    }
  );
};

export var js_values = () => {
  let elem = runtime.render(
    <div
      data-boolean={ true }
      data-number={ 1 }
      data-string={ 'str' }
      data-object={ {} }
      data-array={ [1, 2, 3] }
    ></div>
  ).__toMock();

  assert.deepEqual(
    elem, {
      tag: 'div',
      attributes: {
        'data-boolean': 'true',
        'data-number': '1',
        'data-string': 'str',
        'data-object': '[object Object]',
        'data-array': '1,2,3'
      }
    }
  );
};

export var prop_isnt_attr = () => {
  let elem = runtime.render(
    <div data-test="test" className="test" _prop={ true }></div>
  ).__toMock();

  assert.deepEqual(
    elem, {
      tag: 'div',
      attributes: {
        'data-test': 'test'
      }
    }
  );
};