/**
 * Created by colin thompson on 2017-03-21.
 */

function Alarm(daysOfWeek, hour, min, frequency, name) {
    var uuid = generateUUID();
    var daysOfWeek = daysOfWeek; //A bitmask containing the days of the week the alarm should go off on (array of booleans)
    var hour = hour; //The hour of the day to go off (0 - 23)
    var min = min; //The minute to go off (0 - 59)
    var frequency = frequency; //How frequently the alarm goes off (once, daily, weekly) (if daily bitmask should be all ones)
    var name = name; //The name of the alarm
    var dayFlags = [false, false, false, false, false, false, false];


    Alarm.prototype.getDaysOfWeek = function () {
        return daysOfWeek.slice(0);
    };

    Alarm.prototype.setDaysOfWeek = function (theDaysOfWeek) {
        daysOfWeek = theDaysOfWeek;
    };

    Alarm.prototype.getName = function () {
        return name;
    };

    Alarm.prototype.resetName = function (newName) {
        name = newName;
    };

    Alarm.prototype.setHour = function (anHour) {
        hour = anHour;
    };

    Alarm.prototype.getHour = function () {
        return hour;
    };

    Alarm.prototype.setMinute = function (minute) {
        min = minute;
    };

    Alarm.prototype.getMinute = function () {
        return min;
    };

    Alarm.prototype.getFreq = function () {
        return frequency;
    };

    Alarm.prototype.setFreq = function (freq) {
        frequency = freq;
    };

    Alarm.prototype.getUUID = function () {
        return uuid;
    };


    Alarm.prototype.getDayFlags = function() {
        return dayFlags;
    };

    Alarm.prototype.setDayFlags = function(dayIndex) {
        for(i = 0; i < dayFlags.length; i++){
            dayFlags[i] = false;
        }
        dayFlags[dayIndex] = true;
    }
}

var AlarmFrequency = {
    ONCE: 0,
    DAILY: 1,
    WEEKLY: 2
};

