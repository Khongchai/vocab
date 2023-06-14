import { TextDocument } from "vscode-languageserver-textdocument";
import { SemanticTokensReturnPattern } from "./types";
import { VocabDocument } from "@vocab/parser-node";

export default class SemanticTokensProvider {
  getSemanticTokens(document: TextDocument): SemanticTokensReturnPattern {
    // [4, 10, 8, 0, 0, 0, 9, 13, 1, 0] mock data, use this to mock return value.
    const vocabDocument = _parse(document);
    const semanticTokens = _getTokens(vocabDocument);

    return semanticTokens;
  }

  // TOOD @khongchai implement some kind of
  private _parse(): VocabDocument {
    return {
      sections: ,
    }
  }

  // TODO @khongchai continue here once parsing is done.
  private _getTokens(): SemanticTokensReturnPattern {}
}
