import { toTitleCase } from '@memochou1993/stryle';
import { MarkdownSchema } from '~/types';

interface ConverterOptions {
  initialHeadingLevel?: number;
  disableTitleCase?: boolean;
}

class Converter {
  private schema: MarkdownSchema[] = [];

  private startLevel: number;

  private disableTitleCase: boolean;

  constructor(data: unknown, options: ConverterOptions = {}) {
    this.startLevel = options.initialHeadingLevel ?? 1;
    this.disableTitleCase = options.disableTitleCase ?? false;
    this.convert(data);
  }

  public static toMarkdown(data: unknown, options: ConverterOptions = {}): string {
    return new Converter(data, options).toMarkdown();
  }

  /**
   * Converts the provided data into Markdown format.
   *
   * This method processes a data structure and converts it into
   * Markdown, handling headings, list items, table rows, and paragraphs.
   */
  public toMarkdown(): string {
    const headings = Array.from({ length: 6 }, (_, i) => `h${i + 1}`);
    return this.schema
      .map((element) => {
        const level = headings.findIndex(h => element[h] !== undefined);
        if (level !== -1) {
          return `${'#'.repeat(level + 1)} ${this.toTitleCase(String(element[headings[level]]))}\n\n`;
        }
        if (element.li !== undefined) {
          return `${'  '.repeat(Number(element.indent))}- ${element.li}\n`;
        }
        if (element.tr !== undefined) {
          return `| ${element.tr.map(v => this.toTitleCase(v)).join(' | ')} |\n${element.tr.map(() => '| ---').join(' ')} |\n`;
        }
        if (element.td !== undefined) {
          return `| ${element.td.join(' | ')} |\n`;
        }
        if (typeof element.p === 'boolean') {
          return `${this.toTitleCase(String(element.p))}\n\n`;
        }
        if (element.br !== undefined) {
          return '\n';
        }
        return `${element.p}\n\n`;
      })
      .join('');
  }

  private convert(data: unknown): void {
    if (!data) return;
    if (Array.isArray(data)) {
      this.convertFromArray(data);
      return;
    }
    if (typeof data === 'object') {
      this.convertFromObject(data as Record<string, unknown>);
      return;
    }
    this.convertFromPrimitive(data);
  }

  private convertFromArray(data: unknown[], indent: number = 0): MarkdownSchema[] {
    for (const item of data) {
      if (Array.isArray(item)) {
        this.convertFromArray(item, indent + 1);
        continue;
      }
      this.schema.push({
        li: this.formatValue(item),
        indent,
      });
    }
    return this.schema;
  }

  private convertFromObject(data: Record<string, unknown>, level: number = 0): MarkdownSchema[] {
    const heading = `h${Math.min(Math.max(this.startLevel, 1) + level, 6)}`;
    for (let [key, value] of Object.entries(data)) {
      key = key.trim();
      if (typeof value === 'string') {
        value = value.trim().replaceAll('\\n', '\n');
      }
      this.schema.push({
        [heading]: key,
      });
      if (Array.isArray(value)) {
        const [item] = value;
        if (typeof item === 'object') {
          this.schema.push({
            tr: Object.keys(item),
          });
          value.forEach((item) => {
            this.schema.push({
              td: Object.values(item).map(v => this.formatValue(v)),
            });
          });
          this.schema.push({
            br: '',
          });
          continue;
        }
        this.convertFromArray(value);
        this.schema.push({
          br: '',
        });
        continue;
      }
      if (typeof value === 'object') {
        this.convertFromObject(value as Record<string, unknown>, level + 1);
        continue;
      }
      this.convertFromPrimitive(value);
    }
    return this.schema;
  }

  private convertFromPrimitive(value: unknown): MarkdownSchema[] {
    this.schema.push({
      p: this.formatValue(value),
    });
    return this.schema;
  }

  private formatValue(value: unknown): string {
    if (Array.isArray(value)) {
      return value.map(v => this.formatValue(v)).join(', ');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }

  private toTitleCase(value: string): string {
    if (this.disableTitleCase) return value;
    return toTitleCase(value);
  }
}

export default Converter;
