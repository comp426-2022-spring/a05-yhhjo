const PATHS = {
    flip: '/app/flip/',
    base: 'http://localhost:5555/',
    flips:'app/flips/'

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
        document.getElementById("response").innerHTML = result.flip;
        document.getElementById("coinflip").setAttribute("src", "assets/img/" + result.flip + ".png")
    })
}
// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series
// Add event listener to coins

function coinFlips() {
    const nflips = document.getElementById("number").value
    const req = PATHS.base + PATHS.flips +nflips
    
    // Debug
    document.getElementById("request").innerHTML = req;
}



// Guess a flip by clicking either heads or tails button
