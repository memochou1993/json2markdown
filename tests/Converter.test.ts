import { readFileSync } from 'fs';
import { expect, test } from 'vitest';
import Converter from '../lib/Converter';

const { dirname } = import.meta;

test('Converter.toMarkdownSchema', () => {
  const schema = Converter.toMarkdownSchema({ title: 'Hello, World!' });

  expect(schema).toStrictEqual([
    { h1: 'title' },
    { p: 'Hello, World!' },
  ]);
});

test('Converter.toMarkdown', () => {
  const before = readFileSync(`${dirname}/data/before.json`, 'utf-8');
  const after = readFileSync(`${dirname}/data/after.md`, 'utf-8');
  
  const markdown = Converter.toMarkdown(JSON.parse(before));

  expect(markdown).toBe(after);
});
