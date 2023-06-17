import { CharacterCodes, ScanError, VocabToken } from './consts';

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

    let charCode = this._text.charCodeAt(this._c.pos);

    if (this._isLineBreak(charCode)) {
      const peeked = this._peek();
      if (peeked && this._isLineBreak(peeked)) {
        this._c.line++;
        this._c.pos++;
        this._c.error = ScanError.DoubleNewLine;
        this._c.tokenLength = 2;
      } else {
        this._c.tokenLength = 1;
      }

      this._c.line++;
      this._c.token = VocabToken.LineBreak;
      this._c.pos++;
      return;
    }

    // Beginning of line and possibly a date.
    // let column = this._c.column();
    // if (column == 0 && this._isDigit(charCode)) {
    //   let dateSection: 'dd' | 'mm' | 'yyyy' = 'dd';

    //   do {
    //     column++;
    //     if (
    //       this._text.charCodeAt(this._c.pos + column) === CharacterCodes.slash
    //     ) {
    //       column++; // skip slash
    //       if (dateSection == 'dd') {
    //         dateSection = 'mm';
    //         continue;
    //       }

    //       if (dateSection === 'mm') {
    //         dateSection = 'yyyy';
    //         continue;
    //       }

    //       // if (dateSection === 'yyyy') {
    //       //   this._c.error = ScanError.InvalidDateFormat;
    //       //   this._c.token = VocabToken.Date;
    //       // }
    //     } else if (dateSection === 'yyyy') {
    //     }
    //   } while (this._isDigit(charCode));

    //   // It should have returned already if valid.
    //   this._c.error = ScanError.InvalidDateFormat;
    //   this._c.token = VocabToken.Date;
    // }

    // switch (charCode) {
    //   case CharacterCodes.rightShift:
    //     const peeked = this._peek();
    //     if (peeked == CharacterCodes.rightShift) {
    //       return (this._c.token = VocabToken.DoubleRightShift);
    //     }
    //     return (this._c.token = VocabToken.RightShift);
    //   case CharacterCodes.asterisk:
    //     return (this._c.token = VocabToken.Aesterisk);
    //   case CharacterCodes.comma:
    //     return (this._c.token = VocabToken.Comma);
    //   case CharacterCodes.hash:
    //     return (this._c.token = VocabToken.Hash);
    //   default:
    //     if (this._isWhiteSpace(charCode)) {
    //       do {
    //         this._c.row++;
    //         charCode = this._text.charCodeAt(this._c.row);
    //       } while (this._isWhiteSpace(charCode));
    //       return (this._c.token = this._readNextCharacter());
    //     } else if (this._isLineBreak(charCode)) {
    //       return this._handleLineBreak();
    //     } else if (this._isDigit(charCode)) {
    //       return this._handleDigit();
    //     } else {
    //       return this._handleCharacters();
    //     }

    //     break;
    // }
  }

  /**
   * Don't forget to ++ after every peek.
   *
   * @returns charCode or undefined if EOF
   */
  private _peek(): number | undefined {
    const peekedPos = this._c.pos + 1;
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

  // private _isDigit(ch: number): boolean {
  //   return ch >= CharacterCodes._0 && ch <= CharacterCodes._9;
  // }
}
