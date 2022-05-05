// Import modules
import { createRequire } from 'module';
import { coinFlip, coinFlips, flipACoin, countFlips } from "./src/controllers/mycontrollers.mjs";
import { exit } from "process";
import { db } from './src/services/database.mjs'
import {logdb} from './src/middleware/mymiddleware.mjs';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const express = require('express')
const fs = require('fs')
const morgan = require('morgan')
const args = require('minimist')(process.argv.slice(2))
const HELP = (`
server.js [options]

--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.

--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.

--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help	Return this message and exit.
`)
if (args.help || args.h) {
    console.log(HELP)
    exit(0)
}
const HTTP_PORT = (args.port >= 1 && args.port <= 65535) ? args.port : 5555
const DEBUG = args.debug
const app = express()

//Make sure it can handle JSON body messages
app.use(express.json());

// Expose everything in the ./public directory to the web
app.use(express.static('./public'));

// Do not create a log file
if (args.log != "false") {
    let msg = fs.existsSync("./data/log/access.log") ? "Access log exists" : "Creating access log"
    console.log(msg)
    const accessLog = fs.createWriteStream('./data/log/access.log', { flags: 'a' })
    // Set up the access logging middleware
    app.use(morgan('combined', { stream: accessLog }))
}
// Start an app server
const server = app.listen(HTTP_PORT, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', HTTP_PORT))
});

// **** API ENDPOINTS **** ///

// Middleware function to insert logs into SQL database
app.use(logdb);

if (DEBUG) {
    app.get('/app/log/access', (req, res) => {
        try {
            const accesses = db.prepare('SELECT * FROM accesslog').all()
            res.status(200).json(accesses)
        } catch (e) {
            console.error(e)
        }
    });
    app.get('/app/error', (req, res) => {
        throw new Error("Error test successful.")
    });
}

app.get('/app/flip/call/:guess(heads|tails)', (req, res) => {
    res.statusCode = 200;
    res.statusMessage = "OK"
    res.json(flipACoin(req.params.guess))
});

app.get('/app/flips/:number', (req, res) => {
    const raw = coinFlips(req.params.number)
    const summary = countFlips(raw)
    const response = {
        raw: raw,
        summary: summary
    }
    res.statusCode = 200;
    res.statusMessage = "OK"
    res.json(response)
});

app.get('/app/flip/', (req, res) => {
    res.statusCode = 200;
    res.statusMessage = "OK"
    res.json(coinFlip())
});

app.get('/app/', (req, res) => {
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.writeHead(res.statusCode, { 'Content-Type': 'text/plain' });
    res.end(res.statusCode + ' ' + res.statusMessage)
});

//** POST  API endpoints for A05 */
app.post('/app/flip/coins/', (req, res, next) => {
    const flips = coinFlips(req.body.number)
    const count = countFlips(flips)
    res.status(200).json({"raw":flips,"summary":count})
})

app.post('/app/flip/call/', (req, res, next) => {
    const game = flipACoin(req.body.guess)
    res.status(200).json(game)
})

// Default response for any request
app.use((req, res) => {
    res.status(404).send('404 NOT FOUND')
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server closed')
    })
})