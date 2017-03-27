/**
 * Created by Sharon on 3/27/2017.
 */

// https://www.w3schools.com/howto/howto_css_modals.asp

// Get the modal
var modal = document.getElementById('add_dialog');

// Get the button that opens the modal
var btn = document.getElementById("add-alarm-button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}