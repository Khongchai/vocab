import { CharacterCodes, ScanError, VocabToken } from './consts';

/**
 * A "vocab" represents a word, phrases, or sentences that a user memorizes on that day.
 *
 * For example, the following has three tokens, [Ant, Bird, Big Bird]
 *
 * ```vocab
 * > Ant, Bird, Big Bird
 *```
 *
 * Basically, a token is concluded when the scanner encounters a comma.
 */

export interface Cursor {
  /**
   * The line. This increases at every line break.
   */
  line: number;
  pos: number;
  /**
   * The row, calculated as pos % line
   */
  row: () => number;
  token: VocabToken;
  error: ScanError;
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
      row: function() {
        return this.pos % this.line;
      },
      tokenLength: 0,
      error: ScanError.Keiner,
      token: VocabToken.Unknown,
    };
  }

  getScanError(): ScanError {
    return this._c.error;
  }

  getPos(): number {
    return this._c.pos;
  }

  getRow(): number {
    return this._c.row();
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
        this._c.pos++;
        this._c.error = ScanError.DoubleNewLine;
      }

      this._c.line++;
      this._c.token = VocabToken.LineBreak;
      this._c.pos++;
      return;
    }

    if (this._isDigit(charCode)) {
    }

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

  private _isDigit(ch: number): boolean {
    return ch >= CharacterCodes._0 && ch <= CharacterCodes._9;
  }
}
