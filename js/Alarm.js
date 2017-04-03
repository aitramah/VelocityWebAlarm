/**
 * Created by colin thompson on 2017-03-21.
 */

function Alarm(daysOfWeek, hour, min, frequency, name) {

    var daysOfWeek = daysOfWeek; //A bitmask containing the days of the week the alarm should go off on (array of booleans)
    var hour = hour; //The hour of the day to go off (0 - 23)
    var min = min; //The minute to go off (0 - 59)
    var frequency = frequency; //How frequently the alarm goes off
    var name = name; //The name of the alarm
    var uuid = generateUUID();

    var dayFlags = [false, false, false, false, false, false, false]; // Used for alarms going off


    Alarm.prototype.getDaysOfWeek = function () {
        return daysOfWeek.slice();
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

    Alarm.prototype.setUUID = function (id) {
        uuid = id;
    };


    Alarm.prototype.getDayFlags = function() {
        return dayFlags;
    };

    Alarm.prototype.setDayFlags = function(dayIndex) {
        for(i = 0; i < dayFlags.length; i++){
            dayFlags[i] = false;
        }
        dayFlags[dayIndex] = true;
    };


    /**
     * This function is needed to be able to "stringify" alarm objects such that they can be
     * serialized as strings and stored.
     *
     * @returns {{uuid: string, daysOfWeek: *, hour: *, min: *, frequency: *, name: *}}
     */
    toJSON: function() {
        console.log('toJSON');
        var returnObject = {"daysOfWeek": this.daysOfWeek,
                            "hour": this.hour,
                            "min": this.min,
                            "frequency": this.frequency,
                            "name": this.name,
                            "uuid": this.uuid
                            };

        return returnObject;
    };



}

var AlarmFrequency = {
    ONCE: 0,
    DAILY: 1,
    WEEKLY: 2
};
