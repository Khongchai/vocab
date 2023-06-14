/**
 * Each memorized will appear in the content string >= 1 times.
 *
 * This reference links the position of these appearances to the original token
 *
 * Implementers must take great care when dealing with separable verbs. For example,
 *
 * ```vocab
 * 01/01/2023
 * > clean up, ...
 * What am I doing? Oh, I'm just cleaning up my room...what's up?
 * # ...
 * ```
 *
 * ```vocab
 * 01/01/2023
 * > aufräumen, ...
 * Was mache ich gerade? Oh, ich räume nur mein Zimmer auf...was geht's?
 * # ...
 * ```
 *
 * In the two examples above, we have "clean up" and "aufräumen". The nlp module
 * should take care of this and make the parser aware of these separable verbs so that it
 * can construct the correct token references.
 */
interface MemorizedTokenReference {
  newTokenIndex: number;
  memorizedTokenIndex: number;
  /**
   * The offset within the content
   */
  offset: number;
  /**
   * The length of the token.
   */
  length: number;
}

export interface VocabSection {
  date: Date;
  newTokens: string[];
  reviewedTokens: string[];
  /**
   * Each member of the array is one line.
   */
  examplesByLine: {
    /**
     * The string content of this line.
     */
    content: string;
    reference: MemorizedTokenReference;
  }[];
}

export interface VocabDocument {
  sections: VocabSection;
}
