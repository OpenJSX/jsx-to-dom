var runtime = require('../_get-runtime.js')();
var assert = require('assert');

export var object = () => {
  let elem = runtime.render(
    <div
      style={ {
        color: 'black'
      } }
    ></div>
  ).__toMock();

  assert.deepEqual(
    elem, {
      tag: 'div',
      style: {
        color: 'black'
      }
    }
  );
};

export var string = () => {
  let elem = runtime.render(
    <div
      style="color: black"
    ></div>
  ).__toMock();

  assert.deepEqual(
    elem, {
      tag: 'div',
      attributes: {
        style: 'color: black'
      }
    }
  );
};