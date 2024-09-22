interface MarkdownSchema {
  [key: string]: string | string[] | boolean | undefined;
  h1?: string;
  h2?: string;
  h3?: string;
  h4?: string;
  h5?: string;
  h6?: string;
  p?: string | boolean;
  ul?: string[];
}

export default MarkdownSchema;
