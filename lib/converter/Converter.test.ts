import { expect, test } from 'vitest';
import Converter from './Converter';

test('toMarkdownSchema', () => {
  const actual = Converter.toMarkdownSchema({
    foo: 'bar', 
  });

  const expected = [
    { h1: 'foo' },
    { p: 'bar' },
  ];

  expect(actual).toStrictEqual(expected);
});

test('toMarkdown', () => {
  const actual = Converter.toMarkdown({
    '_ignored': {
      'foo': 'bar',
    },
    'heading_1': 'Hello, World!',
    'list': [
      'foo',
      'bar',
    ],
    'nested': [
      {
        'heading_2': 'Hello, World!',
      },
    ],
    'code': '```\nconsole.log(\'Hello, World!\');\n```',
    'table': '| foo | bar | baz |\n| --- | --- | --- |\n| 1 | 2 | 3 |',
    'unsupported': [
      [
        'foo',
        'bar',
      ],
    ],
  });

  const expected =  `# Heading 1

Hello, World!

# List

- foo
- bar

# Nested

## Heading 2

Hello, World!

# Code

\`\`\`
console.log('Hello, World!');
\`\`\`

# Table

| foo | bar | baz |
| --- | --- | --- |
| 1 | 2 | 3 |

# Unsupported

- ["foo","bar"]

`;

  expect(actual).toBe(expected);
});
