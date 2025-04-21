import { Tag } from '~/constants';
import { Element, HeadingLevel } from '~/types';
import { safeParseJson } from '~/utils';

type ConvertHandler = (element: Element) => Element | undefined;

class Converter {
  private data: unknown;

  private elements: Element[] = [];

  private onConvert: ConvertHandler = element => element;

  constructor(data: unknown) {
    this.setData(data);
  }

  /**
   * Converts the provided data into Markdown format.
   */
  public static toMarkdown(data: unknown, callback?: ConvertHandler): string {
    return new Converter(data).toMarkdown(callback);
  }

  /**
   * Converts the provided data into Markdown format.
   */
  public toMarkdown(callback?: ConvertHandler): string {
    this.convert(callback);
    return this.elements
      .map((element) => {
        switch (element.tag) {
          case Tag.A: {
            return `[${element.value}](${element.href})\n\n`;
          }
          case Tag.BLOCKQUOTE: {
            return `> ${element.value}\n\n`;
          }
          case Tag.BR: {
            return '\n';
          }
          case Tag.HEADING: {
            return `${'#'.repeat(Math.max(1, Math.min(6, element.level)))} ${element.value}\n\n`;
          }
          case Tag.HR: {
            return '---\n\n';
          }
          case Tag.IMG: {
            return `![${element.alt}](${element.src})\n\n`;
          }
          case Tag.LI: {
            const escape = (v: string) => v
              .replaceAll('\n', ' ')
              .replace(/(?<=^|\s)(-\s*|\d+\.\s*)/g, match => match.trim());
            return `${'  '.repeat(element.indent)}- ${escape(element.value)}\n`;
          }
          case Tag.P: {
            return `${element.value}\n\n`;
          }
          case Tag.PRE: {
            return `\`\`\`\n${element.value}\n\`\`\`\n\n`;
          }
          case Tag.TD: {
            const escape = (v: string) => v
              .replaceAll('|', '\\|')
              .replace(/\r\n|\r|\n/g, '<br>');
            return `| ${element.values.map(escape).join(' | ')} |\n`;
          }
          case Tag.TR: {
            return `| ${element.values.join(' | ')} |\n| ${element.values.map(() => '---').join(' | ')} |\n`;
          }
          default: {
            return '';
          }
        }
      })
      .join('')
      .replace(/\n{2,}$/, '\n');
  }

  public setData(data: unknown): this {
    const json = safeParseJson(data);
    this.data = json ?? data;
    return this;
  }

  public getElements(): Element[] {
    return this.elements;
  }

  private pushElement(element: Element): boolean {
    const converted = this.onConvert(element);
    if (!converted) return false;
    this.elements.push(converted);
    return true;
  }

  private convert(callback?: ConvertHandler): this {
    if (callback) {
      this.onConvert = callback;
    }
    if (Array.isArray(this.data)) {
      return this.convertFromArray(this.data);
    }
    if (typeof this.data === 'object') {
      return this.convertFromObject(this.data as Record<string, unknown>);
    }
    return this.convertFromPrimitive(this.data);
  }

  private convertFromArray(data: unknown[], indent: number = 0): this {
    if (data === undefined || data === null) {
      this.convertFromPrimitive(data);
      return this;
    }
    if (data.length > 0 && data.every(item => typeof item === 'object' && item !== null && Object.keys(item).length > 0)) {
      const keys = [...new Set(data.map(Object.keys as (item: unknown) => string[]).flat())];
      this.pushElement({
        tag: Tag.TR,
        values: keys,
      });
      data.forEach((item) => {
        this.pushElement({
          tag: Tag.TD,
          values: keys.map(key => this.formatValue((item as Record<string, unknown>)[key])),
        });
      });
      return this;
    }
    for (const item of data) {
      if (Array.isArray(item)) {
        this.convertFromArray(item, indent + 1);
        continue;
      }
      this.pushElement({
        tag: Tag.LI,
        value: this.formatValue(item),
        indent,
      });
    }
    return this;
  }

  private convertFromObject(data: Record<string, unknown>, level: number = 0): this {
    if (data === undefined || data === null) {
      this.convertFromPrimitive(data);
      return this;
    }
    for (const [key, value] of Object.entries(data)) {
      const isPushed = this.pushElement({
        tag: Tag.HEADING,
        value: key,
        level: level + 1 as HeadingLevel,
      });
      if (!isPushed) {
        continue;
      }
      if (Array.isArray(value)) {
        this.convertFromArray(value);
        this.pushElement({
          tag: Tag.BR,
        });
        continue;
      }
      if (typeof value === 'object') {
        this.convertFromObject(value as Record<string, unknown>, level + 1);
        continue;
      }
      this.convertFromPrimitive(value);
    }
    return this;
  }

  private convertFromPrimitive(value: unknown): this {
    this.pushElement({
      tag: Tag.P,
      value: this.formatValue(value),
    });
    return this;
  }

  private formatValue(value: unknown): string {
    if (value === undefined || value === null) {
      return '';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value).trim();
  }
}

export default Converter;
