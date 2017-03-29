/**
 * Created by colinthompson on 2017-03-22.
 */

/**
 * A UUID generator
 * Source: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * @returns {string}
 */
function generateUUID () { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

/**
 * Rerouted button functionality to this function for testing of saving/retrieving cached alarms
 */
function testAlarmCreation() {

    var sampleDaysOfWeek = [false, true, false, false, false, false, false];
    var sampleDate = new Date();
    var sampleHour = sampleDate.getHours();
    var sampleMin = sampleDate.getMinutes() + 1;
    var sampleAlarm = new Alarm(sampleDaysOfWeek, sampleHour, sampleMin, AlarmFrequency.ONCE, "Nooo");
    AlarmCoordinator().addNewAlarm(sampleAlarm);


    sampleDaysOfWeek = [false, true, false, true, false, true, false];
    sampleDate = new Date();
    sampleHour = sampleDate.getHours();
    sampleMin = sampleDate.getMinutes() + 1;
    var sampleAlarm1 = new Alarm(sampleDaysOfWeek, sampleHour, sampleMin, AlarmFrequency.ONCE, "Woot time");
    AlarmCoordinator().addNewAlarm(sampleAlarm1);

    sampleDaysOfWeek = [true, true, true, true, true, true, true];
    sampleDate = new Date();
    sampleHour = sampleDate.getHours();
    sampleMin = sampleDate.getMinutes() + 1;
    var sampleAlarm2 = new Alarm(sampleDaysOfWeek, sampleHour, sampleMin, AlarmFrequency.ONCE, "Anotha one");
    AlarmCoordinator().addNewAlarm(sampleAlarm2);
}

window.onbeforeunload = function() {
     AlarmCoordinator().storeAlarmsInCache();
}