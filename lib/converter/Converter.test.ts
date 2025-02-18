import { toTitleCase } from '@memochou1993/stryle';
import fs from 'fs';
import { describe, expect, test } from 'vitest';
import { Tag } from '~/constants';
import Converter from './Converter';

const OUTPUT_DIR = '.output';

describe('Converter', () => {
  describe('should convert an array to elements', () => {
    test('with values', () => {
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
        { tag: Tag.LI, value: 'foo', indent: 0 },
        { tag: Tag.LI, value: 'bar', indent: 1 },
        { tag: Tag.LI, value: 'baz', indent: 2 },
      ];

      expect(actual).toStrictEqual(expected);
    });

    test('with undefined values', () => {
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
        { tag: Tag.LI, value: '', indent: 0 },
        { tag: Tag.LI, value: '', indent: 1 },
        { tag: Tag.LI, value: '', indent: 2 },
      ];

      expect(actual).toStrictEqual(expected);
    });

    test('with null values', () => {
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
        { tag: Tag.LI, value: '', indent: 0 },
        { tag: Tag.LI, value: '', indent: 1 },
        { tag: Tag.LI, value: '', indent: 2 },
      ];

      expect(actual).toStrictEqual(expected);
    });

    test('with empty array values', () => {
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

    test('with empty object values', () => {
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
        { tag: Tag.LI, value: '{}', indent: 0 },
        { tag: Tag.LI, value: '{}', indent: 1 },
        { tag: Tag.LI, value: '{}', indent: 2 },
      ];

      expect(actual).toStrictEqual(expected);
    });

    test('without values', () => {
      // @ts-expect-error Ignore error for testing private method
      const converter = new Converter(undefined).convertFromArray(null);

      const actual = converter.getElements();

      const expected = [
        { tag: Tag.P, value: '' },
      ];

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('should convert an object to elements', () => {
    test('with values', () => {
      // @ts-expect-error Ignore error for testing private method
      const converter = new Converter(undefined).convertFromObject({
        foo: 'bar',
      });

      const actual = converter.getElements();

      const expected = [
        { tag: Tag.HEADING, level: 1, value: 'foo' },
        { tag: Tag.P, value: 'bar' },
      ];

      expect(actual).toStrictEqual(expected);
    });

    test('without values', () => {
      // @ts-expect-error Ignore error for testing private method
      const converter = new Converter(undefined).convertFromObject(null);

      const actual = converter.getElements();

      const expected = [
        { tag: Tag.P, value: '' },
      ];

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('should convert a primitive to elements', () => {
    test('with values', () => {
      // @ts-expect-error Ignore error for testing private method
      const converter = new Converter(undefined).convertFromPrimitive('foo');

      const actual = converter.getElements();

      const expected = [
        { tag: Tag.P, value: 'foo' },
      ];

      expect(actual).toStrictEqual(expected);
    });

    test('without values', () => {
      // @ts-expect-error Ignore error for testing private method
      const converter = new Converter(undefined).convertFromPrimitive(null);

      const actual = converter.getElements();

      const expected = [
        { tag: Tag.P, value: '' },
      ];

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('should convert a JSON string to markdown', () => {
    test('using the instance method', () => {
      const converter = new Converter(JSON.stringify({
        foo: 'bar',
      }));

      const actual = converter.toMarkdown((element) => {
        if (element.tag === Tag.HEADING) {
          element.value = toTitleCase(element.value);
        }
        return element;
      });

      const expected = `# Foo

bar
`;

      expect(actual).toStrictEqual(expected);
    });

    test('using the static method', () => {
      const actual = Converter.toMarkdown(JSON.stringify({
        foo: 'bar',
      }), (element) => {
        if (element.tag === Tag.HEADING) {
          element.value = toTitleCase(element.value);
        }
        return element;
      });

      const expected = `# Foo

bar
`;

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('should convert a JSON object to markdown', () => {
    test('by ignoring specified elements', () => {
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
      });

      const actual = converter
        // @ts-expect-error Ignore error for testing private method
        .convert((element) => {
          if (element.tag === Tag.HEADING && element.value.startsWith('_')) {
            return;
          }
          return element;
        })
        .getElements();

      const expected = [
        { tag: Tag.HEADING, level: 1, value: 'foo' },
        { tag: Tag.P, value: 'bar' },
        { tag: Tag.HEADING, level: 1, value: 'nested' },
        { tag: Tag.HEADING, level: 2, value: 'foo' },
        { tag: Tag.P, value: 'bar' },
      ];

      expect(actual).toStrictEqual(expected);
    });

    test('by applying the specified heading level', () => {
      const converter = new Converter({
        foo: 'bar',
      });

      const actual = converter
        // @ts-expect-error Ignore error for testing private method
        .convert((element) => {
          if (element.tag === Tag.HEADING) {
            element.level += 1;
          }
          return element;
        })
        .getElements();

      const expected = [
        { tag: Tag.HEADING, level: 2, value: 'foo' },
        { tag: Tag.P, value: 'bar' },
      ];

      expect(actual).toStrictEqual(expected);
    });

    test('by applying the heading value in title case format', () => {
      const converter = new Converter({
        foo: 'bar',
      });

      const actual = converter
        // @ts-expect-error Ignore error for testing private method
        .convert((element) => {
          if (element.tag === Tag.HEADING) {
            element.value = toTitleCase(element.value);
          }
          return element;
        })
        .getElements();

      const expected = [
        { tag: Tag.HEADING, level: 1, value: 'Foo' },
        { tag: Tag.P, value: 'bar' },
      ];

      expect(actual).toStrictEqual(expected);
    });

    test('by changing tags to specified tags', () => {
      const converter = new Converter({
        foo: 'bar',
        divider: 'divider',
        image: 'image',
        blockquote: 'blockquote',
      });

      const actual = converter.toMarkdown((element) => {
        if (element.tag === Tag.P && element.value === 'divider') {
          return {
            tag: Tag.HR,
          };
        }
        if (element.tag === Tag.P && element.value === 'image') {
          return {
            tag: Tag.IMG,
            src: 'https://example.com/image.png',
            alt: element.value,
          };
        }
        if (element.tag === Tag.P && element.value === 'blockquote') {
          return {
            tag: Tag.BLOCKQUOTE,
            value: element.value,
          };
        }
        return element;
      });

      const expected = `# foo

bar

# divider

---

# image

![image](https://example.com/image.png)

# blockquote

> blockquote
`;

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('should convert to markdown', () => {
    test('from a primitive', () => {
      const converter = new Converter('foo');

      const expected = 'foo\n';

      const actual = converter.toMarkdown();

      expect(actual).toBe(expected);
    });

    test('from a JSON object', () => {
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
            note: '| foo | bar | baz |\n| --- | --- | --- |\n| 1 | 2 | 3 |',
          },
          {
            id: 2,
            name: 'Bob',
            email: 'bob@example.com',
            friends: ['Charlie'],
            settings: JSON.stringify({ theme: 'dark' }),
            note: '```\n| foo | bar | baz |\n| --- | --- | --- |\n| 1 | 2 | 3 |\n```',
          },
          {
            id: 3,
            name: 'Charlie',
            email: 'charlie@example.com',
            friends: [],
            settings: `{\n"theme": "dark"\n}`,
            status: 'inactive',
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
          '- foo\n- bar\n- baz',
          '1. foo\n2. bar\n3. baz',
          '\\| foo \\| bar \\| baz \\|\n\\| --- \\| --- \\| --- \\|\n\\| 1 \\| 2 \\| 3 \\|',
        ],
        markdown_code: '```\nconsole.log(\'Hello, World!\');\n```',
        markdown_table: '| foo | bar | baz |\n| --- | --- | --- |\n| 1 | 2 | 3 |',
      };

      const converter = new Converter(data);

      const actual = converter.toMarkdown((element) => {
        if (element.tag === Tag.HEADING) {
          element.value = toTitleCase(element.value);
        }
        if (element.tag === Tag.TR) {
          element.values = element.values.map(value => toTitleCase(String(value)));
        }
        return element;
      });

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

| Id | Name | Email | Friends | Settings | Note | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Alice | alice@example.com | Bob, Charlie | {"theme":"dark"} | \\| foo \\| bar \\| baz \\|<br>\\| --- \\| --- \\| --- \\|<br>\\| 1 \\| 2 \\| 3 \\| |  |
| 2 | Bob | bob@example.com | Charlie | {"theme":"dark"} | \`\`\`<br>\\| foo \\| bar \\| baz \\|<br>\\| --- \\| --- \\| --- \\|<br>\\| 1 \\| 2 \\| 3 \\|<br>\`\`\` |  |
| 3 | Charlie | charlie@example.com |  | {<br>"theme": "dark"<br>} |  | inactive |

# Array

- 1
  - 2
    - 3
- {"foo":"bar"}
- -foo -bar -baz
- 1.foo 2.bar 3.baz
- \\| foo \\| bar \\| baz \\| \\| --- \\| --- \\| --- \\| \\| 1 \\| 2 \\| 3 \\|

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
});
