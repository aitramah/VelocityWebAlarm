/**
 * Created by colinthompson on 2017-03-27.
 * Use this class for manipulating any of the UI
 */

/**
 * A general set up upon opening of the web app
 */
function setUp() {
    /*
     Hardcoded Alarm for Testing Purposes (Remove from Final Product)
     */
    var sampleDaysOfWeek = [false, true, false, false, false, false, false];
    var sampleDate = new Date();
    var sampleHour = sampleDate.getHours();
    var sampleMin = sampleDate.getMinutes() + 1;
    var sampleAlarm = new Alarm(sampleDaysOfWeek, sampleHour, sampleMin, AlarmFrequency.ONCE, "Wake up baby");

    // Set Up AlarmCoordinator and Load Sample Alarm
    var coordinator = new AlarmCoordinator();
    coordinator.addNewAlarm(sampleAlarm);

    populateListUIFromArray(coordinator.getAlarms());

}

/**
 * Using an array of alarms, populates the alarm list panel.
 * @param alarms - A list of alarms to append
 */
function populateListUIFromArray(alarms) {

    const WEEKDAY_ABR = ['Sunday',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'];

    var alarmList = $('#alarm-list');

    // For each alarm held in the coordinator, create a list element
    for(var i = 0; i < alarms.length; i++) {
        var alarm = alarms[i];


        //For repeating alarms obtain the days it runs as a series of labels
        var stringOfLabels = "";
        if (alarm.getFreq() === AlarmFrequency.WEEKLY) {
            stringOfLabels += "<hr style='margin-top: 2px; margin-bottom: 6px'>";
            var days = alarm.getDaysOfWeek();
            for(var day = 0; day < days.length; day++) { //Check if enabled for that day
                if (days[day] === true) {
                    stringOfLabels += "<span class='label label-default'>" + WEEKDAY_ABR[day] + "</span>" //Append day's label
                }
            }
        }

        //Add alarm to list
        alarmList.append("<a href='#' class='list-group-item' id='" + alarm.getUUID() + "'>"+
            "<button type='button' class='close alarmListX' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
            "<h5 class='list-group-item-heading'>" + alarm.getName() + "</h5>" +
            "<h2 class='list-group-item-heading'>" + alarm.getHour()+":"+padTime(alarms[i].getMinute()) + "</h2>" +
            stringOfLabels + "</a>");

    }

}
function removeElementFromAlarmList(alarmID) {
    $('#' + alarmID).remove();
}

//This should work but it doesn't!!!
$(function () {
    $(document).on('click', '.alarmListX', function () {
        removeElementFromAlarmList($(this).parent().attribute('id'));
    });

});