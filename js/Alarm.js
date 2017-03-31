/**
 * Created by colin thompson on 2017-03-21.
 */

var Alarm = (function() {

    var uuid;
    var daysOfWeek; //A bitmask containing the days of the week the alarm should go off on (array of booleans)
    var hour; //The hour of the day to go off (0 - 23)
    var min; //The minute to go off (0 - 59)
    var frequency; //How frequently the alarm goes off (once, daily, weekly) (if daily bitmask should be all ones)
    var name; //The name of the alarm

    function Alarm(daysOfWeek, hour, min, frequency, name, uuid) {

        this.daysOfWeek = daysOfWeek;
        this.hour = hour;
        this.min = min;
        this.frequency = frequency;
        this.name = name;
        this.uuid = uuid;
        if (this.uuid === undefined)
            this.uuid = generateUUID();

        return this;
    }



    Alarm.prototype.getDaysOfWeek = function () {
        return daysOfWeek;
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



    /**
     * This function is needed to be able to "stringify" alarm objects such that they can be
     * serialized as strings and stored.
     *
     * @returns {{uuid: string, daysOfWeek: *, hour: *, min: *, frequency: *, name: *}}
     */
    Alarm.prototype.toJSON = function () {
        var returnObject = {"uuid": uuid,
                            "daysOfWeek": daysOfWeek,
                            "hour": hour,
                            "min": min,
                            "frequency": frequency,
                            "name": name };

        return returnObject;
    };

    return Alarm;

})();

var AlarmFrequency = {
    ONCE: 0,
    DAILY: 1,
    WEEKLY: 2
};

