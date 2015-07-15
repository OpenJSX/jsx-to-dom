## DOM Renderer for JSX-IR

### Installation

```npm install jsx-to-html```

### Usage

#### Transpiling

```js
babel.transform(code, {
  plugins: ['jsx-to-html/babel-plugin'],
  blacklist: ['react']
});
```
or any other way described [here](http://babeljs.io/docs/advanced/plugins/#usage), just pass `'jsx-to-html/babel-plugin'`` as a plugin name.

### Runtime

```javascript
import { render } from 'jsx-to-html';

var element = render(<div className="hello">Hello World</div>);

container.appendChild(element);
```

## License

[MIT](LICENSE.md)