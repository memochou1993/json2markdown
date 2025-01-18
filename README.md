# json2markdown

A simple JSON to Markdown converter that transforms JSON data into easily readable text.

## Getting Started

### Using with ES Modules

Import the module and use it in your code:

```js
import { Converter } from '@memochou1993/json2markdown';

const output = Converter.toMarkdown({
  'Hello, World!': 'It works!',
}, (element) => {
  if (element.tag === 'heading') {
    element.level += 1;
  }
  return element;
});

console.log(output);
// Output:
// ## Hello, World!\n\nIt works!\n\n
```

### Using with UMD Modules

Include the UMD script in your HTML file and use it:

```html
<script src="https://unpkg.com/@memochou1993/json2markdown/dist/index.umd.js"></script>
<script>
const output = window.JSON2MARKDOWN.Converter.toMarkdown({
  'Hello, World!': 'It works!',
}, (element) => {
  if (element.tag === 'heading') {
    element.level += 1;
  }
  return element;
});

console.log(JSON.stringify(output));
// Output:
// ## Hello, World!\n\nIt works!\n\n
</script>
```

## Development

To start a local development server, run:

```bash
npm run dev
```

## Testing

To run the tests for this package, run:

```bash
npm run test
```
