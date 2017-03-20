/**
 * Created by colinthompson on 2017-03-20.
 */
const WEEKDAY = ['Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'];

const MONTH = ['January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December']

/**
 * The Loops through and corrects the clock's time and date every 500 ms
 */
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s  = today.getSeconds();
    var weekday = today.getDay();
    var month = today.getMonth();
    var day = today.getDate();
    var year = today.getFullYear();
    m = padTime(m);
    s = padTime(s);

    $('#date').html(WEEKDAY[weekday] + ", " + MONTH[month] + " " + day + getDateSuffix(day) + ", " + year);
    $('#clock').html(h + ":" + m + ":" + s);
    setTimeout(startTime, 500); // restart in half a second
}

/**
 * Returns the correct suffix given a day of the month 1 <= month <= 31
 * @param day the day of the month
 * @returns {*}
 */
function getDateSuffix(day) {

    if (day == 11) return 'th'; //11 is an odd day lol

    var i = day % 10;

    if (i == 1) return 'st';
    else if (i == 2) return 'nd';
    else if (i == 3) return 'rd';
    else return 'th';
}

//Pad a zero in front of single digit numbers
function padTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}