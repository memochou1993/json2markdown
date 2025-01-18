# JSON2Markdown

A simple JSON to Markdown converter that transforms JSON data into Markdown format. It can be used for transforming structured data into a readable format.

## Getting Started

### Using with ES Modules

To get started with ES Modules, simply import the module and use it in your code:

```js
import { Converter } from '@memochou1993/json2markdown';

const output = Converter.toMarkdown({
  'Hello, World!': 'It works!',
});

// Output:
// # Hello, World!\n\nIt works!\n\n
```

### Using with UMD Modules

Alternatively, if you're using UMD modules, include the script in your HTML file and use it in your code:

```html
<script src="https://unpkg.com/@memochou1993/json2markdown/dist/index.umd.js"></script>
<script>
const output = window.JSON2Markdown.Converter.toMarkdown({
  'Hello, World!': 'It works!',
});

// Output:
// # Hello, World!\n\nIt works!\n\n
</script>
```

## Usage

### Basic Usage

The `Converter` can be initialized with either a JSON string or an object, where both the keys and values will be converted into Markdown elements.

```js
const converter = new Converter({
  'Hello, World!': 'It works!',
});

const output = converter.toMarkdown();

// Output:
// # Hello, World!\n\nIt works!\n\n
```

### Callback Function

The callback function in the `toMarkdown` method allows you to transform generated Markdown elements during the conversion process. It is called for each element, giving you the opportunity to modify its properties before returning it.

```js
const converter = new Converter({
  'Hello, World!': 'It works!',
});

const output = converter.toMarkdown((element) => {
  if (element.tag === 'heading') {
    element.level += 1;
  }
  return element;
});

// Output:
// ## Hello, World!\n\nIt works!\n\n
```

## Available Tags

| Name | Description |
| --- | --- |
| `A` | Represents an anchor (`a`) tag. |
| `BR` | Represents a line break (`br`) tag. |
| `HEADING` | Represents a heading (`heading`) tag. |
| `IMG` | Represents an image (`img`) tag. |
| `LI` | Represents a list item (`li`) tag. |
| `P` | Represents a paragraph (`p`) tag. |
| `PRE` | Represents a preformatted text (`pre`) tag. |
| `TD` | Represents table data (`td`) tag. |
| `TR` | Represents a table row (`tr`) tag. |

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
