import '../../../parser/ts/dist';
import { ScanError, VocabToken } from '../src/consts';
import { VocabScanner } from '../src/scanner';

function assertTokens(
  text: string,
  ...tokens: {
    token: VocabToken;
    error: ScanError;
  }[]
): void {
  const scanner = new VocabScanner(text);
  let i: number = 0;
  // TODO @khongchai Pretty readable, but check how this impacts performance.
  for (const token of scanner.tokens()) {
    if (token == VocabToken.EOF) break;
    expect(token).toBe(tokens[i].token);
    expect(scanner.getScanError()).toBe(tokens[i].error);
    i++;
  }

  expect(scanner.getPos()).toBe(text.length); // EOF is at text.length
}

// function assertTokensAndError(
//   text: string,
//   {
//     errorPosition,
//     errorToken,
//   }: {
//     // The index of the parsed string where the error is expected to be found.
//     errorPosition: number;
//     errorToken: ScanError;
//   },
//   ...tokens: VocabToken[]
// ): void {
//   const scanner = new VocabScanner(text);
//   for (let i = 0; i < tokens.length; i++) {
//     assertSameInstance(scanner.next(), tokens.shift());
//     if (i === errorPosition) {
//       assertSameInstance(errorToken, scanner.getErrorToken());
//     }
//   }
//   assertSameInstance(scanner.getToken(), VocabToken.EOF);
// }

describe('Simple tokens scan', () => {
  it('Parses new line correctly', () => {
    assertTokens('\n\n', {
      token: VocabToken.LineBreak,
      error: ScanError.DoubleNewLine,
    });
    assertTokens('\r\r', {
      token: VocabToken.LineBreak,
      error: ScanError.DoubleNewLine,
    });
    assertTokens('\n', {
      token: VocabToken.LineBreak,
      error: ScanError.Keiner,
    });
    assertTokens('\n', {
      token: VocabToken.LineBreak,
      error: ScanError.Keiner,
    });
  });
  // it('Scans token correctly', () => {
  //   assertTokens('>', VocabToken.RightShift);
  //   assertTokens('>>', VocabToken.DoubleRightShift);
  //   assertTokens('20/05/2023', VocabToken.Date);
  //   assertTokens('>>', VocabToken.DoubleRightShift);
  //   assertTokens('Hello, how are you?', VocabToken.Sentence);
  // });
  // it('parses date vocabs', () => {
  //   assertTokens('25/06/2023', VocabToken.Date);
  //   assertTokens('25/06/20233', VocabToken.Date);
  //   assertTokens('06/25/2023', VocabToken.Date);
  //   assertTokens('06/25/2023', VocabToken.Date);
  // });
  // it('parses new vocabs', () => {});
  // it('parses reviewed vocabs', () => {});
  // it('parses sentences vocabs', () => {});
  // it('parses a section', () => {});

  // Errors

  // it('Throws error', () => {});
});
