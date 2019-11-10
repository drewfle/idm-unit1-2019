/**
 * Renders reworded clauses one by one with rhymes retained in the P5.js draw loop.
 * Please scroll the screen when the reworded text is approaching the bottom of browser.
 */

/**
 * Global variables
 */
const adjectivePoses = ["jj", "jjr", "jjs"];
const nounPoses = ["nn", "nns"];
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
    this.wrapper = createDiv()
      .position(windowWidth / 100, windowHeight / 100)
      .style("background", "grey");
  }
  /**
   * Renders and reword clauses incrementally.
   */
  renderClausesIncrementally() {
    // rewordClause() is an expensive operation, thus we only need to call it
    // for one clause at a time.
    if (this.currentClauseIndex < this.oldClauses.length) {
      const oldClause = this.oldClauses[this.currentClauseIndex++];
      if (!oldClause) {
        return;
      }
      const rewordedClause = this.rewordClause(oldClause);
      this.wrapper.child(rewordedClause);
    }
  }
  /**
   * Rewords a clause with correct formatting or changes it to a new line
   * because new lines in the input text are converted to empty strings in
   * loadStrings().
   * @param {string} clause
   */
  rewordClause(clause) {
    const clauseTokens = RiTa.tokenize(clause);
    this.rewordClauseTokens(clauseTokens);
    const rewordedClause = this.untokenize(clauseTokens);
    return rewordedClause;
  }
  /**
   * Reimplements Rita.untokenize() so we can concat mixed token
   * types
   * @param {string|P5.Element} tokens
   */
  untokenize(tokens) {
    const clauseP = createP();
    tokens.forEach(token => {
      if (typeof token === "string") {
        const plainSpan = createSpan(`${token} `).style("color", "lightblue");
        clauseP.child(plainSpan);
      } else {
        clauseP.child(token);
      }
    });
    return clauseP;
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
        // Replace with a word with the same rhyme if it can be found in the list
        // returned from rhymes()
        clauseTokens[i] = this.highlight(
          samePosRhymeWord ? samePosRhymeWord : randomWord
        );
      } else {
        const randomWord = lexicon.randomWord(tokenPos);
        clauseTokens[i] = this.highlight(randomWord);
      }
    });
  }
  highlight(word) {
    return createSpan(`${word} `)
      .style("color", "magenta")
      .style("background", "lime");
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
  createCanvas(windowWidth, windowHeight);
  lexicon = new RiLexicon();
  rewordRaven = new Reword(ravenClauses, [...adjectivePoses, ...nounPoses]);
}

function draw() {
  rewordRaven.renderClausesIncrementally();
}
