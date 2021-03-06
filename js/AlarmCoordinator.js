/**
 * Intended to check alarms to see if they are ready to go off.
 * Created by Aidan on 2017-03-26.
 */

const DEFAULT_ALARM_NAME = "Alarm";
const DEFAULT_SNOOZE_MINUTES = 1;

var AlarmCoordinator = (function() {

    // Holds list of all alarms to go off
    var alarmList = [];

    // Single instance of AlarmCoordinator (singleton)
    var instance;

    // "Mutex" Designed to Allow Alarms to Go Off Gracefully
    // mutex = false, if No Alarm is in the process of going off
    // mutex = true, if an alarm is currently in the process of going off
    var mutex = false;

    // Holds alarms in the process of going off or being snoozed
    var pendingDismissal = [];

    /**
     * Constructor which returns a Singleton
     */
    function AlarmCoordinator() {
        console.log("AlarmCoordinator()");
        if (typeof instance === 'undefined') {
            console.log("CREATING NEW ALARMCOORDINATOR");
            this.readAlarmsInCache();
            if (alarmList !== 'undefined' && alarmList.length > 0)
                setTimeout(this.checkAlarms, 500);
            instance = this;
        }
        return instance;
    }

    /**
     * Simple method designed to add an alarm to the alarmList. It also starts the checkAlarms method.
     * @param alarm to be checked.
     */
    this.addNewAlarm = function (alarm) {
        console.log("AlarmCoordinator.addNewAlarm :: adding new alarm");
        console.log("New Alarm: " + JSON.stringify(alarm));

        alarmList.push(alarm);

        console.log("Contents of AlarmList: ");
        for (var i = 0; i < alarmList.length; i++) {
            console.log("ALARM " + i + "\n" + JSON.stringify(alarmList[i]));
        }

        this.storeAlarmsInCache();

        if (alarmList.length === 1)
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
     *
     * Multiple, Daily, and Weekly Alarms Verified ~ Aidan.
     */
    this.checkAlarms = function () {
        var today = new Date();

        // Current Time Variables
        var h = today.getHours();
        var m = today.getMinutes();
        var weekday = today.getDay();

        //console.log("alarmList length = "+ alarmList.length);
        for(i = 0; i < alarmList.length; i++) {
            var theAlarm = alarmList[i];
            // Conditional statement that checks whether the day, hour, and minute are
            // correct for the alarm to go off
            if(theAlarm.getDaysOfWeek()[weekday] && theAlarm.getHour() === h && m === theAlarm.getMinute()) {
                var alarmFrequency = theAlarm.getFreq();
                if(alarmFrequency > 0) {
                    if(theAlarm.getDayFlags()[weekday])
                        continue;
                    else
                        theAlarm.setDayFlags(weekday);
                }

                // Push alarm that is going off to wait-to-be-dismissed list
                pendingDismissal.push(theAlarm);

                if(alarmFrequency === 0) {
                    removeElementFromAlarmList(theAlarm.getUUID());
                    alarmList.splice(i, 1);
                    i--;
                }

            }
            //console.log("-------end checkAlarms-------");
        }

        this.gracefulAlarmTrigger();
        this.storeAlarmsInCache();

        setTimeout(this.checkAlarms, 500); //Check every 0.5 seconds

   };

    /**
     * If the alarm list is not empty or undefined, this function stores alarms that have
     * been created during this session (and perhaps previous ones) in the cache
     */
    this.storeAlarmsInCache = function () {
        //console.log("AlarmCoordinator.storeAlarmsInCache :: storing alarms");
        localStorage.removeItem("alarms");
        if (alarmList !== null && alarmList.length > 0) {
            var toSave = JSON.stringify(alarmList);
            localStorage.setItem("alarms", toSave);
        }
    };

    /**
     * Checks if an object is empty by iterating over all of its properties and checking if all do not exist
     * @param obj
     * @returns {boolean}
     */
    function isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

    /**
     * Read any stored alarms from the cache
     */
    //AlarmCoordinator.prototype.
    this.readAlarmsInCache = function () {
        // get whatever has been cached
        var cachedContents = localStorage.getItem('alarms') || null;
        console.log("AlarmCoordinator.readAlarmsInCache :: loaded cached contents: " + cachedContents);

        // If something was retrieved
        if (cachedContents !== null) {

            // Read the JSON array
            var tempList = JSON.parse(cachedContents);


            // Use the parsed JSON contents to populate alarmList with the cached content
            for (var i = 0; i < tempList.length; i++) {
                var t = tempList[i];

                if (isEmpty(t)) continue;

                // Create a new alarm by using static method
                var alarm = new Alarm(t.daysOfWeek, t.hour, t.min, t.frequency, t.name);
                alarm.setUUID(t.uuid);
                alarmList.push(alarm);
            }
        }

    };

    /**
     * Retrieves alarmList
     * @returns {Array.<*>}
     */
    this.getAlarms = function () {
        for (var i = 0; i < alarmList.length; i++) {
            //console.log("alarmList[" + i + "] : " + JSON.stringify(alarmList[i]));
        }
        return alarmList.slice();
    };

    /**
     * Removes the specified alarm from the alarm list
     * @param uuid
     */
    this.removeAlarm = function (uuid) {
        console.log("AlarmCoordinator.removeAlarm :: removing alarm");
        var newArray = [];
        for (var i = 0; i < alarmList.length; i++) {
            //console.log("index " + i + " uuid: " + alarmList[i].getUUID() + " matching " + uuid);
            if (alarmList[i].getUUID() !== uuid) {
                newArray.push(alarmList[i]);
            }
        }
        alarmList = newArray;
        //console.log(newArray);
        this.storeAlarmsInCache();
    };

    /**
     * Swaps out the alarm with oldAlarmID to newAlarm
     */
    this.changeAlarm = function (oldAlarmID, newAlarm) {
        removeAlarm(oldAlarmID);
        addNewAlarm(newAlarm);
    };

    /**
     * Returns a running alarm with given id
     */
    this.getAlarmByID = function (alarmID) {
        for (var i = 0; i < alarmList.length; i++) {
            if (alarmList[i].getUUID() === alarmID)
                return alarmList[i];
        }
    };

    /**
     * This function is called once an alarm has been definitely dismissed by the user
     * @param alarmID
     */
    this.dismissAlarm = function(alarmID) {
        mutex = false;

        console.log("-----dismissAlarm-----");
        for(var i=0; i <pendingDismissal.length; i++) {
            if(pendingDismissal[i].getUUID() === alarmID) {
                pendingDismissal.splice(i, 1);
                return;
            }
        }
    };

    /**
     * This function is called to set a snooze on a specific alarm
     * @param alarmID
     */
    this.snoozeAlarm = function(alarmID) {

        console.log("-----snoozeAlarm-----");
        console.log(alarmID);

        mutex = false;

        // Check to find the alarm to be snoozed
        for(var i=0; i <pendingDismissal.length; i++) {
            // If the alarm is found, remove it from the pendingDismissal array temporarily
            // and set a timeout to put it in the back of the array after a specified amount of time
            if(pendingDismissal[i].getUUID() === alarmID) {
                var rescheduledAlarm = pendingDismissal[i];
                pendingDismissal.splice(i, 1);
                setTimeout(function() { pendingDismissal.push(rescheduledAlarm); }, DEFAULT_SNOOZE_MINUTES*60000);
                return;
            }
        }

    };

    /**
     * This function works in tandem with the variable "mutex" to ensure
     * graceful alarm triggering.
     *
     * Functionality
     * 1a. Checks mutex to see that there is no alarm currently being triggered
     * 1b Checks to make sure that pendingDismissal array isn't empty
     * 2. If these conditions are met, the mutex is set to true
     * 3. The first element of the pending dismissal array will be obtained
     * and sent to the trigger function
     * 4. The mutex will eventually be set back to false once the dismiss or snooze
     * button is called
     */
    this.gracefulAlarmTrigger = function() {
        if(!mutex && pendingDismissal.length > 0) {
            mutex = true;
            var nextAlarm = pendingDismissal[0]; // Get the first element of the array
            setTimeout(function() { triggerAlarm(nextAlarm); }, 1000);
        }
    };

    return AlarmCoordinator;

})();