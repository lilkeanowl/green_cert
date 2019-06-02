const calculateTrend = require('trend');

const trendThreshold = [-0.1, 0.1];
const lastPoints = 10;
const avgPoints = 10;

const isValid = function(items) {
    return verifyPwrTrend(items);
}

function verifyPwrTrend(items) {
    let pwrChart = items.map((item) => {
        return item.pwr_avg;
    });
    
    let lastPoints = pwrChart.slice(pwrChart.length - lastPoints, pwrChart.length);
    let chartArr = pwrChart.slice(pwrChart.length - lastPoints - avgPoints, pwrChart.length - lastPoints);
    let chartAvg = chartArr.reduce(function(res, val) { return res += val }) / chartArr.length;
    let lastAvg = Math.max.apply(null, lastArr);

    let trend = lastAvg/chartAvg;
    console.log("Power supply trend ", trend);
    return trend >= trendThreshold[0] && trend <= trendThreshold[1];
}

module.exports = isValid;