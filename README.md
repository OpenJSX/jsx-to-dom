## HTML and XML renderer for JSX-IR

### Install

```npm install jsx-to-html```

### Usage

**Note:** Do not forget to install ```jsx-runtime``` before using renderer

```javascript
var render = require('jsx-to-html');
// ...
var dom = render(jsxTree);

element.appendChild(dom);
```
