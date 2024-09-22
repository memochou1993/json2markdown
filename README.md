# json2markdown

A simple JSON to Markdown converter that transforms JSON data into easily readable text.

## Installation

To install the package, run:

```bash
npm install @memochou1993/json2markdown
```

## Usage

### Using with ES Modules

Import the converter and use it in your code:

```js
import { Converter } from '@memochou1993/json2markdown';

const markdown = Converter.toMarkdown({
  title: 'Hello, World!',
});

// Output: 
// # Title
//
// Hello, World!
```

### Using with UMD Modules

Include the UMD script in your HTML file and use it:

```js
const markdown = window.JSON2MD.Converter.toMarkdown({
  title: 'Hello, World!',
});

// Output: 
// # Title
//
// Hello, World!
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
