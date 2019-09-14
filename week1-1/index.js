/**
 * Student: Andrew Liu
 *
 * The muse: Wall Drawing #65 (1971): Lines not short, not straight, crossing
 * and touching, drawn at random, using four colors, uniformly dispersed with
 * maximum density, covering the entire surface of the wall.
 *
 * Thoughts:
 *
 * Using colors to cover the entire canvas in a dispersive manner, in the
 * pixelated web world, it sounds like an enlarged technical illustration to
 * describe how digital screens work. In this case, instead of three primary
 * colors, we're using four colors.
 *
 * Color density seems to mean no compromise in saturation or lightness.
 * Having both in full strength may appear as having such density. With full
 * saturation and sensationally lower lightness, a color may possess its
 * heaviest and strongest density.
 *
 * Random actions for a former abstract painter (myself was one) may mean a
 * set of marks on a canvas that are produced through an aesthetical
 * instinct. In a programmatic realm, that kind of instinct can be a data
 * stream injected from the quantitative result of ant collective human
 * activity.
 *
 * On the lines that are negation of straight and relatively long, it is a
 * simple description. With the hint of being randomly drawn, those lines
 * are not necessarily being confined within the canvas.
 */

const prices = getPricesByDateDesc();
const volumeSum = prices.reduce((acc, { volume }) => acc + volume, 0);

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  drawBackground();
  drawPricesLines();
}

function drawBackground() {
  noStroke();
  let rectOffset = 100;
  for (let i = 0; i < prices.length; i++) {
    rectOffset = rectOffset + i * i;
    const rectWidth = windowWidth - rectOffset;
    const rectHeight = windowHeight - rectOffset;
    fill("rgba(100%,100%,0%,0.2)");
    rect(0, 0, rectWidth, rectHeight);
    fill("rgba(100%,0%,100%,0.2)");
    rect(0, rectOffset, rectWidth, rectHeight);
    fill("rgba(0%,100%,100%,0.2)");
    rect(rectOffset, 0, rectWidth, rectHeight);
    fill("rgba(100%,100%,100%,0.2)");
    rect(rectOffset, rectOffset, rectWidth, rectHeight);
  }
}

function drawPricesLines() {
  const xSection = windowWidth / prices.length;
  const offsetX = xSection / 2;
  const startY = 0;

  prices.forEach(({ open, high, low, close, volume }, i) => {
    const volumePercentage = volume / volumeSum;
    const weight = (5 * volumePercentage * windowWidth) / prices.length;
    const strokeColor = 5 * Math.floor(volumePercentage * 255);
    const priceSum = open + high + low + close;

    const openYSectionPercentage = open / priceSum;
    const highYSectionPercentage = high / priceSum;
    const lowYSectionPercentage = low / priceSum;
    const closeYSectionPercentage = close / priceSum;
    const openYSection = openYSectionPercentage * windowHeight;
    const highYSection = highYSectionPercentage * windowHeight;
    const lowYSection = lowYSectionPercentage * windowHeight;
    const closeYSection = closeYSectionPercentage * windowHeight;

    const openY = openYSection;
    const highY = openY + highYSection;
    const lowY = highY + lowYSection;
    const closeY = lowY + closeYSection;

    const startX = i * xSection;
    const openX = startX + offsetX;
    const highX = openX;
    const lowX = highX + offsetX;
    const closeX = lowX;

    const coordinate1 = { x: startX, y: startY };
    const coordinate2 = { x: openX, y: openY };
    const coordinate3 = { x: highX, y: highY };
    const coordinate4 = { x: lowX, y: lowY };
    const coordinate5 = { x: closeX, y: closeY };

    strokeCap(ROUND);
    strokeWeight(weight);
    stroke(strokeColor);
    line(coordinate1.x, coordinate1.y, coordinate2.x, coordinate2.y);
    line(coordinate2.x, coordinate2.y, coordinate3.x, coordinate3.y);
    line(coordinate3.x, coordinate3.y, coordinate4.x, coordinate4.y);
    line(coordinate4.x, coordinate4.y, coordinate5.x, coordinate5.y);
  });
}

// Utility functions -----------------

function getPricesByDateDesc() {
  const pricesData = getDigitalCurrencyMonthlyPrices();
  const pricesAsc = transformDigitalCurrencyMonthlyPrices(pricesData);
  return pricesAsc.reverse();
}

function transformDigitalCurrencyMonthlyPrices(pricesData) {
  const timeSeries = pricesData["Time Series (Digital Currency Monthly)"];
  let i = 0;
  return (
    Object.values(timeSeries)
      // .slice(0, DATA_LENGTH)
      .reduce((results, stats) => {
        const open = parseInt(stats["1b. open (USD)"], 10);
        const high = parseInt(stats["2b. high (USD)"], 10);
        const low = parseInt(stats["3b. low (USD)"], 10);
        const close = parseInt(stats["4b. close (USD)"], 10);
        const volume = parseInt(stats["5. volume"], 10);
        results.push({ open, high, low, close, volume });
        return results;
      }, [])
  );
}

// Digital currency monthly prices data. Data source:
// https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_MONTHLY&symbol=BTC&market=CNY&apikey=demo
function getDigitalCurrencyMonthlyPrices() {
  return {
    "Meta Data": {
      "1. Information": "Monthly Prices and Volumes for Digital Currency",
      "2. Digital Currency Code": "BTC",
      "3. Digital Currency Name": "Bitcoin",
      "4. Market Code": "CNY",
      "5. Market Name": "Chinese Yuan",
      "6. Last Refreshed": "2019-09-08 00:00:00",
      "7. Time Zone": "UTC"
    },
    "Time Series (Digital Currency Monthly)": {
      "2019-09-08": {
        "1a. open (CNY)": "68205.66649400",
        "1b. open (USD)": "9588.74000000",
        "2a. high (CNY)": "77574.54389700",
        "2b. high (USD)": "10905.87000000",
        "3a. low (CNY)": "67716.71200000",
        "3b. low (USD)": "9520.00000000",
        "4a. close (CNY)": "74627.79996000",
        "4b. close (USD)": "10491.60000000",
        "5. volume": "276843.21295300",
        "6. market cap (USD)": "276843.21295300"
      },
      "2019-08-31": {
        "1a. open (CNY)": "71703.81794300",
        "1b. open (USD)": "10080.53000000",
        "2a. high (CNY)": "87709.50217000",
        "2b. high (USD)": "12330.70000000",
        "3a. low (CNY)": "66294.09200000",
        "3b. low (USD)": "9320.00000000",
        "4a. close (CNY)": "68196.63285700",
        "4b. close (USD)": "9587.47000000",
        "5. volume": "1201961.57632000",
        "6. market cap (USD)": "1201961.57632000"
      },
      "2019-07-31": {
        "1a. open (CNY)": "77206.29871000",
        "1b. open (USD)": "10854.10000000",
        "2a. high (CNY)": "93516.49474800",
        "2b. high (USD)": "13147.08000000",
        "3a. low (CNY)": "64444.68600000",
        "3b. low (USD)": "9060.00000000",
        "4a. close (CNY)": "71703.81794300",
        "4b. close (USD)": "10080.53000000",
        "5. volume": "1886176.06591000",
        "6. market cap (USD)": "1886176.06591000"
      },
      "2019-06-30": {
        "1a. open (CNY)": "60852.57050000",
        "1b. open (USD)": "8555.00000000",
        "2a. high (CNY)": "99370.00700000",
        "2b. high (USD)": "13970.00000000",
        "3a. low (CNY)": "52954.04199800",
        "3b. low (USD)": "7444.58000000",
        "4a. close (CNY)": "77206.29871000",
        "4b. close (USD)": "10854.10000000",
        "5. volume": "1689489.64733000",
        "6. market cap (USD)": "1689489.64733000"
      },
      "2019-05-31": {
        "1a. open (CNY)": "37855.49141400",
        "1b. open (USD)": "5321.94000000",
        "2a. high (CNY)": "64546.11880600",
        "2b. high (USD)": "9074.26000000",
        "3a. low (CNY)": "37814.66222000",
        "3b. low (USD)": "5316.20000000",
        "4a. close (CNY)": "60852.57050000",
        "4b. close (USD)": "8555.00000000",
        "5. volume": "1498409.89023000",
        "6. market cap (USD)": "1498409.89023000"
      },
      "2019-04-30": {
        "1a. open (CNY)": "29181.06596400",
        "1b. open (USD)": "4102.44000000",
        "2a. high (CNY)": "39833.36000000",
        "2b. high (USD)": "5600.00000000",
        "3a. low (CNY)": "28928.97770000",
        "3b. low (USD)": "4067.00000000",
        "4a. close (CNY)": "37847.45361100",
        "4b. close (USD)": "5320.81000000",
        "5. volume": "1126961.31510000",
        "6. market cap (USD)": "1126961.31510000"
      },
      "2019-03-31": {
        "1a. open (CNY)": "27131.21280600",
        "1b. open (USD)": "3814.26000000",
        "2a. high (CNY)": "29448.23400000",
        "2b. high (USD)": "4140.00000000",
        "3a. low (CNY)": "26109.98503900",
        "3b. low (USD)": "3670.69000000",
        "4a. close (CNY)": "29191.80674500",
        "4b. close (USD)": "4103.95000000",
        "5. volume": "787190.48925000",
        "6. market cap (USD)": "787190.48925000"
      },
      "2019-02-28": {
        "1a. open (CNY)": "24427.09671000",
        "1b. open (USD)": "3434.10000000",
        "2a. high (CNY)": "29860.79380000",
        "2b. high (USD)": "4198.00000000",
        "3a. low (CNY)": "23993.19761000",
        "3b. low (USD)": "3373.10000000",
        "4a. close (CNY)": "27127.15833900",
        "4b. close (USD)": "3813.69000000",
        "5. volume": "861783.98672700",
        "6. market cap (USD)": "861783.98672700"
      },
      "2019-01-31": {
        "1a. open (CNY)": "26327.21911300",
        "1b. open (USD)": "3701.23000000",
        "2a. high (CNY)": "28948.89438000",
        "2b. high (USD)": "4069.80000000",
        "3a. low (CNY)": "23828.31595200",
        "3b. low (USD)": "3349.92000000",
        "4a. close (CNY)": "24427.09671000",
        "4b. close (USD)": "3434.10000000",
        "5. volume": "908244.14054000",
        "6. market cap (USD)": "908244.14054000"
      },
      "2018-12-31": {
        "1a. open (CNY)": "28745.95763700",
        "1b. open (USD)": "4041.27000000",
        "2a. high (CNY)": "30678.72916900",
        "2b. high (USD)": "4312.99000000",
        "3a. low (CNY)": "22450.79300600",
        "3b. low (USD)": "3156.26000000",
        "4a. close (CNY)": "26339.09799000",
        "4b. close (USD)": "3702.90000000",
        "5. volume": "1591229.14717000",
        "6. market cap (USD)": "1591229.14717000"
      },
      "2018-11-30": {
        "1a. open (CNY)": "45307.03271200",
        "1b. open (USD)": "6369.52000000",
        "2a. high (CNY)": "47054.22346500",
        "2b. high (USD)": "6615.15000000",
        "3a. low (CNY)": "25981.73584600",
        "3b. low (USD)": "3652.66000000",
        "4a. close (CNY)": "28746.31329200",
        "4b. close (USD)": "4041.32000000",
        "5. volume": "1210365.44962000",
        "6. market cap (USD)": "1210365.44962000"
      },
      "2018-10-31": {
        "1a. open (CNY)": "47135.45506700",
        "1b. open (USD)": "6626.57000000",
        "2a. high (CNY)": "54628.60800000",
        "2b. high (USD)": "7680.00000000",
        "3a. low (CNY)": "44136.78550000",
        "3b. low (USD)": "6205.00000000",
        "4a. close (CNY)": "45324.17528300",
        "4b. close (USD)": "6371.93000000",
        "5. volume": "629922.08621900",
        "6. market cap (USD)": "629922.08621900"
      },
      "2018-09-30": {
        "1a. open (CNY)": "49871.43785100",
        "1b. open (USD)": "7011.21000000",
        "2a. high (CNY)": "52708.07100000",
        "2b. high (USD)": "7410.00000000",
        "3a. low (CNY)": "43468.15410000",
        "3b. low (USD)": "6111.00000000",
        "4a. close (CNY)": "47135.45506700",
        "4b. close (USD)": "6626.57000000",
        "5. volume": "1100653.42331000",
        "6. market cap (USD)": "1100653.42331000"
      },
      "2018-08-31": {
        "1a. open (CNY)": "55024.59427700",
        "1b. open (USD)": "7735.67000000",
        "2a. high (CNY)": "55126.52500000",
        "2b. high (USD)": "7750.00000000",
        "3a. low (CNY)": "41825.02800000",
        "3b. low (USD)": "5880.00000000",
        "4a. close (CNY)": "49871.43785100",
        "4b. close (USD)": "7011.21000000",
        "5. volume": "1408159.81656000",
        "6. market cap (USD)": "1408159.81656000"
      },
      "2018-07-31": {
        "1a. open (CNY)": "45460.39114800",
        "1b. open (USD)": "6391.08000000",
        "2a. high (CNY)": "60402.80918700",
        "2b. high (USD)": "8491.77000000",
        "3a. low (CNY)": "43176.51700000",
        "3b. low (USD)": "6070.00000000",
        "4a. close (CNY)": "54990.87818300",
        "4b. close (USD)": "7730.93000000",
        "5. volume": "1102510.43679000",
        "6. market cap (USD)": "1102510.43679000"
      },
      "2018-06-30": {
        "1a. open (CNY)": "53241.62463100",
        "1b. open (USD)": "7485.01000000",
        "2a. high (CNY)": "55387.50463900",
        "2b. high (USD)": "7786.69000000",
        "3a. low (CNY)": "40900.32500000",
        "3b. low (USD)": "5750.00000000",
        "4a. close (CNY)": "45453.20691700",
        "4b. close (USD)": "6390.07000000",
        "5. volume": "942249.76594400",
        "6. market cap (USD)": "942249.76594400"
      },
      "2018-05-31": {
        "1a. open (CNY)": "65767.79373100",
        "1b. open (USD)": "9246.01000000",
        "2a. high (CNY)": "71273.26200000",
        "2b. high (USD)": "10020.00000000",
        "3a. low (CNY)": "50026.07664500",
        "3b. low (USD)": "7032.95000000",
        "4a. close (CNY)": "53241.62463100",
        "4b. close (USD)": "7485.01000000",
        "5. volume": "914476.37788500",
        "6. market cap (USD)": "914476.37788500"
      },
      "2018-04-30": {
        "1a. open (CNY)": "49236.87820000",
        "1b. open (USD)": "6922.00000000",
        "2a. high (CNY)": "69422.57564200",
        "2b. high (USD)": "9759.82000000",
        "3a. low (CNY)": "45737.23300000",
        "3b. low (USD)": "6430.00000000",
        "4a. close (CNY)": "65767.79373100",
        "4b. close (USD)": "9246.01000000",
        "5. volume": "1110964.01558000",
        "6. market cap (USD)": "1110964.01558000"
      },
      "2018-03-31": {
        "1a. open (CNY)": "73447.30988400",
        "1b. open (USD)": "10325.64000000",
        "2a. high (CNY)": "83294.40100000",
        "2b. high (USD)": "11710.00000000",
        "3a. low (CNY)": "46947.17131000",
        "3b. low (USD)": "6600.10000000",
        "4a. close (CNY)": "49250.46422100",
        "4b. close (USD)": "6923.91000000",
        "5. volume": "1235326.31402000",
        "6. market cap (USD)": "1235326.31402000"
      },
      "2018-02-28": {
        "1a. open (CNY)": "73158.94481000",
        "1b. open (USD)": "10285.10000000",
        "2a. high (CNY)": "83835.06773100",
        "2b. high (USD)": "11786.01000000",
        "3a. low (CNY)": "42678.67113100",
        "3b. low (USD)": "6000.01000000",
        "4a. close (CNY)": "73455.27655600",
        "4b. close (USD)": "10326.76000000",
        "5. volume": "1243940.85531000",
        "6. market cap (USD)": "1243940.85531000"
      },
      "2018-01-31": {
        "1a. open (CNY)": "97560.79001500",
        "1b. open (USD)": "13715.65000000",
        "2a. high (CNY)": "122176.31274400",
        "2b. high (USD)": "17176.24000000",
        "3a. low (CNY)": "64266.85850000",
        "3b. low (USD)": "9035.00000000",
        "4a. close (CNY)": "73158.94481000",
        "4b. close (USD)": "10285.10000000",
        "5. volume": "816675.56446700",
        "6. market cap (USD)": "816675.56446700"
      },
      "2017-12-31": {
        "1a. open (CNY)": "69971.56470000",
        "1b. open (USD)": "9837.00000000",
        "2a. high (CNY)": "140829.99070800",
        "2b. high (USD)": "19798.68000000",
        "3a. low (CNY)": "66720.87800000",
        "3b. low (USD)": "9380.00000000",
        "4a. close (CNY)": "97565.84031600",
        "4b. close (USD)": "13716.36000000",
        "5. volume": "408476.65839900",
        "6. market cap (USD)": "408476.65839900"
      },
      "2017-11-30": {
        "1a. open (CNY)": "45971.96530000",
        "1b. open (USD)": "6463.00000000",
        "2a. high (CNY)": "80378.24339300",
        "2b. high (USD)": "11300.03000000",
        "3a. low (CNY)": "37877.32863100",
        "3b. low (USD)": "5325.01000000",
        "4a. close (CNY)": "69985.50637600",
        "4b. close (USD)": "9838.96000000",
        "5. volume": "108487.97811900",
        "6. market cap (USD)": "108487.97811900"
      },
      "2017-10-31": {
        "1a. open (CNY)": "31144.63721900",
        "1b. open (USD)": "4378.49000000",
        "2a. high (CNY)": "46220.99493100",
        "2b. high (USD)": "6498.01000000",
        "3a. low (CNY)": "29234.84100000",
        "3b. low (USD)": "4110.00000000",
        "4a. close (CNY)": "45971.96530000",
        "4b. close (USD)": "6463.00000000",
        "5. volume": "41626.38846300",
        "6. market cap (USD)": "41626.38846300"
      },
      "2017-09-30": {
        "1a. open (CNY)": "33359.65655900",
        "1b. open (USD)": "4689.89000000",
        "2a. high (CNY)": "35132.95238900",
        "2b. high (USD)": "4939.19000000",
        "3a. low (CNY)": "20037.60270000",
        "3b. low (USD)": "2817.00000000",
        "4a. close (CNY)": "31144.77948100",
        "4b. close (USD)": "4378.51000000",
        "5. volume": "27634.18912000",
        "6. market cap (USD)": "27634.18912000"
      }
    }
  };
}
