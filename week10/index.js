/**
 * replace all nouns and adjectives in the text with random nouns and
 * adjectives. If there is rhyme scheme in the poem, try changing it to
 * match your new words.
 *
 * open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
 *
 * 7.	JJ	Adjective
 * 8.	JJR	Adjective, comparative
 * 9.	JJS	Adjective, superlative
 * 12.	NN	Noun, singular or mass
 * 13.	NNS	Noun, plural
 */

/**
 * Global variables
 */
const allPoses = ["jj", "jjr", "jjs", "nn", "nns"];
const lexicon = new RiLexicon();
const ravenLinesLive = [];
let ravenClauses;
let theRaven = "";

/**
 * P5.js hooks
 */
function preload() {
  ravenClauses = loadStrings(
    "https://openprocessing-usercontent.s3.amazonaws.com/files/user188449/visual786008/h156f8d5d04b9aec8eb5d44dca97cb9ee/the-raven-and-other-poems.txt"
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fill(0);
  textSize(12);
  frameRate(10);
  ravenClauses = ravenClauses.slice(0, 10);
}

function draw() {
  if (!ravenClauses.length) {
    noLoop();
  }
  background(255);
  const ravenClause = ravenClauses.shift();
  if (ravenClause) {
    const ravenTokens = RiTa.tokenize(ravenClause);
    rewordClause(ravenTokens);
    const newRavenClause = RiTa.untokenize(ravenTokens);
    const isBeginClause = newRavenClause[0] === newRavenClause[0].toUpperCase();
    theRaven += isBeginClause ? `\n${newRavenClause}` : newRavenClause;
  } else {
    theRaven += "\n";
  }
  text(theRaven, 10, 10, width - 20, height - 20);
}

function rewordClause(clause) {
  const ravenTokens = clause;
  ravenTokens.forEach((token, i) => {
    const tokenPos = RiTa.getPosTags(token)[0];
    const posIndex = allPoses.indexOf(tokenPos);
    if (posIndex === -1) {
      return;
    }
    const isClauseEnd =
      i + 1 < ravenTokens.length
        ? RiTa.isPunctuation(ravenTokens[i + 1])
        : false;
    const rhymeWord = RiTa.rhymes(token);
    if (isClauseEnd) {
      const rhymeWords = RiTa.rhymes(token);
      const samePosRhymeWord = rhymeWords.find(
        rhymeWord =>
          rhymeWord !== token && RiTa.getPosTags(rhymeWord) === tokenPos
      );
      const randomWord = RiTa.randomWord(tokenPos);
      ravenTokens[i] = samePosRhymeWord ? samePosRhymeWord : randomWord;
    } else {
      const randomWord = RiTa.randomWord(tokenPos);
      ravenTokens[i] = randomWord;
    }
  });
}
