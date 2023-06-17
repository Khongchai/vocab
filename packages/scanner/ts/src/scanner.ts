import { CharacterCodes, LineToken, ScanError, VocabToken } from "./consts";

export interface Cursor {
  /**
   * The line (row). This increases at every line break.
   */
  line: number;
  pos: number;
  /**
   * The column, calculated as pos % line
   */
  column: () => number;
  token: VocabToken;
  error: ScanError;
  /**
   * Lazy computation of the actual token. Computed as substring(pos - tokenLength, pos + 1)
   */
  tokenValue: () => string;
  tokenLength: number;
  lastLineToken: LineToken;
}

export class VocabScanner {
  private readonly _text: string;
  private _c: Cursor;

  constructor(text: string) {
    this._text = text;
    this._c = {
      line: 0,
      pos: 0,
      column: function() {
        return this.pos % this.line;
      },
      error: ScanError.Keiner,
      token: VocabToken.Unknown,
      tokenLength: 0,
      tokenValue: function() {
        const end = this.pos; // no need to + 1
        return text.substring(end - this.tokenLength, end);
      },
      lastLineToken: LineToken.None,
    };
  }

  /**
   * @returns The computed value the current token represent.
   */
  getTokenValue(): string {
    const value = this._c.tokenValue();
    return value;
  }

  getScanError(): ScanError {
    return this._c.error;
  }

  getPos(): number {
    return this._c.pos;
  }

  getColumn(): number {
    return this._c.column();
  }

  getCurrentLine(): number {
    return this._c.line;
  }

  getText(): string {
    return this._text;
  }

  getTokenLength(): number {
    return this._c.tokenLength;
  }

  *tokens(): Generator<VocabToken> {
    while (this._c.token != VocabToken.EOF) {
      this._readNextCharacter();
      yield this._c.token;
    }

    yield VocabToken.EOF;
  }

  /**
   * Read next char and updates row, column token, error accordingly.
   */
  private _readNextCharacter(): void {
    if (this._c.pos >= this._text.length) {
      this._c.token = VocabToken.EOF;
      return;
    }

    // Fast skip if new line.
    if (this._isLineBreak(this._text.charCodeAt(this._c.pos))) {
      return this._handleLineBreak({
        lastLineToken: this._c.lastLineToken,
      });
    }

    const isFirstColumn = this._c.column() === 0;

    // If that number is at the first line, or is a number that follows a bunch of examples, and
    // the token at postiion + 2 after it is a slash, we can be quite certain that it is a date.
    const isDateLine =
      isFirstColumn &&
      this._isDigit(this._text.charCodeAt(this._c.pos)) &&
      [LineToken.None, LineToken.ExampleLine].includes(this._c.lastLineToken) &&
      CharacterCodes.slash == this._peek(2);

    // We'll do just a simple validation: check if there are 2 slashes.
    // the rest, we'll leave it to the parser
    if (isDateLine) {
      while (true) {
        // TODO @khongchai continue parsing the date from here.
      }
    }

    const isVocabLine =
      isFirstColumn &&
      this._text.charCodeAt(this._c.pos) === CharacterCodes.rightShift;
    if (isVocabLine) {
      const peeked = this._peek();
      if (!peeked) {
        this._c.error = ScanError.UnexpectedCharacter;
      }
      const c = this._text.charCodeAt(peeked!);
      if (this._isLineBreak(c)) {
        return this._handleLineBreak({
          lastLineToken: LineToken.NewVocabLine,
        });
      } else if (c === CharacterCodes.rightShift) {
        return this._handleDoubleRightShift();
      } else {
        return this._handleRightShift();
      }
    }
  }

  private _handleLineBreak({
    lastLineToken,
  }: {
    lastLineToken: LineToken;
  }): void {
    this._c.tokenLength = 1;
    this._c.lastLineToken = lastLineToken;

    this._c.token = VocabToken.LineBreak;
    this._c.line++;
    this._c.pos++;
    return;
  }

  private _handleDoubleRightShift(): void {}

  private _handleRightShift(): void {}

  /**
   * @returns charCode or undefined if EOF
   */
  private _peek(amount = 1): number | undefined {
    const peekedPos = this._c.pos + amount;
    if (peekedPos >= this._text.length) {
      return undefined;
    }
    return this._text[peekedPos].charCodeAt(0);
  }

  // private _isWhiteSpace(ch: number): boolean {
  //   return ch === CharacterCodes.space || ch === CharacterCodes.tab;
  // }

  private _isLineBreak(ch: number): boolean {
    return (
      ch === CharacterCodes.lineFeed || ch === CharacterCodes.carriageReturn
    );
  }

  private _isDigit(ch: number): boolean {
    return ch >= CharacterCodes._0 && ch <= CharacterCodes._9;
  }
}
