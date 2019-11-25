/**
 * Goal: I want to show my commute and working hours in week 11/11/2019 to 11/15/2019.
 */

/**
 * Global variables -----------------------------------------------------------
 */

const DATA_URL =
  "https://openprocessing-usercontent.s3.amazonaws.com/files/user188449/visual792285/hac3886fd314ca8dd0e916378e39b4851/commute-work.json";
const pies = [];

/**
 * Sample data:
 * {
 *   0: {
 *     "date": "11/11/19",
 *     "leftHome": "8:32",
 *     "arrivedOffice": "9:03",
 *     "leftOffice": "18:15",
 *     "arrivedHome": "20:26",
 *     "didGoToTheGym": "true",
 *     "didWorkFromHome": "false"
 *   }
 * }
 */
let data;
let backgroundColorDegree = 75;
let zoomInPie;
let movingTextX = 0;

/**
 * Utility class --------------------------------------------------------------
 */

class Utils {
  /**
   * @param {string} fromTimeString
   * @param {string} toTimeString
   * @param {number} totalMinutes
   * @param {number} offset
   */
  static parseTimeRangeToTimeString(
    fromTimeString,
    toTimeString,
    totalMinutes,
    offset = 0
  ) {
    const fromMins = Utils.parseTimeStringToMinutes(fromTimeString);
    const toMins = Utils.parseTimeStringToMinutes(toTimeString);
    const totalMins = toMins - fromMins - offset;
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins - hours * 60;
    return `${hours}: ${mins}`;
  }
  /**
   * @param {string} fromTimeString
   * @param {string} toTimeString
   * @param {number} totalMinutes
   * @param {number} offset
   */
  static parseTimeRangeToPercentage(
    fromTimeString,
    toTimeString,
    totalMinutes,
    offset = 0
  ) {
    const fromMins = Utils.parseTimeStringToMinutes(fromTimeString);
    const toMins = Utils.parseTimeStringToMinutes(toTimeString);
    const percentage = (toMins - fromMins - offset) / totalMinutes;
    return percentage;
  }
  /**
   * @param {string} timeString
   */
  static parseTimeStringToMinutes(timeString) {
    const [hours, mins] = timeString.split(":").map(numStr => Number(numStr));
    const totalMins = hours * 60 + mins;
    return totalMins;
  }
  /**
   * Because `loadJSON()` doesn't support converting string "true" or "false"
   * to boolean value, i.e. we don't want `if("false") {...}` gets evaluated
   * as truthy.
   * @param {object} data The parsed json data loaded from `loadJSON()`.
   * @param {string[]} keysToConvert
   */
  static parseDataBooleanStringsToBoolean(data, keysToConvert) {
    Object.values(data).forEach(dailyData => {
      Object.entries(dailyData).forEach(([key, value]) => {
        if (keysToConvert.includes(key)) {
          // `JSON.parse()` converts `"true"` to `true` and `"false"` to `false`.
          dailyData[key] = JSON.parse(value);
        }
      });
    });
  }
  /**
   * @param {number} pointX
   * @param {number} pointY
   * @param {number} circleX
   * @param {number} circleY
   * @param {number} radius
   */
  static isPointWithinACircle(pointX, pointY, circleX, circleY, radius) {
    const deltaX = pointX - circleX;
    const deltaY = pointY - circleY;
    return Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(radius, 2);
  }
}

/**
 * About pies -----------------------------------------------------------------
 */

/**
 * Renders a daily commute and working hours pie.
 */
class CommuteAndWorkingHoursPie {
  /**
   * Calculates the necessary properties to make pies scale across any
   * windowWidth.
   * @param {number} windowWidth We need this because static methods don' have
   * access to p5.js global variables.
   */
  static calcPieProperties(windowWidth) {
    const marginX = windowWidth / 20;
    const pieLength = Object.keys(data).length;
    const pieTotalWidth = windowWidth - marginX * 2;
    const gap = marginX / 2;
    const gapTotalWidth = (pieLength - 1) * gap;
    const pieRadius = (pieTotalWidth - gapTotalWidth) / pieLength / 2;
    const firstPieX = marginX + pieRadius;
    const pieToPieDistance = pieRadius * 2 + gap;
    const pieY = windowHeight / 2;
    return { firstPieX, pieY, pieRadius, pieToPieDistance };
  }
  /**
   * @param {object} dailyData Sample data:
   * {
   *   "date": "11/11/19",
   *   "leftHome": "8:32", // empty string if worked from home
   *   "arrivedOffice": "9:03",
   *   "leftOffice": "18:15",
   *   "arrivedHome": "20:26", // empty string if worked from home
   *   "didGoToTheGym": "true",
   *   "didWorkFromHome": "false"
   * }
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {number} transparency
   * @param {number} bleed
   */
  constructor(
    dailyData,
    x,
    y,
    radius,
    transparency = 0.75,
    bleed = TWO_PI / 360
  ) {
    this.dailyData = dailyData;
    this.initTotalMinutesNotAtHome();
    this.initDailyDataToPercentages();
    this.initDailyDataToTimeStrings();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.diameter = radius * 2;
    this.backgroundColorDegree = backgroundColorDegree;
    this.transparency = transparency;
    this.bleed = bleed;
    this.isRenderingBigPie = false;
  }
  /**
   * One of the two the entry functions of this class. Renders a big pie when
   * that pie was clicked.
   */
  renderBigPie() {
    this.isRenderingBigPie = true;
    this.render();
  }
  /**
   * One of the two the entry functions of this class. Renders a regular pie.
   */
  renderSmallPie() {
    this.isRenderingBigPie = false;
    this.render();
  }
  render() {
    this.calcColor(backgroundColorDegree);
    if (this.dailyData.didWorkFromHome) {
      this.renderWorkFromHome();
    } else {
      this.renderCommuteToWorkHours();
      this.renderWorkingHours();
      this.renderCommuteToHomeHours();
      if (this.dailyData.didGoToTheGym) {
        this.renderGymHour();
      }
    }
  }
  /**
   * @param {number} fromAngle
   * @param {number} toAngle
   * @param {string} name
   * @param {string} timeString
   */
  renderArc(fromAngle, toAngle, name, timeString) {
    const bleed = this.isRenderingBigPie ? this.bleed / 3 : this.bleed;
    const bledFromAngle = fromAngle - bleed;
    const bledToAngle = toAngle + bleed;
    const centerX = windowWidth / 2;
    const centerY = windowHeight / 2;
    const bigPieDiameter = Math.min(windowWidth, windowHeight) * 0.75;
    const x = this.isRenderingBigPie ? centerX : this.x;
    const y = this.isRenderingBigPie ? centerY : this.y;
    const diameter = this.isRenderingBigPie ? bigPieDiameter : this.diameter;
    if (this.dailyData.didWorkFromHome) {
      arc(x, y, diameter, diameter, 0, TWO_PI, PIE);
    } else {
      arc(x, y, diameter, diameter, bledFromAngle, bledToAngle, PIE);
    }
    if (this.isRenderingBigPie && name) {
      const label = `${name}\n${timeString}`;
      const midAngle = (fromAngle + toAngle) / 2;
      const textY = y + (bigPieDiameter / 2) * Math.sin(midAngle);
      let textX = x + (bigPieDiameter / 2) * Math.cos(midAngle);
      const overflownNameWidth = textX + textWidth(name) - windowWidth;
      if (overflownNameWidth > 0) {
        textX -= overflownNameWidth;
      }
      textSize(12);
      fill(0);
      rect(textX, textY - 12, textWidth(name), 15);
      rect(textX, textY, textWidth(timeString), 15);
      fill(75);
      text(name, textX, textY);
      text(timeString, textX, textY + 12);
    }
  }
  calcColor() {
    this.commuteToWorkColor = color(
      (backgroundColorDegree + 50) % 360,
      100,
      100,
      this.transparency
    );
    this.commuteToHomeColor = color(
      (backgroundColorDegree + 100) % 360,
      100,
      100,
      this.transparency
    );
    this.workingColor = color(
      (backgroundColorDegree + 150) % 360,
      100,
      100,
      this.transparency
    );
    this.workFromHomeColor = color(
      (backgroundColorDegree + 200) % 360,
      100,
      100,
      this.transparency
    );
    this.gymColor = color(
      (backgroundColorDegree + 250) % 360,
      100,
      100,
      this.transparency
    );
  }
  renderCommuteToWorkHours() {
    fill(this.commuteToWorkColor);
    const fromAngle = 0;
    const toAngle = this.commuteToWorkPercentage * TWO_PI;
    this.renderArc(
      fromAngle,
      toAngle,
      "commute to work hours",
      this.commuteToWorkTimeString
    );
  }
  renderWorkingHours() {
    fill(this.workingColor);
    const fromAngle = this.commuteToWorkPercentage * TWO_PI;
    const toAngle =
      (this.commuteToWorkPercentage + this.workingHoursPercentage) * TWO_PI;
    this.renderArc(
      fromAngle,
      toAngle,
      "working hours",
      this.workingHoursTimeString
    );
  }
  renderCommuteToHomeHours() {
    fill(this.commuteToHomeColor);
    const fromAngle =
      (this.commuteToWorkPercentage + this.workingHoursPercentage) * TWO_PI;
    const toAngle =
      (this.commuteToWorkPercentage +
        this.workingHoursPercentage +
        this.commuteToHomePercentage) *
      TWO_PI;
    this.renderArc(
      fromAngle,
      toAngle,
      "commute to home hours",
      this.commuteToHomeTimeString
    );
  }
  renderGymHour() {
    fill(this.gymColor);
    const fromAngle =
      (this.commuteToWorkPercentage +
        this.workingHoursPercentage +
        this.commuteToHomePercentage) *
      TWO_PI;
    const toAngle = TWO_PI;
    this.renderArc(fromAngle, toAngle, "gym hours", "1:00");
  }
  renderWorkFromHome() {
    fill(this.workFromHomeColor);
    const fromAngle = 0;
    const toAngle = TWO_PI;
    this.renderArc(
      fromAngle,
      toAngle,
      "working hours (work from home)",
      "8:00"
    );
  }
  initDailyDataToTimeStrings() {
    const {
      leftHome,
      arrivedOffice,
      leftOffice,
      arrivedHome,
      didGoToTheGym,
      didWorkFromHome
    } = this.dailyData;
    const offset = didGoToTheGym || didWorkFromHome ? 60 : 0;
    this.commuteToWorkTimeString = Utils.parseTimeRangeToTimeString(
      leftHome,
      arrivedOffice,
      this.totalMinutes
    );
    this.workingHoursTimeString = Utils.parseTimeRangeToTimeString(
      arrivedOffice,
      leftOffice,
      this.totalMinutes,
      offset
    );
    this.commuteToHomeTimeString = Utils.parseTimeRangeToTimeString(
      leftOffice,
      arrivedHome,
      this.totalMinutes
    );
  }
  initDailyDataToPercentages() {
    const {
      leftHome,
      arrivedOffice,
      leftOffice,
      arrivedHome,
      didGoToTheGym,
      didWorkFromHome
    } = this.dailyData;
    const offset = didGoToTheGym || didWorkFromHome ? 60 : 0;
    this.commuteToWorkPercentage = Utils.parseTimeRangeToPercentage(
      leftHome,
      arrivedOffice,
      this.totalMinutes
    );
    this.workingHoursPercentage = Utils.parseTimeRangeToPercentage(
      arrivedOffice,
      leftOffice,
      this.totalMinutes,
      offset
    );
    this.commuteToHomePercentage = Utils.parseTimeRangeToPercentage(
      leftOffice,
      arrivedHome,
      this.totalMinutes
    );
  }
  initTotalMinutesNotAtHome() {
    const { leftHome, arrivedHome } = this.dailyData;
    const leftMins = Utils.parseTimeStringToMinutes(leftHome);
    const arrivedMins = Utils.parseTimeStringToMinutes(arrivedHome);
    this.totalMinutes = arrivedMins - leftMins;
  }
}

/**
 * p5.js hooks ----------------------------------------------------------------
 */

function preload() {
  data = loadJSON(DATA_URL);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  Utils.parseDataBooleanStringsToBoolean(data, [
    "didGoToTheGym",
    "didWorkFromHome"
  ]);
  colorMode(HSB);
  noStroke();
  const {
    firstPieX,
    pieY,
    pieRadius,
    pieToPieDistance
  } = CommuteAndWorkingHoursPie.calcPieProperties(windowWidth);
  Object.values(data).forEach((dailyData, i) => {
    const pieX = firstPieX + pieToPieDistance * i;
    const pie = new CommuteAndWorkingHoursPie(dailyData, pieX, pieY, pieRadius);
    pies.push(pie);
  });
}

function draw() {
  backgroundColorDegree = (backgroundColorDegree + 1) % 360;
  background(color(backgroundColorDegree, 15, 95));
  if (zoomInPie) {
    zoomInPie.renderBigPie();
    renderMovingText("CLICK OUTSIDE (OF THIS PIE)");
  } else {
    pies.forEach(pie => pie.renderSmallPie());
    renderMovingText("CLICK ANY PIE");
  }
}

function renderMovingText(label) {
  textSize(24);
  fill(color(360 - backgroundColorDegree, 100, 100));
  text(label, movingTextX, windowHeight - 36);
  movingTextX = movingTextX < 0 ? windowWidth : movingTextX - 1;
}

function mouseClicked() {
  // `find()` returns matched pie or undefined if no pies were clicked.
  const thisPieGetsTheClick = pies.find(({ x, y, radius }) =>
    Utils.isPointWithinACircle(mouseX, mouseY, x, y, radius)
  );
  zoomInPie = thisPieGetsTheClick;
}
