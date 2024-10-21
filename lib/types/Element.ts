import Tags from '~/constants/Tags';
import HeadingLevel from './HeadingLevel';

export interface AnchorElement {
  tag: typeof Tags.A;
  href: string;
  value: string;
}

export interface BreakElement {
  tag: typeof Tags.BR;
}

export interface HeadingElement {
  tag: typeof Tags.HEADING;
  value: string;
  level: HeadingLevel;
}

export interface ImageElement {
  tag: typeof Tags.IMG;
  src: string;
  alt: string;
}

export interface ListItemElement {
  tag: typeof Tags.LI;
  value: unknown;
  indent: number;
}

export interface ParagraphElement {
  tag: typeof Tags.P;
  value: unknown;
}

export interface PreformattedTextElement {
  tag: typeof Tags.PRE;
  value: string;
}

export interface TableDataElement {
  tag: typeof Tags.TD;
  values: unknown[];
}

export interface TableRowElement {
  tag: typeof Tags.TR;
  values: unknown[];
}

type Element =
  | AnchorElement
  | BreakElement
  | HeadingElement
  | ImageElement
  | ListItemElement
  | ParagraphElement
  | PreformattedTextElement
  | TableDataElement
  | TableRowElement;

export default Element;
