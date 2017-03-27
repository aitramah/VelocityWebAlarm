/**
 * Intended to check alarms to see if they are ready to go off.
 * Created by Aidan on 2017-03-26.
 */
function AlarmCoordinator(){
    var alarmList = [];

    /**
     * Simple method designed to add an alarm to the alarmList. It
     * also starts the checkAlarms method.
     * @param alarm Alarm to be checked.
     */
    AlarmCoordinator.prototype.addNewAlarm = function(alarm){
        alarmList.push(alarm);
        this.checkAlarms();
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

            // Conditional statement that checks whether the day, hour, and minute are
            // correct for the alarm to go off.
            if(!alarmDays[weekday] || alarmHour !== h) {
                newArray.push(tempAlarm);
            }
            else if(m === alarmMinute){
                if(alarmFrequency > 0){
                    newArray.push(tempAlarm);
                }
                var alarmName = tempAlarm.getName();
                alert("Alarm Going Off: " + alarmName);
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
            setInterval(this.checkAlarms, 5000); // Restart every 5 seconds
        }

        AlarmCoordinator.prototype.getAlarms = function() {
            return alarmList;
        }
    };
}