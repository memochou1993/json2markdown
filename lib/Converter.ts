import { MarkdownSchema } from '~/types';

let titleCase = (v: string) => v;

try {
  const scule = await import('scule');
  titleCase = scule.titleCase;
} catch {
  //
}

class Converter {
  static toMarkdownSchema(obj: object, schema: MarkdownSchema[] = [], level = 1) {
    if (!obj) return [];
    for (let [key, value] of Object.entries(obj)) {
      if (key.startsWith('_')) continue;
      key = key.trim();
      if (typeof value === 'string') {
        value = value.trim().replaceAll('\\n', '\n');
      }
      const tag = `h${Math.min(level, 6)}`;
      schema.push({ [tag]: key });
      if (Array.isArray(value)) {
        const [item] = value;
        if (Array.isArray(item) && item.length > 0) {
          schema.push({ ul: value.map(item => JSON.stringify(item)) });
          continue;
        }
        if (typeof item === 'object') {
          Converter.toMarkdownSchema(item, schema, level + 1);
          continue;
        }
        schema.push({ ul: value.map(item => typeof item === 'string' ? item : JSON.stringify(item)) });
        continue;
      }
      if (typeof value === 'object') {
        Converter.toMarkdownSchema(value, schema, level + 1);
        continue;
      }
      schema.push({ p: value });
    }
    return schema;
  }

  static toMarkdown(schema: MarkdownSchema[]) {
    return schema
      .map((element) => {
        const headers = Array.from({ length: 6 }, (_, i) => `h${i + 1}`);
        const level = headers.findIndex(h => element[h]);
        if (level !== -1) {
          return `${'#'.repeat(level + 1)} ${titleCase(element[headers[level]] as string)}\n\n`;
        }
        if (element.ul) {
          return `${element.ul.map(li => `- ${li}\n`).join('')}\n`;
        }
        if (typeof element.p === 'boolean') {
          return `${titleCase(String(element.p))}\n\n`;
        }
        return `${element.p}\n\n`;
      })
      .join('');
  }
}

export default Converter;
