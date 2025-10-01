const tellDateET = function () {
    let timeNow = new Date();
    const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
    return timeNow.getDate() + "." + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}

const tellDayET = function () {
    let timeNow = new Date();
    let dayNow = timeNow.getDay();
    const dayNamesET = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"];
    return dayNamesET[dayNow];
}

const tellTimeET = function () {
    let timeNow = new Date();
    let hourNow = timeNow.getHours();
    let minuteNow = timeNow.getMinutes();
    let secondNow = timeNow.getSeconds();
    return hourNow + ":" + minuteNow + ":" + secondNow;
}

module.exports = { longDate: tellDateET, weekDay: tellDayET, time: tellTimeET };