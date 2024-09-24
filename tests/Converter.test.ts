import { expect, test } from 'vitest';
import Converter from '../lib/Converter';
import after from '../tests/data/after.js';
import before from '../tests/data/before.js';

test('Converter.toMarkdownSchema', () => {
  const schema = Converter.toMarkdownSchema({
    title: 'Hello, World!', 
  });

  expect(schema).toStrictEqual([
    { h1: 'title' },
    { p: 'Hello, World!' },
  ]);
});

test('Converter.toMarkdown', () => {
  const markdown = Converter.toMarkdown(before);

  expect(markdown).toBe(after);
});
