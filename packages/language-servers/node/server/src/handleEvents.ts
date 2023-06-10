import {
  CompletionItem,
  CompletionItemKind,
  Connection,
  Diagnostic,
  DiagnosticSeverity,
  TextDocumentPositionParams,
  TextDocuments,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

export default function handleEvents({
  connection,
  documents,
  capabilities,
}: {
  connection: Connection;
  documents: TextDocuments<TextDocument>;
  capabilities: {
    hasDiagnosticRelatedInformation: boolean;
  };
}) {
  // The example settings
  interface ExampleSettings {
    maxNumberOfProblems: number;
  }

  // Cache the settings of all open documents
  const documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

  function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
    let result = documentSettings.get(resource);
    if (!result) {
      result = connection.workspace.getConfiguration({
        scopeUri: resource,
        section: "languageServerExample",
      });
      documentSettings.set(resource, result);
    }
    return result;
  }

  // Only keep settings for open documents
  documents.onDidClose((e) => {
    documentSettings.delete(e.document.uri);
  });

  // The content of a text document has changed. This event is emitted
  // when the text document first opened or when its content has changed.
  documents.onDidChangeContent((change) => {
    validateTextDocument(change.document);
  });

  async function validateTextDocument(
    textDocument: TextDocument
  ): Promise<void> {
    // In this simple example we get the settings for every validate run.
    const settings = await getDocumentSettings(textDocument.uri);

    // The validator creates diagnostics for all uppercase words length 2 and more
    const text = textDocument.getText();
    const pattern = /\b[A-Z]{2,}\b/g;
    let m: RegExpExecArray | null;

    let problems = 0;
    const diagnostics: Diagnostic[] = [];
    while (
      (m = pattern.exec(text)) &&
      problems < settings.maxNumberOfProblems
    ) {
      problems++;
      const diagnostic: Diagnostic = {
        severity: DiagnosticSeverity.Warning,
        range: {
          start: textDocument.positionAt(m.index),
          end: textDocument.positionAt(m.index + m[0].length),
        },
        message: `${m[0]} is all uppercase.`,
        source: "ex",
      };
      if (capabilities.hasDiagnosticRelatedInformation) {
        diagnostic.relatedInformation = [
          {
            location: {
              uri: textDocument.uri,
              range: Object.assign({}, diagnostic.range),
            },
            message: "Spelling matters",
          },
          {
            location: {
              uri: textDocument.uri,
              range: Object.assign({}, diagnostic.range),
            },
            message: "Particularly for names",
          },
        ];
      }
      diagnostics.push(diagnostic);
    }

    // Send the computed diagnostics to VSCode.
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
  }

  // This handler provides the initial list of the completion items.
  connection.onCompletion(
    (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
      // The pass parameter contains the position of the text document in
      // which code complete got requested. For the example we ignore this
      // info and always provide the same completion items.
      return [
        {
          label: "TypeScript",
          kind: CompletionItemKind.Text,
          data: 1,
        },
        {
          label: "JavaScript",
          kind: CompletionItemKind.Text,
          data: 2,
        },
      ];
    }
  );

  // This handler resolves additional information for the item selected in
  // the completion list.
  connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
    if (item.data === 1) {
      item.detail = "TypeScript details";
      item.documentation = "TypeScript documentation";
    } else if (item.data === 2) {
      item.detail = "JavaScript details";
      item.documentation = "JavaScript documentation";
    }
    return item;
  });
}
