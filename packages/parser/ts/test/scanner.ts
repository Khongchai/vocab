import '../';
import { ScanError, VocabToken } from '../src/tokens';
import { assertSameInstance } from './asserts';

function assertTokens(text: string, ...tokens: VocabToken[]): void {
  const scanner = new Scanner(text);
  for (const token of scanner.tokens) {
    assertSameInstance(tokens.shift(), token);
    assertSameInstance(scanner.getErrorToken(), ScanError.None);
  }
  assertSameInstance(tokens.length, 0);
}

function assertTokensAndError(
  text: string,
  {
    errorPosition,
    errorToken,
  }: {
    // The index of the parsed string where the error is expected to be found.
    errorPosition: number;
    errorToken: ScanError;
  },
  ...tokens: VocabToken[]
): void {
  const scanner = new Scanner(text);
  for (let i = 0; i < tokens.length; i++) {
    assertSameInstance(scanner.next(), tokens.shift());
    if (i === errorPosition) {
      assertSameInstance(errorToken, scanner.getErrorToken());
    }
  }
  assertSameInstance(scanner.getToken(), VocabToken.EOF);
}

describe('Simple tokens scan', () => {
  it('Scans token correctly', () => {
    assertTokens('>', VocabToken.RightShift);
    assertTokens('>>', VocabToken.DoubleRightShift);
    assertTokens('20/05/2023', VocabToken.Date);
    assertTokens('>>', VocabToken.DoubleRightShift);
    assertTokens('Hello, how are you?', VocabToken.Sentence);
  });
  it('parses date vocabs', () => {
    assertTokens('25/06/2023', VocabToken.Date);
    assertTokens('25/06/20233', VocabToken.Date);
    assertTokens('06/25/2023', VocabToken.Date);
    assertTokens('06/25/2023', VocabToken.Date);
  });
  it('parses new vocabs', () => {});
  it('parses reviewed vocabs', () => {});
  it('parses sentences vocabs', () => {});
  it('parses a section', () => {});

  // Errors

  it('Throws error', () => {});
});
