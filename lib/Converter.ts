import { MarkdownSchema } from '~/types';
import { toTitleCase } from './utils';

class Converter {
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
