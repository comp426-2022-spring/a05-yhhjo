const PATHS = {
    flip: '/app/flip/',
    base: 'http://localhost:5555/'
} 

// Focus div based on nav button click
function focusDiv(id) {
    // Turn all active div's off
    const alldivs = document.getElementsByTagName("div");
    for (let i = 0; i < alldivs.length; i++) {
        alldivs[i].setAttribute("class", "hidden");
    }
    // Focus div with id = 'id'
    document.getElementById(id).setAttribute("class", "active");
}
// Flip one coin and show coin image to match result when button clicked

function coinFlip() {
    const response = fetch('http://localhost:5555/app/flip/')
    .then(function (response) {
        return response.json();
    })
    .then(function (result) {
        console.log(result);
        document.getElementById("response").innerHTML = result.flip;
    })
    document.getElementById("request").innerHTML = "Requeset: " + response

}
// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button
