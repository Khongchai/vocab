import "../../../parser/ts/dist";
import { ScanError, VocabToken } from "../src/consts";
import { VocabScanner } from "../src/scanner";

function assertTokens(
  text: string,
  ...expected: {
    tokenValue: string;
    token: VocabToken;
    error: ScanError;
    errorPos?: number;
  }[]
): void {
  const scanner = new VocabScanner(text);
  let i: number = 0;
  // TODO @khongchai Pretty readable, but check how this impacts performance.
  for (const token of scanner.tokens()) {
    if (token == VocabToken.EOF) break;

    expect(token).toBe(expected[i].token);
    expect(scanner.getTokenValue()).toBe(expected[i].tokenValue);
    expect(scanner.getScanError()).toBe(expected[i].error);
    if (expected[i].errorPos) {
      expect(scanner.getPos()).toBe(expected[i].errorPos);
    }
    i++;
  }

  expect(scanner.getPos()).toBe(text.length); // EOF is at text.length
}

describe("Simple tokens scan", () => {
  it("New line parse", () => {
    assertTokens("\n", {
      tokenValue: "\n",
      token: VocabToken.LineBreak,
      error: ScanError.Keiner,
    });
    assertTokens("\r", {
      tokenValue: "\r",
      token: VocabToken.LineBreak,
      error: ScanError.Keiner,
    });
  });

  // Tokenizer verify that the date conforms to the following format:
  // dd/mm/yyyy
  // Tokenizer just checks the string. The tokenizer will not check if the date is more than
  // the month or if the month is less than 12, etc.
  // The tokenizer will act like a simple regex machine.
  // Therefore, the only date-parsing related error the tokenizer will throw is the invalidDateFormat error
  it("Date parse", () => {
    // Pass cases
    assertTokens("31/01/2023", {
      tokenValue: "31/01/2023",
      error: ScanError.Keiner,
      token: VocabToken.Date,
    });
    assertTokens("10/02/2023", {
      tokenValue: "31/01/2023",
      error: ScanError.Keiner,
      token: VocabToken.Date,
    });
    assertTokens("1/02/2023", {
      tokenValue: "1",
      error: ScanError.InvalidDateFormat,
      errorPos: 1,
      token: VocabToken.Date,
    });
    assertTokens("100/02/2023", {
      tokenValue: "10",
      error: ScanError.InvalidDateFormat,
      errorPos: 2,
      token: VocabToken.Date,
    });
    assertTokens("02/02/20", {
      tokenValue: "02/02/20",
      error: ScanError.InvalidDateFormat,
      errorPos: 8, // error at new line char after 20
      token: VocabToken.Date,
    });
    assertTokens("20//", {
      tokenValue: "20/",
      error: ScanError.InvalidDateFormat,
      errorPos: 3,
      token: VocabToken.Date,
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

// TODO @khognchai, give it a full section
describe("Full parse", () => {});
