/**
 * Created by colin thompson on 2017-03-21.
 */

function Alarm(daysOfWeek, hour, min, frequency, name) {
    var mDaysOfWeek = daysOfWeek; //A bitmask containing the days of the week the alarm should go off on (array of booleans)
    var mHour = hour; //The hour of the day to go off (0 - 23)
    var mMin = min; //The minute to go off (0 - 59)
    var mFrequency = frequency; //How frequently the alarm goes off
    var mName = name; //The name of the alarm

    var mUuid = generateUUID();
    var mDayFlags = [false, false, false, false, false, false, false]; // Used for alarms going off

    this.getDaysOfWeek = function () {
        return mDaysOfWeek.slice();
    };

    this.setDaysOfWeek = function (theDaysOfWeek) {
        mDaysOfWeek = theDaysOfWeek;
    };

    this.getName = function () {
        return mName;
    };

    this.resetName = function (newName) {
        mName = newName;
    };

    this.getHour = function () {
        return mHour;
    };

    this.setHour = function (anHour) {
        mHour = anHour;
    };

    this.getMinute = function () {
        return mMin;
    };

    this.setMinute = function (minute) {
        mMin = minute;
    };

    this.getFreq = function () {
        return mFrequency;
    };

    this.setFreq = function (freq) {
        mFrequency = freq;
    };

    this.getUUID = function () {
        return mUuid;
    };

    this.setUUID = function (id) {
        mUuid = id;
    };

    this.getDayFlags = function () {
        return mDayFlags;
    };

    this.setDayFlags = function (dayIndex) {
        for (i = 0; i < mDayFlags.length; i++) {
            mDayFlags[i] = false;
        }
        mDayFlags[dayIndex] = true;
    };

    /**
     * This function is needed to be able to "stringify" alarm objects such that they can be
     * serialized as strings and stored.
     *
     * @returns {{uuid: string, daysOfWeek: *, hour: *, min: *, frequency: *, name: *}}
     */
    this.toJSON = function () {
        //console.log('toJSON');
        return {
            "daysOfWeek": mDaysOfWeek,
            "hour": mHour,
            "min": mMin,
            "frequency": mFrequency,
            "name": mName,
            "uuid": mUuid
        };
    };
}

var AlarmFrequency = {
    ONCE: 0,
    DAILY: 1,
    WEEKLY: 2
};
