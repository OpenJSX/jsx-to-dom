## DOM Renderer for JSX-IR

### Installation

```npm install jsx-to-dom```

### Usage

#### Transpiling

```js
babel.transform(code, {
  plugins: ['jsx-to-dom/babel-plugin'],
  blacklist: ['react']
});
```
or any other way described [here](http://babeljs.io/docs/advanced/plugins/#usage), just pass `'jsx-to-dom/babel-plugin'`` as a plugin name.

### Runtime

```javascript
import { render } from 'jsx-to-dom';

var element = render(<div className="hello">Hello World</div>);

container.appendChild(element);
```

## License

[MIT](LICENSE.md)