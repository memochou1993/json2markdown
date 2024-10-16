import fs from 'fs';
import { describe, expect, test } from 'vitest';
import Converter from './Converter';

const OUTPUT_DIR = '.output';

describe('Converter', () => {
  test('should convert from array', () => {
    // @ts-expect-error Ignore error for testing private method
    const actual = new Converter(undefined).convertFromArray([
      1,
      [
        2,
        [
          3,
        ],
      ],
    ]);

    const expected = [
      { li: '1', indent: 0 },
      { li: '2', indent: 1 },
      { li: '3', indent: 2 },
    ];

    expect(actual).toStrictEqual(expected);
  });

  test('should convert from object', () => {
    // @ts-expect-error Ignore error for testing private method
    const actual = new Converter(undefined).convertFromObject({
      foo: 'bar',
    });

    const expected = [
      { h1: 'foo' },
      { p: 'bar' },
    ];

    expect(actual).toStrictEqual(expected);
  });

  test('should convert from primitive', () => {
    // @ts-expect-error Ignore error for testing private method
    const actual = new Converter(undefined).convertFromPrimitive('foo');

    const expected = [
      { p: 'foo' },
    ];

    expect(actual).toStrictEqual(expected);
  });

  test('should start from specified heading level', () => {
    const data = {
      heading_2: 'Hello, World!',
    };

    const actual = Converter.toMarkdown(data, {
      initialHeadingLevel: 2,
    });

    const expected = `## Heading 2

Hello, World!

`;

    expect(actual).toBe(expected);
  });

  test('should disable title case', () => {
    const data = {
      heading_1: 'Hello, World!',
    };

    const actual = Converter.toMarkdown(data, {
      disableTitleCase: true,
    });

    const expected = `# heading_1

Hello, World!

`;

    expect(actual).toBe(expected);
  });

  test('should convert correctly', () => {
    const data = {
      heading_1: 'Hello, World!',
      nested: {
        heading_2: 'Hello, World!',
        nested: {
          heading_3: 'Hello, World!',
          nested: {
            heading_4: 'Hello, World!',
            nested: {
              heading_5: 'Hello, World!',
              nested: {
                heading_6: 'Hello, World!',
                nested: {
                  heading_7: 'Hello, World!',
                },
              },
            },
          },
        },
      },
      table: [
        {
          id: 1,
          name: 'Alice',
          email: 'alice@example.com',
          friends: ['Bob', 'Charlie'],
          settings: {
            theme: 'dark',
          },
        },
        {
          id: 2,
          name: 'Bob',
          email: 'bob@example.com',
          friends: ['Charlie'],
          settings: {
            theme: 'light',
          },
        },
        {
          id: 3,
          name: 'Charlie',
          email: 'charlie@example.com',
          friends: [],
        },
      ],
      array: [
        1,
        [
          2,
          [
            3,
          ],
        ],
        {
          foo: 'bar',
        },
      ],
      markdown_code: '```\nconsole.log(\'Hello, World!\');\n```',
      markdown_table: '| foo | bar | baz |\n| --- | --- | --- |\n| 1 | 2 | 3 |',
    };

    const converter = new Converter(data);

    const actual = converter.toMarkdown();

    const expected = `# Heading 1

Hello, World!

# Nested

## Heading 2

Hello, World!

## Nested

### Heading 3

Hello, World!

### Nested

#### Heading 4

Hello, World!

#### Nested

##### Heading 5

Hello, World!

##### Nested

###### Heading 6

Hello, World!

###### Nested

###### Heading 7

Hello, World!

# Table

| Id | Name | Email | Friends | Settings |
| --- | --- | --- | --- | --- |
| 1 | Alice | alice@example.com | Bob, Charlie | {"theme":"dark"} |
| 2 | Bob | bob@example.com | Charlie | {"theme":"light"} |
| 3 | Charlie | charlie@example.com |  |

# Array

- 1
  - 2
    - 3
- {"foo":"bar"}

# Markdown Code

\`\`\`
console.log('Hello, World!');
\`\`\`

# Markdown Table

| foo | bar | baz |
| --- | --- | --- |
| 1 | 2 | 3 |

`;

    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
    fs.writeFileSync(`${OUTPUT_DIR}/actual.md`, actual);
    fs.writeFileSync(`${OUTPUT_DIR}/expected.md`, expected);

    expect(actual).toBe(expected);
  });
});
