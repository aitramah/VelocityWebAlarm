/**
 * Intended to check alarms to see if they are ready to go off.
 * Created by Aidan on 2017-03-26.
 */
function AlarmCoordinator(){
    var alarmList = [];

    AlarmCoordinator.prototype.addNewAlarm = function(alarm){
        alarmList.push(alarm);
    }

    AlarmCoordinator.prototype.checkAlarms = function() {
        alert("Testing 1");
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

            if(!alarmDays[weekday] || alarmHour != h) {
                newArray.push(tempAlarm);
                continue;
            }
            else if(m == alarmMinute){
                if(alarmFrequency > 0){
                    newArray.push(tempAlarm);
                }
                this.alarmGoingOff(i);
            }
            else{
                newArray.push(tempAlarm);
            }
        }

        // Re-assign the Array of Alarms to remove any alarms that have gone off
        // and shouldn't go off again
        alarmList = newArray;

        // Restart the Function and check again
        setTimeout(this.checkAlarms, 5000); // Restart every 5 seconds
    }

    AlarmCoordinator.prototype.alarmGoingOff = function(index){
        var tempAlarm = alarmList[i];
        var alarmName = tempAlarm.getName();
        alert("Alarm Going Off: " + alarmName);
    }
}