# vocab.de-lsp
A vocab file extension

# This is a work in progress

The vocab file extension proposes a specific, human-and-machine readable syntax for memorizing vocabulary.

Eventually, this repo will contains the full specs, the language server, and the _vocab_ to _json_ parser.

All vocab files share the same syntax highlighter (vocab.de, vocab.en, vocab.*), the semantics of each langauge get processed instead in the langauge server.

# Sample Syntax

```vocab.de
# This denotes a comment

# Every new vocabulary portion begins with a date string in the dd/mm/yyyy format.
27/05/2023
# The date is followed by > and >>, where > denotes new vocabulary for that day, and >> denotes reviewed vocabulary.
> posieren, zusammenschließen
>> der Brief
# The following section is the example sentences. If any of the vocabulary above is not detected below, an error should be shown.
Eine Gemeinde kann eine Stadt sein, ein Dorf, oder mehrere Dörfer, die sich zu einer Gemeinde zusammengeschlossen haben.
Ich habe eine sehr gute Freundin getroffen, die ich seit 10 Jahren nicht mehr getroffen habe!
Nach eingehender Analyse der verschlüsselten elektronischen Nachrichten korrespondierte der Brief, den der angesehene Linguist verfasste, mit den kunstvollen Semantiken der verwickelten Sprache.
28/05/2023 # Ooops, new day(or EOF) already, but not all vocabs were present!
```

This syntax might change in the future. It aims to be as human-readable as possible while still offering strict-enough syntax to allow for it to be parsed into json or yaml so that the list of vocabs can be further utilized.

Should I decide to learn more languages in the future, maybe I'll do more extensions...

## Full example without comment
```
27/05/2023
> posieren, zusammenschließen
>> der Brief
Eine Gemeinde kann eine Stadt sein, ein Dorf, oder mehrere Dörfer, die sich zu einer Gemeinde zusammengeschlossen haben.
Ich habe eine sehr gute Freundin getroffen, die ich seit 10 Jahren nicht mehr getroffen habe!
Nach eingehender Analyse der verschlüsselten elektronischen Nachrichten korrespondierte der Brief, den der angesehene Linguist verfasste, mit den kunstvollen Semantiken der verwickelten Sprache.
```

The difficulty here, I feel, is not the parsing, but the inflection detection. For now, I absolutely have no idea what the best way is for approaching this kind of nlp. chatGPT is definitely ONE of the many answers. We'll see.

# Models

## Parsed Data
The vocabulary for each day is parsed into the following data structure (example is in TypeScript).
```ts
interface DailyVocab {
    /**
     * Self-explanatory
     */
    date: Date;
    /**
     * Word, phrase, sentence, etc.
     */
    newTokens: string[];
    /**
     * Word, phrase, sentence, etc.
     */
    reviewedTokens: string[];
    /**
     * All example sentences.
     */
    examples: string[];
}
```

## Lexer Result

The result of the lexer, this is after the lexer has compared the examples against new and reviewed tokens.

```ts
// Need a better name for this.
interface LexerResult {
    /**
     * TODO, 
     * newToken[] + positions[],
     * reviewedToken[] + positions[],
     * error[] + positions[]
     */
}
```
