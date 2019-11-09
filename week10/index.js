/**
 * Renders reworded clauses one by one with rhymes retained in the P5.js draw loop.
 * Please scroll the screen when the reworded text is approaching the bottom of browser.
 */

/**
 * Global variables
 */
const adjectivePoses = ["jj", "jjr", "jjs"];
const nounPoses = ["nn", "nns"];
const openprocessingHeaderHeight = 700;
let lexicon;
let rewordRaven;
let ravenClauses;

/**
 * Custom classes
 */

class Reword {
  constructor(oldClauses, posesToReplace) {
    this.oldClauses = oldClauses;
    this.posesToReplace = posesToReplace;
    this.rewordedClauses = [];
    this.currentClauseIndex = 0;
  }
  /**
   * Renders and reword clauses incrementally.
   */
  renderClausesIncrementally() {
    // rewordClause() is an expensive operation, thus we only need to call it
    // for one clause at a time.
    if (this.currentClauseIndex < this.oldClauses.length) {
      const rewordedClause = this.rewordClause(
        this.oldClauses[this.currentClauseIndex++]
      );
      this.rewordedClauses.push(rewordedClause);
    }
    this.rewordedClauses.forEach((clause, i) => {
      text(clause, 10, openprocessingHeaderHeight + i * 15);
    });
  }
  /**
   * Rewords a clause with correct formatting or changes it to a new line
   * because new lines in the input text are converted to empty strings in
   * loadStrings().
   * @param {string} clause
   */
  rewordClause(clause) {
    if (clause !== "") {
      const clauseTokens = RiTa.tokenize(clause);
      this.rewordClauseTokens(clauseTokens);
      const rewordedClause = RiTa.untokenize(clauseTokens);
      const isBeginClause = clause[0] === clause[0].toUpperCase();
      return isBeginClause ? `\n${rewordedClause}` : rewordedClause;
    } else {
      return "\n";
    }
  }
  /**
   * Conditionally rewords clause tokens so that we can retain rhymes.
   * @param {array} clauseTokens RiTa tokens
   */
  rewordClauseTokens(clauseTokens) {
    clauseTokens.forEach((token, i) => {
      const [tokenPos] = RiTa.getPosTags(token);
      const posIndex = this.posesToReplace.indexOf(tokenPos);
      // Don't do anything for parts of speech that are not in posesToReplace.
      if (posIndex === -1) {
        return;
      }
      const isClauseEnd =
        i + 1 < clauseTokens.length
          ? RiTa.isPunctuation(clauseTokens[i + 1])
          : false;
      // Key step to retain rhyme in a cause.
      if (isClauseEnd) {
        const rhymeWords = lexicon.rhymes(token);
        const samePosRhymeWord = rhymeWords.find(
          rhymeWord =>
            rhymeWord !== token && RiTa.getPosTags(rhymeWord) === tokenPos
        );
        const randomWord = lexicon.randomWord(tokenPos);
        // Replace with a word with the same rhyme if it is available in the list
        // returned from rhymes()
        clauseTokens[i] = samePosRhymeWord ? samePosRhymeWord : randomWord;
      } else {
        const randomWord = lexicon.randomWord(tokenPos);
        clauseTokens[i] = randomWord;
      }
    });
  }
}

/**
 * P5.js hooks
 */
function preload() {
  ravenClauses = loadStrings(
    "https://openprocessing-usercontent.s3.amazonaws.com/files/user188449/visual786008/h156f8d5d04b9aec8eb5d44dca97cb9ee/the-raven-and-other-poems.txt"
  );
}

function setup() {
  // Note on the canvas height, we need to allocated enough space to fit the
  // entire text to be rendered
  createCanvas(
    windowWidth,
    openprocessingHeaderHeight + (ravenClauses.length + 1) * 15
  );
  fill(0);
  textSize(12);
  lexicon = new RiLexicon();
  rewordRaven = new Reword(ravenClauses, [...adjectivePoses, ...nounPoses]);
}

function draw() {
  background(255);
  rewordRaven.renderClausesIncrementally();
}
