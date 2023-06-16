import { TextDocument } from 'vscode-languageserver-textdocument';
import { CharacterCodes } from './consts';

export enum ScanTokenType {}

// TODO @khongchai
export const enum ScanError {
  None,
}

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
export const enum VocabToken {
  Aesterisk,
  Comma,
  EOF,
  Hash,
  NewVocab,
  ReviewedVocab,
  RightShift,
  DoubleRightShift,
  Sentence,
}

export class VocabScanner {
  private readonly _text: string;
  private _pos: number;
  private _currentToken: VocabToken;

  constructor(text: string) {
    this._text = text;
    this._pos = 0;
    this._currentToken = this._readNextCharacter(); // read the first char.
  }

  *tokens(): Generator<VocabToken> {
    while (this._currentToken != VocabToken.EOF) {
      yield (this._currentToken = this._readNextCharacter());
    }
  }

  private _readNextCharacter(): VocabToken {
    if (this._pos >= this._text.length) {
      return (this._currentToken = VocabToken.EOF);
    }
    let charCode = this._text.charCodeAt(this._pos++);
    switch (charCode) {
      case CharacterCodes.asterisk:
        return (this._currentToken = VocabToken.Aesterisk);
      case CharacterCodes.comma:
        return (this._currentToken = VocabToken.Comma);
      case CharacterCodes.hash:
        return (this._currentToken = VocabToken.Hash);
      case CharacterCodes.rightShift:
        return (this._currentToken = _handleRightShift());
      default:
        if (this._isWhiteSpace(charCode)) {
          do {
            this._pos++;
            charCode = this._text.charCodeAt(this._pos);
          } while (this._isWhiteSpace(charCode));
          return (this._currentToken = this._readNextCharacter());
        } else if (this._isLineBreak(charCode)) {
          return this._handleLineBreak();
        } else if (this._isDigit(charCode)) {
          return this._handleDigit();
        } else {
          return this._handleCharacters();
        }

        break;
    }
  }

  private _isWhiteSpace(ch: number): boolean {
    return ch === CharacterCodes.space || ch === CharacterCodes.tab;
  }

  private _isLineBreak(ch: number): boolean {
    return (
      ch === CharacterCodes.lineFeed || ch === CharacterCodes.carriageReturn
    );
  }

  private _isDigit(ch: number): boolean {
    return ch >= CharacterCodes._0 && ch <= CharacterCodes._9;
  }
}
