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



    /*
     By: Daniel Velasco

     The following function grabs alarms from the AlarmCoordinator, creates an HTML
     div for each with appropriate information, then appends them to the proper
     place in the index document

     */
    var alarmViews = document.getElementById('alarm-block');
    var alarms = coordinator.getAlarms();

    // For each alarm held in the coordinator, create a view
    for(var i = 0; i < alarms.length; i++) {
        // This is the overarching single alarm view
        var singleAlarmViewDiv = document.createElement('div');
        singleAlarmViewDiv.className = 'row';

        // Creating the alarm name element
        var alarmNameHeader = document.createElement('H3');
        var alarmName = document.createTextNode(alarms[i].getName());
        alarmNameHeader.appendChild(alarmName);

        // Creating the alarm time element
        var alarmTimeHeader = document.createElement('H1');
        var alarmTime = document.createTextNode(alarms[i].getHour()+":"+padTime(alarms[i].getMinute()));
        alarmTimeHeader.appendChild(alarmTime);

        // Creating the frequency element
        var frequencyParagraph = document.createElement('p');
        var frequencyText = document.createTextNode(alarms[i].getFreq());
        frequencyParagraph.appendChild(frequencyText);

        singleAlarmViewDiv.appendChild(alarmNameHeader);
        singleAlarmViewDiv.appendChild(alarmTimeHeader);
        singleAlarmViewDiv.appendChild(frequencyParagraph);

        alarmViews.appendChild(singleAlarmViewDiv);
    }
}