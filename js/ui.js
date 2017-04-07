/**
 * Created by colinthompson on 2017-03-27.
 * Use this class for manipulating any of the UI
 */

/**
 * Using an array of alarms, populates the alarm list panel.
 * @param alarms - A list of alarms to append
 */
function populateListUIFromArray(alarms) {

    const WEEKDAY_ABR = ['Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'];

    var alarmList = $('#alarm-list');

    // For each alarm held in the coordinator, create a list element
    for (var i = 0; i < alarms.length; i++) {
        var alarm = alarms[i];

        //For repeating alarms obtain the days it runs as a series of labels
        var stringOfLabels = "";
        if (alarm.getFreq() === AlarmFrequency.WEEKLY) {
            stringOfLabels += "<hr style='margin-top: 2px; margin-bottom: 6px'>";
            var days = alarm.getDaysOfWeek();
            for (var day = 0; day < days.length; day++) { //Check if enabled for that day
                if (days[day] === true) {
                    stringOfLabels += "<span class='label label-default'>" + WEEKDAY_ABR[day] + "</span>" //Append day's label
                }
            }
        }

        // If there are no elements corresponding to the alarm's UUID
        if ($('#' + alarm.getUUID()).length == 0) {
            console.log(alarm.getUUID());
            //Add alarm to list
            alarmList.append("<a href='#' class='list-group-item' id='" + alarm.getUUID() + "'>" +
                "<button type='button' class='close' name='closebutton' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                "<button type='button' class='btn btn-primary-transparent' name='modifybutton' id='modify-alarm-button'>" +
                "<img id='modify-alarm-button-image' src='images/edit-alarm-button.png'>" +
                "<span class='pull-right'></span></button>" +
                "<h5 class='list-group-item-heading'>" + alarm.getName() + "</h5>" +
                "<h2 class='list-group-item-heading'>" + alarm.getHour() + ":" + padTime(alarms[i].getMinute()) + "</h2>" +
                stringOfLabels + "</a>");
        }
    }
}

function removeElementFromAlarmList(alarmID) {
    $('#' + alarmID).remove();
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

    //If no day selected pick current day.
    if (!daysOfWeek.includes(true)) {
        var today = new Date();
        daysOfWeek[today.getDay()] = true;
    }

    var alarm = new Alarm(daysOfWeek, hour, min, freq, alarmName);
    var ac = new AlarmCoordinator();

    if ($("#alarm-modal-title").val() === 'Add Alarm') {
        ac.addNewAlarm(alarm);
    }
    else {
        console.log("set freq 2: ", $("#select-freq").val());
        ac.changeAlarm(oldAlarmID, alarm); // param1 = old alarm, param2 = new alarm
        removeElementFromAlarmList(oldAlarmID);
        resetModal();
    }

    $('#add-alarm-modal').modal('hide');
    populateListUIFromArray(ac.getAlarms());
});

/**
 * Listens for button to be clicked on and removes alarm from ui and list.
 */
$(document).on("click", "[name='closebutton']", function () {
    var id = $(this).parent().attr('id');
    removeElementFromAlarmList(id);
    (new AlarmCoordinator).removeAlarm(id);
    return false; // to prevent webpage from scrolling back to top
});

var oldAlarmID; // global variable to hold the oldAlarmID for modifying an existing alarm

/**
 * Listens for the modify button to be clicked and opens the modify alarm modal.
 * The modal will be pre-populated with information from the existing alarm.
 */
$(document).on("click", "[name='modifybutton']", function () {

    oldAlarmID = $(this).parent().attr('id');
    var oldAlarm = (new AlarmCoordinator).getAlarmByID(oldAlarmID); // param = selected alarm ID

    $("#alarm-modal-title").text('Modify Alarm'); // set modal title
    $("#inputAlarmName").val(oldAlarm.getName()); // set alarm name

    // hours are stored in 24-hour format, so the values need to be converted and AM/PM derived
    if (oldAlarm.getHour() < 13) {
        var hour = oldAlarm.getHour();
        if (oldAlarm.getHour() === 12) {
            var AMPM = "PM";
        }
        else {
            var AMPM = "AM";
        }
    }
    else {
        var hour = oldAlarm.getHour() - 12;
        var AMPM = "PM";
    }

    $("#select-hour").val(hour); // set hour
    $("#select-min").val(oldAlarm.getMinute()); // set minute
    $("#select-ampm").val(AMPM); // set AMPM

    // set frequency
    if (oldAlarm.getFreq() === 1){
        $("#select-freq").val("Daily");
    }
    else if (oldAlarm.getFreq() === 2){
        $("#select-freq").val("Weekly");
        var dayArray = oldAlarm.getDaysOfWeek();
        // set checkboxes for days of the week
        for (var i = 1; i <= 7; i++) {
            if (dayArray[i - 1] === true) {
                $("#inlineCheckbox" + i).prop('checked', true);
            }
        }
        $('#weekly-label').removeClass('hidden');
        $('#weekly-line').removeClass('hidden');
        $('#daysInput').removeClass('hidden');
    }
    else if (oldAlarm.getFreq() === 0){
        $("#select-freq").val("Once");
    }

    $("#submit-alarm").text('Modify!'); // submit button
    $('#add-alarm-modal').modal('show');
    return false; // to prevent webpage from scrolling back to top
});

/**
 * Listens for the modal close button to be clicked and resets the modal.
 */
$(document).on("click", "[id='closeModal']", function () {
    resetModal();
});

function resetModal() {
    $("#alarm-modal-title").text('Add Alarm'); // reset modal title text
    $("#inputAlarmName").val(''); // reset alarm name
    $("#select-hour").val('1'); // reset hour to 1
    $("#select-min").val('0'); // reset minute to 00
    $("#select-ampm").val('AM'); // reset to AM
    $("#select-freq").val("Once"); // reset to Once

    // reset all checkboxes to unchecked and hide them
    for (var i = 1; i <= 7; i++) {
        $("#inlineCheckbox" + i).prop('checked', false);
    }
    $('#weekly-label').addClass('hidden');
    $('#weekly-line').addClass('hidden');
    $('#daysInput').addClass('hidden');

    $("#submit-alarm").text('Add Alarm!'); // reset submit button text
}

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