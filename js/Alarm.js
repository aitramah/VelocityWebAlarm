/**
 * Created by colinthompson on 2017-03-21.
 */


function Alarm(daysOfWeek, hour, min, frequency, name) {
    this.daysOfWeek = daysOfWeek; //A bitmask containing the days of the week the alarm should go off on
    this.hour = hour; //The hour of the day to go off
    this.min = min; //The minute to go off
    this.frequency = frequency; //How frequently the alarm goes off (once, daily, weekly) (if daily bitmask should be all ones)
    this.name = name; //The name of the alarm
}

Alarm.prototype.getName = function() {
    return this.name;
}

Alarm.prototype.id = "test";


var bob = new Alarm(1, 1, 1, 1, 1);
var bill = new Alarm(1, 1, 1, 1, 1);

console.log(bill.id);
bob.id = "newid";
console.log((bill.id));
console.log((bob.id));