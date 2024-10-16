interface MarkdownSchema {
  [key: string]: unknown;
  br?: string;
  h1?: string;
  h2?: string;
  h3?: string;
  h4?: string;
  h5?: string;
  h6?: string;
  indent?: number;
  li?: unknown;
  p?: string | boolean;
  td?: string[];
  tr?: string[];
}

export default MarkdownSchema;
