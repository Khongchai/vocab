export type SemanticTokensReturnPattern = [
  number, // line
  number, // startChar
  number, // length
  number, // tokenType
  number, // tokenModifiers
  ...number[]
];
