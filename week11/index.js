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

/**
 * Utility class --------------------------------------------------------------
 */

class Utils {
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
  static isPointWithinACircle(pointX, pointY, circleX, circleY, radius) {
    const deltaX = pointX - circleX;
    const deltaY = pointY - circleY;
    return Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(radius, 2);
  }
}

/**
 * About pies -----------------------------------------------------------------
 */

// fillWorkIsCoolCuzIListenToTechnoAllDay

/**
 * Renders a daily commute and working hours pie.
 */
class CommuteAndWorkingHoursPie {
  /**
   *
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
   */
  constructor(dailyData, x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.diameter = radius * 2;
    this.totalMins = CommuteAndWorkingHoursPie.parseTotalMinutesNotAtHome(
      dailyData
    );
    const {
      commuteToWorkPercentage,
      workingHoursPercentage,
      commuteToHomePercentage
    } = CommuteAndWorkingHoursPie.parseDailyDataToPercentages(
      dailyData,
      this.totalMins
    );
    this.commuteToWorkPercentage = commuteToWorkPercentage;
    this.workingHoursPercentage = workingHoursPercentage;
    this.commuteToHomePercentage = commuteToHomePercentage;
    const { didGoToTheGym, didWorkFromHome } = dailyData;
    this.didGoToTheGym = didGoToTheGym;
    this.didWorkFromHome = didWorkFromHome;
  }
  render() {
    if (this.didWorkFromHome) {
      this._renderWorkFromHome();
    } else {
      this._renderCommuteToWorkHours();
      this._renderWorkingHours();
      this._renderCommuteToHomeHours();
      if (this.didGoToTheGym) {
        this._renderGymHour();
      }
    }
  }
  _renderCommuteToWorkHours() {
    fill("red");
    const fromAngle = 0;
    const toAngle = this.commuteToWorkPercentage * TWO_PI;
    arc(this.x, this.y, this.diameter, this.diameter, fromAngle, toAngle, PIE);
  }
  _renderWorkingHours() {
    fill("blue");
    const fromAngle = this.commuteToWorkPercentage * TWO_PI;
    const toAngle =
      (this.commuteToWorkPercentage + this.workingHoursPercentage) * TWO_PI;
    arc(this.x, this.y, this.diameter, this.diameter, fromAngle, toAngle, PIE);
  }
  _renderCommuteToHomeHours() {
    fill("green");
    const fromAngle =
      (this.commuteToWorkPercentage + this.workingHoursPercentage) * TWO_PI;
    const toAngle =
      (this.commuteToWorkPercentage +
        this.workingHoursPercentage +
        this.commuteToHomePercentage) *
      TWO_PI;
    arc(this.x, this.y, this.diameter, this.diameter, fromAngle, toAngle, PIE);
  }
  _renderGymHour() {
    fill("yellow");
    const fromAngle =
      (this.commuteToWorkPercentage +
        this.workingHoursPercentage +
        this.commuteToHomePercentage) *
      TWO_PI;
    const toAngle = TWO_PI;
    arc(this.x, this.y, this.diameter, this.diameter, fromAngle, toAngle, PIE);
  }
  _renderWorkFromHome() {
    fill("cyan");
    const fromAngle = 0;
    const toAngle = TWO_PI;
    arc(this.x, this.y, this.diameter, this.diameter, fromAngle, toAngle, PIE);
  }
  static parseDailyDataToPercentages(dailyData, totalMinutes) {
    const {
      leftHome,
      arrivedOffice,
      leftOffice,
      arrivedHome,
      didGoToTheGym,
      didWorkFromHome
    } = dailyData;
    const offset = didGoToTheGym || didWorkFromHome ? 60 : 0;
    const commuteToWorkPercentage = Utils.parseTimeRangeToPercentage(
      leftHome,
      arrivedOffice,
      totalMinutes
    );
    const workingHoursPercentage = Utils.parseTimeRangeToPercentage(
      arrivedOffice,
      leftOffice,
      totalMinutes,
      offset
    );
    const commuteToHomePercentage = Utils.parseTimeRangeToPercentage(
      leftOffice,
      arrivedHome,
      totalMinutes
    );
    return {
      commuteToWorkPercentage,
      workingHoursPercentage,
      commuteToHomePercentage
    };
  }
  static parseTotalMinutesNotAtHome(dailyData) {
    const { leftHome, arrivedHome } = dailyData;
    const leftMins = Utils.parseTimeStringToMinutes(leftHome);
    const arrivedMins = Utils.parseTimeStringToMinutes(arrivedHome);
    const totalMins = arrivedMins - leftMins;
    return totalMins;
  }
}

/**
 * p5.js hooks ----------------------------------------------------------------
 */
function preload() {
  // data = loadJSON(DATA_URL);
  /**
   * Remove this!!!!
   */
  data = JSON.parse(
    `{"0":{"date":"11/11/19","leftHome":"8:32","arrivedOffice":"9:03","leftOffice":"18:15","arrivedHome":"20:26","didGoToTheGym":true,"didWorkFromHome":false},"1":{"date":"11/12/19","leftHome":"8:37","arrivedOffice":"9:12","leftOffice":"18:47","arrivedHome":"19:41","didGoToTheGym":true,"didWorkFromHome":false},"2":{"date":"11/13/19","leftHome":"8:27","arrivedOffice":"8:50","leftOffice":"18:56","arrivedHome":"19:20","didGoToTheGym":true,"didWorkFromHome":false},"3":{"date":"11/14/19","leftHome":"8:30","arrivedOffice":"9:02","leftOffice":"18:31","arrivedHome":"18:57","didGoToTheGym":true,"didWorkFromHome":false},"4":{"date":"11/15/19","leftHome":"","arrivedOffice":"9:00","leftOffice":"18:00","arrivedHome":"","didGoToTheGym":false,"didWorkFromHome":true}}`
  );
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  Utils.parseDataBooleanStringsToBoolean(data, [
    "didGoToTheGym",
    "didWorkFromHome"
  ]);
  noStroke();
  Object.values(data).forEach(dailyData => {
    const pie = new CommuteAndWorkingHoursPie(dailyData, 50, 50, 80);
    pies.push(pie);
  });
  // setInterval(() => {}, interval);
}
function draw() {
  pies.forEach(pie => {
    translate(100, 100);
    pie.render();
  });
}

function mouseClicked() {
  console.log(Utils.isPointWithinACircle(mouseX, mouseY, 100, 100, 80));
}
