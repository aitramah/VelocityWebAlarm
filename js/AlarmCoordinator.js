/**
 * Intended to check alarms to see if they are ready to go off.
 * Created by Aidan on 2017-03-26.
 */

const DEFAULT_ALARM_NAME = "Generic Alarm Name";

var  AlarmCoordinator = (function() {
    var instance;
    var alarmList = [];

    /**
     * Constructor which returns a Singleton
     */
    function AlarmCoordinator() {
        console.log("AlarmCoordinator()");
        if (typeof instance == 'undefined') {
            console.log("instance undefined");
            this.readAlarmsInCache();
            if(alarmList != 'undefined' && alarmList.length >0)
                setTimeout(this.checkAlarms, 500);

            instance = this;
        }
        return instance;
    }

    /**
     * Simple method designed to add an alarm to the alarmList. It
     * also starts the checkAlarms method.
     * @param alarm Alarm to be checked.
     */
    this.addNewAlarm = function(alarm){
        console.log("AlarmCoordinator.prototype.addNewAlarm");
        console.log("new alarm: " + JSON.stringify(alarm));
        alarmList.push(alarm);
        console.log("Contents of AlarmList: ");

        for(var i=0; i<alarmList.length; i++) {
            console.log("ALARM "+i+"\n"+JSON.stringify(alarmList[i]));
        }

        this.storeAlarmsInCache();

        setTimeout(this.checkAlarms, 500);

    };

    /**
     * Obtains the current time and traverses through the list of Alarms
     * and checks if any of them are due to go off.
     *
     * Additionally, the method updates the alarmList with the alarms that are
     * still scheduled to go off. The way it does this is by creating a temporary
     * array, populating it with the alarms that are still scheduled, and then
     * assigning it to alarmList before execution completes. The only time an alarm
     * is not put in the updated list is if it is non-repeating and it is time
     * for it to go off.
     */
    AlarmCoordinator.prototype.checkAlarms = function() {


        var alarmLength = alarmList.length;
        var today = new Date();
        var newArray = [];

        // Current Time Variables
        var h = today.getHours();
        var m = today.getMinutes();
        var weekday = today.getDay();

        for(i = 0; i < alarmLength; i++){
            var tempAlarm = alarmList[i];

            // Alarm Variables
            var alarmDays = tempAlarm.getDaysOfWeek();
            var alarmHour = tempAlarm.getHour();
            var alarmMinute = tempAlarm.getMinute();
            var alarmFrequency = tempAlarm.getFreq();
            var dayFlags = tempAlarm.getDayFlags();

            // Conditional statement that checks whether the day, hour, and minute are
            // correct for the alarm to go off.
            if(!alarmDays[weekday] || alarmHour !== h) {
                newArray.push(tempAlarm);
            }
            else if(m === alarmMinute){
                if(alarmFrequency > 0){
                    if(dayFlags[weekday]){
                        continue;
                    }
                    else {
                        tempAlarm.setDayFlags(weekday);
                        newArray.push(tempAlarm);
                    }
                }

                // Create  and Play Audio Object
                document.getElementById('alarmFile').play();

                // Name Editing
                document.getElementById("alarmDialogueName").innerHTML = tempAlarm.getName();

                // Modal
                $('#alarmDialogueModal').modal({
                    show: true
                });

                // Stop Audio Object
                document.getElementById("alarmDialogueButton").onclick = function() {
                    $('#alarmDialogueModal').modal('toggle');
                    document.getElementById('alarmFile').pause();
                };

                if(alarmFrequency == 0) {
                    removeElementFromAlarmList(tempAlarm.getUUID())
                }

            }
            else{
                newArray.push(tempAlarm);
            }
        }

        // Re-assign the Array of Alarms to remove any alarms that have gone off
        // and shouldn't go off again
        alarmList = newArray;

        // Restart the Function and check again
        if(alarmList.length > 0){
            setTimeout(this.checkAlarms, 500); //Check every half second
        }
    };

    /**
     * If the alarm list is not empty or undefined, this function stores alarms that have
     * been created during this session (and perhaps previous ones) in the cache
     */
    storeAlarmsInCache = function()  {
        console.log("AlarmCoordinator.prototype.storeAlarmsInCache");
        localStorage.removeItem("alarms");
        if(alarmList !== null && alarmList.length > 0) {
            var toSave = JSON.stringify(alarmList);
            console.log("About to save: \n" + toSave);
            localStorage.setItem("alarms", toSave);

        }

        //TESTING
        var obj = localStorage.getItem("alarms");
        console.log("In cache: \n" + obj);

    };

    /**
     * Read any stored alarms from the cache
     */
    //AlarmCoordinator.prototype.
    readAlarmsInCache = function() {

        // get whatever has been cached
        var cachedContents = localStorage.getItem('alarms') || null;
        console.log("cached contents: " + cachedContents);

        // If something was retrieved
        if(cachedContents !== null) {

            // Read the JSON array
            var tempList = JSON.parse(cachedContents);


            // Use the parsed JSON contents to populate alarmList with the cached content
            for (var i = 0; i < tempList.length; i++) {
                var t = tempList[i];
                // Create a new alarm by using static method
                var alarm = new Alarm(t.daysOfWeek, t.hour, t.min, t.frequency, t.name);
                alarm.setUUID(t.uuid);
                alarmList.push(alarm);
            }
        }

    };

    this.getAlarms = function() {
        for(var i = 0; i < alarmList.length; i++) {
            console.log("alarmList["+i+"] : " + JSON.stringify(alarmList[i]));
        }
        return alarmList.slice();
    };


    return AlarmCoordinator;

})();