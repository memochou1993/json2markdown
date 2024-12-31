import { toTitleCase } from '@memochou1993/stryle';
import fs from 'fs';
import { describe, expect, test } from 'vitest';
import { Tags } from '~/constants';
import Converter from './Converter';

const OUTPUT_DIR = '.output';

describe('Converter', () => {
  describe('should convert an array', () => {
    test('with values to elements', () => {
      // @ts-expect-error Ignore error for testing private method
      const converter = new Converter(undefined).convertFromArray([
        'foo',
        [
          'bar',
          [
            'baz',
          ],
        ],
      ]);

      const actual = converter.getElements();

      const expected = [
        { tag: Tags.LI, value: 'foo', indent: 0 },
        { tag: Tags.LI, value: 'bar', indent: 1 },
        { tag: Tags.LI, value: 'baz', indent: 2 },
      ];

      expect(actual).toStrictEqual(expected);
    });

    test('with undefined values to elements', () => {
      // @ts-expect-error Ignore error for testing private method
      const converter = new Converter(undefined).convertFromArray([
        undefined,
        [
          undefined,
          [
            undefined,
          ],
        ],
      ]);

      const actual = converter.getElements();

      const expected = [
        { tag: Tags.LI, value: '', indent: 0 },
        { tag: Tags.LI, value: '', indent: 1 },
        { tag: Tags.LI, value: '', indent: 2 },
      ];

      expect(actual).toStrictEqual(expected);
    });

    test('with null values to elements', () => {
      // @ts-expect-error Ignore error for testing private method
      const converter = new Converter(undefined).convertFromArray([
        null,
        [
          null,
          [
            null,
          ],
        ],
      ]);

      const actual = converter.getElements();

      const expected = [
        { tag: Tags.LI, value: '', indent: 0 },
        { tag: Tags.LI, value: '', indent: 1 },
        { tag: Tags.LI, value: '', indent: 2 },
      ];

      expect(actual).toStrictEqual(expected);
    });

    test('with empty array values to elements', () => {
      // @ts-expect-error Ignore error for testing private method
      const converter = new Converter(undefined).convertFromArray([
        [],
        [
          [],
          [
            [],
          ],
        ],
      ]);

      const actual = converter.getElements();

      const expected = [] as Element[];

      expect(actual).toStrictEqual(expected);
    });

    test('with empty object values to elements', () => {
      // @ts-expect-error Ignore error for testing private method
      const converter = new Converter(undefined).convertFromArray([
        {},
        [
          {},
          [
            {},
          ],
        ],
      ]);

      const actual = converter.getElements();

      const expected = [
        { tag: Tags.LI, value: '{}', indent: 0 },
        { tag: Tags.LI, value: '{}', indent: 1 },
        { tag: Tags.LI, value: '{}', indent: 2 },
      ];

      expect(actual).toStrictEqual(expected);
    });

    test('without values to elements', () => {
      // @ts-expect-error Ignore error for testing private method
      const converter = new Converter(undefined).convertFromArray(null);

      const actual = converter.getElements();

      const expected = [
        { tag: Tags.P, value: '' },
      ];

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('should convert an object', () => {
    test('with values to elements', () => {
      // @ts-expect-error Ignore error for testing private method
      const converter = new Converter(undefined).convertFromObject({
        foo: 'bar',
      });

      const actual = converter.getElements();

      const expected = [
        { tag: Tags.HEADING, level: 1, value: 'foo' },
        { tag: Tags.P, value: 'bar' },
      ];

      expect(actual).toStrictEqual(expected);
    });

    test('without values to elements', () => {
      // @ts-expect-error Ignore error for testing private method
      const converter = new Converter(undefined).convertFromObject(null);

      const actual = converter.getElements();

      const expected = [
        { tag: Tags.P, value: '' },
      ];

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('should convert a primitive', () => {
    test('with values to elements', () => {
      // @ts-expect-error Ignore error for testing private method
      const converter = new Converter(undefined).convertFromPrimitive('foo');

      const actual = converter.getElements();

      const expected = [
        { tag: Tags.P, value: 'foo' },
      ];

      expect(actual).toStrictEqual(expected);
    });

    test('without values to elements', () => {
      // @ts-expect-error Ignore error for testing private method
      const converter = new Converter(undefined).convertFromPrimitive(null);

      const actual = converter.getElements();

      const expected = [
        { tag: Tags.P, value: '' },
      ];

      expect(actual).toStrictEqual(expected);
    });
  });

  test('should ignore specified elements', () => {
    const converter = new Converter({
      foo: 'bar',
      _ignored: 'ignored',
      _ignored_object: {
        foo: 'bar',
      },
      nested: {
        foo: 'bar',
        _ignored: 'ignored',
        _ignored_object: {
          foo: 'bar',
        },
      },
    }, {
      onConvert: (element) => {
        if (element.tag === Tags.HEADING && element.value.startsWith('_')) {
          return;
        }
        return element;
      },
    });

    const actual = converter.getElements();

    const expected = [
      { tag: Tags.HEADING, level: 1, value: 'foo' },
      { tag: Tags.P, value: 'bar' },
      { tag: Tags.HEADING, level: 1, value: 'nested' },
      { tag: Tags.HEADING, level: 2, value: 'foo' },
      { tag: Tags.P, value: 'bar' },
    ];

    expect(actual).toStrictEqual(expected);
  });

  test('should apply the specified heading level', () => {
    const converter = new Converter({
      foo: 'bar',
    }, {
      onConvert: (element) => {
        if (element.tag === Tags.HEADING) {
          element.level += 1;
        }
        return element;
      },
    });

    const actual = converter.getElements();

    const expected = [
      { tag: Tags.HEADING, level: 2, value: 'foo' },
      { tag: Tags.P, value: 'bar' },
    ];

    expect(actual).toStrictEqual(expected);
  });

  test('should apply the heading value in title case', () => {
    const converter = new Converter({
      foo: 'bar',
    }, {
      onConvert: (element) => {
        if (element.tag === Tags.HEADING) {
          element.value = toTitleCase(element.value);
        }
        return element;
      },
    });

    const actual = converter.getElements();

    const expected = [
      { tag: Tags.HEADING, level: 1, value: 'Foo' },
      { tag: Tags.P, value: 'bar' },
    ];

    expect(actual).toStrictEqual(expected);
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
          settings: `{
  "theme": "light"
}`,
        },
        {
          id: 3,
          name: 'Charlie',
          email: 'charlie@example.com',
          friends: [],
        },
      ],
      array: [
        {
          foo: 'bar',
        },
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

    const converter = new Converter(data, {
      onConvert: (element) => {
        if (element.tag === Tags.HEADING) {
          element.value = toTitleCase(element.value);
        }
        if (element.tag === Tags.TR) {
          element.values = element.values.map(value => toTitleCase(String(value)));
        }
        return element;
      },
    });

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
| 2 | Bob | bob@example.com | Charlie | {<br>  "theme": "light"<br>} |
| 3 | Charlie | charlie@example.com |  |

# Array

- {"foo":"bar"}
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
