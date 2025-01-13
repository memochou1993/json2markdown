import Tags from '~/constants/Tags';
import { Element, HeadingLevel } from '~/types';

interface ConverterOptions {
  onConvert?: (element: Element) => Element | undefined;
}

class Converter {
  private elements: Element[] = [];

  private onConvert: (element: Element) => Element | undefined;

  constructor(json: unknown, options: ConverterOptions = {}) {
    this.onConvert = options.onConvert ?? ((element: Element) => element);
    if (json) this.convert(json);
  }

  /**
   * Converts the provided json into Markdown format.
   */
  public static toMarkdown(json: unknown, options: ConverterOptions = {}): string {
    return new Converter(json, options).toMarkdown();
  }

  /**
   * Converts the provided json into Markdown format.
   */
  public toMarkdown(): string {
    return this.elements
      .map((element) => {
        switch (element.tag) {
          case Tags.A:
            return `[${element.value}](${element.href})\n\n`;
          case Tags.BR:
            return '\n';
          case Tags.HEADING:
            return `${'#'.repeat(Math.max(1, Math.min(6, element.level)))} ${element.value}\n\n`;
          case Tags.IMG:
            return `![${element.alt}](${element.src})\n\n`;
          case Tags.LI:
            return `${'  '.repeat(element.indent)}- ${element.value}\n`;
          case Tags.P:
            return `${element.value}\n\n`;
          case Tags.PRE:
            return `\`\`\`\n${element.value}\n\`\`\`\n\n`;
          case Tags.TD:
            return `| ${element.values.map((value) => {
              if (typeof value === 'string') {
                return value.replaceAll('\n', '<br>');
              }
              return value;
            }).join(' | ')} |\n`;
          case Tags.TR:
            return `| ${element.values.join(' | ')} |\n| ${element.values.map(() => '---').join(' | ')} |\n`;
          default:
            return '';
        }
      })
      .join('');
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

  private convert(json: unknown): void {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    if (Array.isArray(data)) {
      this.convertFromArray(data);
      return;
    }
    this.convertFromObject(data);
  }

  private convertFromArray(data: unknown[], indent: number = 0): this {
    if (data === undefined || data === null) {
      this.convertFromPrimitive(data);
      return this;
    }
    if (data.length > 0 && data.every(item => typeof item === 'object' && item !== null && Object.keys(item).length > 0)) {
      const [item] = data;
      this.pushElement({
        tag: Tags.TR,
        values: Object.keys(item as object),
      });
      data.forEach((item) => {
        this.pushElement({
          tag: Tags.TD,
          values: Object.values(item as object).map(value => this.formatValue(value)),
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
        tag: Tags.LI,
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
        tag: Tags.HEADING,
        value: key,
        level: level + 1 as HeadingLevel,
      });
      if (!isPushed) {
        continue;
      }
      if (Array.isArray(value)) {
        this.convertFromArray(value);
        this.pushElement({
          tag: Tags.BR,
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
      tag: Tags.P,
      value: this.formatValue(value),
    });
    return this;
  }

  private formatValue(value: unknown): unknown {
    if (value === undefined || value === null) {
      return '';
    }
    if (Array.isArray(value)) {
      return value.map(v => this.formatValue(v)).join(', ');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  }
}

export default Converter;
