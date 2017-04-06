/**
 * Created by colinthompson on 2017-03-27.
 * Use this class for manipulating any of the UI
 */

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
        } else if (alarm.getFreq() == AlarmFrequency.DAILY){
            stringOfLabels += "<hr style='margin-top: 2px; margin-bottom: 6px'><span class='label label-default'>Daily</span>";
        }

        // If there are no elements corresponding to the alarm's UUID
        if ($('#' + alarm.getUUID()).length == 0) {

            var h = alarms[i].getHour();
            var suffix = h < 12 ? " am" : " pm";
            h = h % 12;
            if (h == 0) h = 12;

            //Add alarm to list
            alarmList.append("<a href='#' class='list-group-item' id='" + alarm.getUUID() + "'>"+
                "<button type='button' class='close' name='closebutton' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                "<h5 class='list-group-item-heading'>" + alarm.getName() + "</h5>" +
                "<h2 class='list-group-item-heading'>" + h + ":"+padTime(alarms[i].getMinute()) + suffix +"</h2>" +
                stringOfLabels + "</a>");
        }


    }

}
function removeElementFromAlarmList(alarmID) {
    console.log("----removeElementFromAlarmList----");
    $('#' + alarmID).remove();
}

/**
 * This function is called when an alarm is supposed to go off
 * @param alarm
 */
function triggerAlarm(alarm) {
    console.log("------triggerAlarmDisplay------");

    // Create and Play Audio Object
    document.getElementById('alarmFile').play();

    // Name Editing
    document.getElementById("alarmDialogueName").innerHTML = alarm.getName();

    // Save alarm ID to dialogue content
    document.getElementById("alarmDialogueContent").setAttribute("data-id", alarm.getUUID());
    console.log(alarm.getUUID());

    // Show modal
    $('#alarmDialogueModal').modal({
        show: true
    });


}


// ------------ UI Event Listeners -------------- \\

$(document).ready(function () {

    // Initialize Hours of Dropdown
    $(function () {
        for (var i = 1; i <= 12; i++) {
            $('#select-hour').append($('<option></option>').val(i).html(i));
        }
    });

    // Initialize Minutes of Dropdown
    $(function () {
        for (var i = 0; i <= 59; i++) {
            $('#select-min').append($('<option></option>').val(i).html(padTime(i)));
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

$('#submit-alarm').click(function () {
    //Probably not the best way of doing this but as is life.


    //Obtain Alarm Name
    var alarmName = $('#inputAlarmName').val();
    if (alarmName === "") //If no name set a default
        alarmName = DEFAULT_ALARM_NAME;

    //Convert to 24 hours
    var hour = Number($('#select-hour').val());
    if ($('#select-ampm').val() === "PM") {
        if (!(hour == 12)) {
            hour += 12;
        }
    } else {
        if (hour == 12) {
            hour = 0
        }
    }

    var min = Number($('#select-min').val());
    var freq = $('#select-freq').val();
    freq = getAlarmFreq(freq);

    var daysOfWeek = [false, false, false, false, false, false, false];
    if (freq === AlarmFrequency.WEEKLY) {
        //Make bitmask correspond to the days of the week the user checked
        $.each($("input[name='weekday']:checked"), function () {
            daysOfWeek[$(this).val()] = true;
        });
    } else if (freq === AlarmFrequency.DAILY) {
        //Alter bit mask so the alarm is enabled every day
        daysOfWeek = [true, true, true, true, true, true, true];
    }

    //If no day is selected
    if (!daysOfWeek.includes(true)) {
        var today = new Date();
        var day = today.getDay();

        // If the alarm is set for a time earlier than the current, make the alarm happen tomorrow
        if(hour < today.getHours() || (hour == today.getHours() && min < today.getMinutes())) {
            day++;
        }

        // If tomorrow is next week, adjust day
        day = day > 6 ? 0 : day;

        daysOfWeek[day] = true;
    }

    var alarm = new Alarm(daysOfWeek, hour, min, freq, alarmName);
    var ac = new AlarmCoordinator();
    ac.addNewAlarm(alarm);
    $('#add-alarm-modal').modal('toggle');
    populateListUIFromArray(ac.getAlarms());

});

// Handles the "Dismiss Button" click: stops audio, makes modal invisible
$($("#alarmDialogueButton").click(function() {
    $('#alarmDialogueModal').modal('toggle');
    document.getElementById('alarmFile').pause();

    var ac = new AlarmCoordinator();
    ac.dismissAlarm(document.getElementById("alarmDialogueContent").getAttribute("data-id"));

}));

// Handles a user request for snoozing alarm. It also stop audio, closes modal
$($("#alarmDialogueSnoozeButton").click(function() {

    console.log("-----Snooze Button on Click-----");

    $('#alarmDialogueModal').modal('toggle');
    document.getElementById('alarmFile').pause();


    var ac = new AlarmCoordinator();
    ac.snoozeAlarm(document.getElementById("alarmDialogueContent").getAttribute("data-id"));


}));



/**
 * Listens for button to be clicked on and removes alarm from ui and list.
 */
$(document).on("click", "[name='closebutton']", function () {
    var id = $(this).parent().attr('id');
    removeElementFromAlarmList(id);
    (new AlarmCoordinator).removeAlarm(id);
});
/**
 * Returns the Alarm Frequency Enum associated with the string
 * @param freqString the string to test
 * @returns the enum
 */
function getAlarmFreq(freqString) {
    freqString = freqString.toUpperCase();
    if (freqString == "WEEKLY") {
        return AlarmFrequency.WEEKLY;
    } else if (freqString == "DAILY") {
        return AlarmFrequency.DAILY;
    } else {
        return AlarmFrequency.ONCE;
    }

}