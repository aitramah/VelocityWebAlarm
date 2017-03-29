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
    var sampleDaysOfWeek = [false, true, true, true, false, false, false];
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
            "<button type='button' class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
            "<h5 class='list-group-item-heading'>" + alarm.getName() + "</h5>" +
            "<h2 class='list-group-item-heading'>" + alarm.getHour()+":"+padTime(alarms[i].getMinute()) + "</h2>" +
            stringOfLabels + "</a>");

    }

}
function removeElementFromAlarmList(alarmID) {
    $('#' + alarmID).remove();
}

// ------------ UI Event Listeners -------------- \\

$('#add-alarm-button').click(function () {

    // Initialize Hours of Dropdown
    $(function () {
        for (var i = 1; i <= 12; i++) {
            $('#select-hour').append($('<option></option>').val(i).html(i));
        }
    });

    // Initialize Minutes of Dropdown
    $(function () {
        for (var i = 1; i <= 60; i++) {
            $('#select-min').append($('<option></option>').val(i).html(i));
        }
    });

});

$('#select-freq').change(function () {
    if (this.value === "Weekly") {
        $('#weekly-label').removeClass('hidden');
        $('#weekly-line').removeClass('hidden');
        $('#daysInput').removeClass('hidden');

    } else if (!$('#weekly-label').hasClass('hidden')) {
        $('#weekly-label').addClass('hidden');
        $('#weekly-line').addClass('hidden');
        $('#daysInput').addClass('hidden');
    }
});

//This should work but it doesn't!!!
$('button').click(function () {
    alert("test");
    removeElementFromAlarmList($(this).parent().attr('id'));

});