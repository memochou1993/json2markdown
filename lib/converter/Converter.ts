import { MarkdownSchema } from '~/types';
import { toTitleCase } from '~/utils';

class Converter {
  /**
   * Converts a given data object into a Markdown string.
   * 
   * This method processes the data and identifies headings, unordered lists,
   * and paragraph elements, formatting them according to Markdown syntax.
   * 
   * @param data - A record representing the input data to be converted.
   * @returns A string formatted in Markdown based on the input data.
   */
  static toMarkdown(data: Record<string, unknown>) {
    const headings = Array.from({ length: 6 }, (_, i) => `h${i + 1}`);
    return Converter.toMarkdownSchema(data)
      .map((element) => {
        const level = headings.findIndex(h => element[h]);
        if (level !== -1) {
          return `${'#'.repeat(level + 1)} ${toTitleCase(element[headings[level]] as string)}\n\n`;
        }
        if (element.ul) {
          return `${element.ul.map(li => `- ${li}\n`).join('')}\n`;
        }
        if (typeof element.p === 'boolean') {
          return `${toTitleCase(String(element.p))}\n\n`;
        }
        return `${element.p}\n\n`;
      })
      .join('');
  }

  /**
   * Constructs a Markdown schema from a given data object.
   * 
   * This method recursively traverses the data object to build a schema that
   * identifies headings, lists, and paragraphs, which will later be converted to Markdown.
   * 
   * @param data - A record representing the input data.
   * @param level - The current heading level (default is 1).
   * @param schema - An array that accumulates the schema entries (default is an empty array).
   * @returns An array representing the schema for the Markdown conversion.
   */
  static toMarkdownSchema(data: Record<string, unknown>, level: number = 1, schema: MarkdownSchema[] = []) {
    if (!data) return [];
    const heading = `h${Math.min(level, 6)}`;
    for (let [key, value] of Object.entries(data)) {
      if (key.startsWith('_')) continue;
      key = key.trim();
      if (typeof value === 'string') {
        value = value.trim().replaceAll('\\n', '\n');
      }
      schema.push({ [heading]: key });
      if (Array.isArray(value)) {
        const [item] = value;
        if (Array.isArray(item) && item.length > 0) {
          schema.push({ ul: value.map(item => JSON.stringify(item)) });
          continue;
        }
        if (typeof item === 'object') {
          Converter.toMarkdownSchema(item, level + 1, schema);
          continue;
        }
        schema.push({ ul: value.map(item => typeof item === 'string' ? item : JSON.stringify(item)) });
        continue;
      }
      if (typeof value === 'object') {
        Converter.toMarkdownSchema(value as Record<string, unknown>, level + 1, schema);
        continue;
      }
      schema.push({ p: value as string });
    }
    return schema;
  }
}

export default Converter;
