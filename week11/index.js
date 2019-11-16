/**
 * Global variables -----------------------------------------------------------
 */

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
  constructor(dailyData) {
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
    console.log(
      commuteToWorkPercentage,
      workingHoursPercentage,
      commuteToHomePercentage
    );
    this.commuteToWorkPercentage = commuteToWorkPercentage;
    this.workingHoursPercentage = workingHoursPercentage;
    this.commuteToHomePercentage = commuteToHomePercentage;
    //
    const { didGoToTheGym, didWorkFromHome } = dailyData;
    this.didGoToTheGym = didGoToTheGym;
    this.didWorkFromHome = didWorkFromHome;
  }
  render() {
    this._renderCommuteToWorkHours();
    this._renderWorkingHours();
    this._renderCommuteToHomeHours();
    if (this.didGoToTheGym) {
      this._renderGymHour();
    }
  }
  _renderCommuteToWorkHours() {
    fill("red");
    const fromAngle = 0;
    const toAngle = this.commuteToWorkPercentage * TWO_PI;
    arc(50, 50, 80, 80, fromAngle, toAngle, PIE);
  }
  _renderWorkingHours() {
    fill("blue");
    const fromAngle = this.commuteToWorkPercentage * TWO_PI;
    const toAngle =
      (this.commuteToWorkPercentage + this.workingHoursPercentage) * TWO_PI;
    arc(50, 50, 80, 80, fromAngle, toAngle, PIE);
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
    arc(50, 50, 80, 80, fromAngle, toAngle, PIE);
  }
  _renderGymHour() {
    fill("yellow");
    const fromAngle =
      (this.commuteToWorkPercentage +
        this.workingHoursPercentage +
        this.commuteToHomePercentage) *
      TWO_PI;
    const toAngle = TWO_PI;

    arc(50, 50, 80, 80, fromAngle, toAngle, PIE);
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
    const commuteToWorkPercentage = CommuteAndWorkingHoursPie.parseTimeRangeToPercentage(
      leftHome,
      arrivedOffice,
      totalMinutes
    );
    const workingHoursPercentage = CommuteAndWorkingHoursPie.parseTimeRangeToPercentage(
      arrivedOffice,
      leftOffice,
      totalMinutes,
      offset
    );
    const commuteToHomePercentage = CommuteAndWorkingHoursPie.parseTimeRangeToPercentage(
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
    const leftMins = CommuteAndWorkingHoursPie.parseTimeStringToMinutes(
      leftHome
    );
    const arrivedMins = CommuteAndWorkingHoursPie.parseTimeStringToMinutes(
      arrivedHome
    );
    const totalMins = arrivedMins - leftMins;
    return totalMins;
  }
  static parseTimeRangeToPercentage(
    fromTimeString,
    toTimeString,
    totalMinutes,
    offset = 0
  ) {
    const fromMins = CommuteAndWorkingHoursPie.parseTimeStringToMinutes(
      fromTimeString
    );
    const toMins = CommuteAndWorkingHoursPie.parseTimeStringToMinutes(
      toTimeString
    );
    const percentage = (toMins - fromMins - offset) / totalMinutes;
    return percentage;
  }
  static parseTimeStringToMinutes(timeString) {
    const [hours, mins] = timeString.split(":").map(numStr => Number(numStr));
    const totalMins = hours * 60 + mins;
    return totalMins;
  }
}

function preload() {
  data = loadJSON(
    " https://openprocessing-usercontent.s3.amazonaws.com/files/user188449/visual792285/hac3886fd314ca8dd0e916378e39b4851/commute-work.json",
    "json"
  );
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log(data);
  noStroke();
  // fill("red");
  translate(50, 50);
  const pie = new CommuteAndWorkingHoursPie(data["0"]);
  pie.render();
  translate(50, 50);
  const pie2 = new CommuteAndWorkingHoursPie(data["2"]);
  pie2.render();
  // setInterval(() => {}, interval);
}
function draw() {
  // console.log("cool");
}
