import { Tag } from '~/constants';
import HeadingLevel from './HeadingLevel';

export interface AnchorElement {
  tag: typeof Tag.A;
  href: string;
  value: string;
}

export interface BlockquoteElement {
  tag: typeof Tag.BLOCKQUOTE;
  value: string;
}

export interface BreakElement {
  tag: typeof Tag.BR;
}

export interface HeadingElement {
  tag: typeof Tag.HEADING;
  value: string;
  level: HeadingLevel;
}

export interface HorizontalRuleElement {
  tag: typeof Tag.HR;
}

export interface ImageElement {
  tag: typeof Tag.IMG;
  src: string;
  alt: string;
}

export interface ListItemElement {
  tag: typeof Tag.LI;
  value: unknown;
  indent: number;
}

export interface ParagraphElement {
  tag: typeof Tag.P;
  value: unknown;
}

export interface PreformattedTextElement {
  tag: typeof Tag.PRE;
  value: string;
}

export interface TableDataElement {
  tag: typeof Tag.TD;
  values: unknown[];
}

export interface TableRowElement {
  tag: typeof Tag.TR;
  values: unknown[];
}

type Element =
  | AnchorElement
  | BlockquoteElement
  | BreakElement
  | HeadingElement
  | HorizontalRuleElement
  | ImageElement
  | ListItemElement
  | ParagraphElement
  | PreformattedTextElement
  | TableDataElement
  | TableRowElement;

export default Element;
