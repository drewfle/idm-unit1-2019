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
let x;

/**
 * P5.js hooks
 */
function preload() {
  x = loadStrings(
    "https://openprocessing-usercontent.s3.amazonaws.com/files/user188449/visual786008/h156f8d5d04b9aec8eb5d44dca97cb9ee/the-raven-and-other-poems.txt"
  );
}
function setup() {
  createCanvas(400, 400);
  background(255);
  fill(0);
  textSize(48);
  const lexicon = new RiLexicon();
  const foo = x.join(" ");
  const randomWord = lexicon.randomWord("jj");
  const words = RiTa.tokenize("Got me looking so crazy right now.");
  const words2 = RiTa.getPhonemes("Got me looking so crazy right now.");
  const partsOfSpeech = RiTa.getPosTags(words);
  const stresses = RiTa.getStresses(lyricLine);
  const wordCount = RiTa.getWordCount(lyricLine);
  const sentences = RiTa.splitSentences(foo);
  for (var i = 0; i < sentences.length; i++) {
    // var wordTwoWidth = textWidth(wordTwo);
    console.log(sentences[i]);
  }
  // var words = RiTa.tokenize("Got me looking so crazy right now.");
  // for (var i = 0; i < words.length; i++) {
  //   text(words[i], 50, i * 48 + 48);
  // }
}
function draw() {}
