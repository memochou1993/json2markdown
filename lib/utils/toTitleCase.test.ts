import { expect, test } from 'vitest';
import toTitleCase from './toTitleCase';

test('toTitleCase', () => {
  const cases = [
    ['foo bar', 'Foo Bar'],
    ['foo_bar', 'Foo Bar'],
    ['foo-bar', 'Foo Bar'],
    ['isJsonParser', 'Is Json Parser'],
    ['isJSONParser', 'Is JSON Parser'],
    ['Is this a JSON parser?', 'Is This a JSON Parser?'],
  ];
  
  cases.forEach(([input, expected]) => {
    const actual = toTitleCase(input);
    expect(actual).toBe(expected);
  });
});
