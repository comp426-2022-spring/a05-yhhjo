const PATHS = {
    flip: '/app/flip/',
    base: 'http://localhost:5555/',
    flips: 'app/flip/coins/'

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
    const api = PATHS.base + PATHS.flips
    // Debug
    document.getElementById("request").innerHTML = "fetch: " + api + nflips;

    fetch(api, {
        body: JSON.stringify({ "number": nflips }),
        headers: { "Content-Type": "application/json", },
        method: "post"
    }).then((response) => {
        return response.json();
    }).then((outcome) => {
        // Provide a summary
        document.getElementById("results").setAttribute("class", "active")
        document.getElementById("headcount").innerHTML = "heads= " + outcome.summary.heads;
        document.getElementById("tailcount").innerHTML = "tails= " + outcome.summary.tails;

        // Display the results
        // Remove old results
        resultsTable("heads", outcome)
        resultsTable("tails", outcome)

    })
}

// Displays a row of heads or a row of tails
function resultsTable(ht, outcome) {
    let hr = document.getElementById(ht)
    // Remove old results
    while(hr.firstChild) {
        hr.removeChild(hr.firstChild)
    }
    var tr = document.createElement("tr")
    let to = ht=="heads" ? outcome.summary.heads : outcome.summary.tails
    hr.appendChild(tr)
    for (let i = 0; i < to; i++) {
        var td = document.createElement("td")
        var img = document.createElement("img")
        img.setAttribute("src", "assets/img/" + ht + ".png")
        img.setAttribute("class", "smallcoin")
        /*
        var img = heads.createElement("img")
        heads.setAttribute("src", "assets/img/heads.png")
        */
        td.appendChild(img)
        tr.appendChild(td)
    }
}

// Guess a flip by clicking either heads or tails button
