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
  Date,
  RightShift,
  DoubleRightShift,
  NewVocab,
  ReviewedVocab,
  Comma,
  LineComment,
  Sentence,
  EOF,
}
