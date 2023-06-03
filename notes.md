# Just some things to remind myself while writing.

# Examples from reading json language service

Scanner error type 
```ts
export declare const enum ScanError {
    None = 0,
    UnexpectedEndOfComment = 1,
    UnexpectedEndOfString = 2,
    UnexpectedEndOfNumber = 3,
    InvalidUnicode = 4,
    InvalidEscapeCharacter = 5,
    InvalidCharacter = 6
}
```

Json parser seems to be aware of the lsp because the JSONDocument type has `Diagnostic` property from the server.

```ts
export class JSONDocument {

	constructor(public readonly root: ASTNode | undefined, public readonly syntaxErrors: Diagnostic[] = [], public readonly comments: Range[] = []) {
	}
```

Json.SyntaxKind is the enum that contains all possible tokens from the scanner.

```ts
export declare const enum SyntaxKind {
    OpenBraceToken = 1,
    CloseBraceToken = 2,
    OpenBracketToken = 3,
    CloseBracketToken = 4,
    CommaToken = 5,
    ColonToken = 6,
    NullKeyword = 7,
    TrueKeyword = 8,
    FalseKeyword = 9,
    StringLiteral = 10,
    NumericLiteral = 11,
    LineCommentTrivia = 12,
    BlockCommentTrivia = 13,
    LineBreakTrivia = 14,
    Trivia = 15,
    Unknown = 16,
    EOF = 17
}

```

Json.ScanError is the enum that contains all possible tokenization errors.

```ts
export declare const enum ScanError {
    None = 0,
    UnexpectedEndOfComment = 1,
    UnexpectedEndOfString = 2,
    UnexpectedEndOfNumber = 3,
    InvalidUnicode = 4,
    InvalidEscapeCharacter = 5,
    InvalidCharacter = 6
}
```

Scanning logic inside the parser. Basically only skip if is the following [comment, block comment, line break, trivia].

```ts
function _scanNext(): Json.SyntaxKind {
		while (true) {
			const token = scanner.scan();
			_checkScanError();
			switch (token) {
				case Json.SyntaxKind.LineCommentTrivia:
				case Json.SyntaxKind.BlockCommentTrivia:
					if (Array.isArray(commentRanges)) {
						commentRanges.push(Range.create(textDocument.positionAt(scanner.getTokenOffset()), textDocument.positionAt(scanner.getTokenOffset() + scanner.getTokenLength())));
					}
					break;
				case Json.SyntaxKind.Trivia:
				case Json.SyntaxKind.LineBreakTrivia:
					break;
				default:
					return token;
			}
		}
	}
```

`scanner.scan()`
```ts
// The usual scanner code + basically a lot of edge cases-handling
// Example of scanNumber
	function scanNumber(): string {
		let start = pos;
        // If 0, it's probably a decimal number, that's why they're skipping the next part and go straight to the dot.
		if (text.charCodeAt(pos) === CharacterCodes._0) {
			pos++;
		} else {
			pos++;
            // Eats up all numbers
			while (pos < text.length && isDigit(text.charCodeAt(pos))) {
				pos++;
			}
		}
        // Check for dot and then eat up all trailing digit. If there is a dot and no trailing digit, throw an error.
		if (pos < text.length && text.charCodeAt(pos) === CharacterCodes.dot) {
			pos++;
			if (pos < text.length && isDigit(text.charCodeAt(pos))) {
				pos++;
				while (pos < text.length && isDigit(text.charCodeAt(pos))) {
					pos++;
				}
			} else {
				scanError = ScanError.UnexpectedEndOfNumber;
				return text.substring(start, pos);
			}
		}
		let end = pos;
        // This checks the 
		if (pos < text.length && (text.charCodeAt(pos) === CharacterCodes.E || text.charCodeAt(pos) === CharacterCodes.e)) {
			pos++;
			if (pos < text.length && text.charCodeAt(pos) === CharacterCodes.plus || text.charCodeAt(pos) === CharacterCodes.minus) {
				pos++;
			}
			if (pos < text.length && isDigit(text.charCodeAt(pos))) {
				pos++;
				while (pos < text.length && isDigit(text.charCodeAt(pos))) {
					pos++;
				}
				end = pos;
			} else {
				scanError = ScanError.UnexpectedEndOfNumber;
			}
		}
		return text.substring(start, end);
	}
```

json is defined as a tree, but for our case, it should be an array (each day can live freely of the previous day).

# Examples from reading markdown language service

# Examples from reading prisma langauge service

---

Big goals

- [ ] The LSP parses the document and return a data structure as documented in the readme.md
- [ ] The LSP just take the document and return exact match 
- [ ] The LSP attempts to give an auto complete result
- [ ] The LSP shows errors when there are no matches.
- [ ] The LSP sends back semantic information about where to highlight inflected words

Notes:

Work is separated into two main parts, the syntax highlighter, and the semantics validator(from the lsp). The syntax highlighter does not really need 

Simple syntax highlighting for vocab.de files, things after > should be color A and things after >> should be color B. 

This will give you a rough idea of the name of those tokens.
Building up to the final result:

Focusing on semantic and syntax highlighting
- First -> Just simple highlights, like > and >>, and the dates.
- Then -> The new and reviewed vocabularies.
Highlihgting inflections will require semantic highlighting

Notes from reading json parsers:
syntax errors come from parser, 