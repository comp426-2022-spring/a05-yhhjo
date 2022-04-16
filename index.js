// Import modules
import { createRequire } from 'module';
import { coinFlip, coinFlips, flipACoin, countFlips } from "./src/controllers/mycontrollers.mjs";
import { exit } from "process";
import { db } from './src/services/database.mjs'
import {logdb} from './src/middleware/mymiddleware.mjs';
const require = createRequire(import.meta.url);
const express = require('express')
const fs = require('fs')
const morgan = require('morgan')

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

// Dependencies
const args = require('minimist')(process.argv.slice(2))

if (args.help || args.h) {
    console.log(HELP)
    exit(0)
}
const HTTP_PORT = (args.port >= 1 && args.port <= 65535) ? args.port : 5555
const DEBUG = args.debug
const app = express()

// Do not create a log file
if (args.log != "false") {
    console.log("Creating access log")
    const accessLog = fs.createWriteStream('./data/log/access.log', { flags: 'a' })
    // Set up the access logging middleware
    app.use(morgan('combined', { stream: accessLog }))
}
// Start an app server
const server = app.listen(HTTP_PORT, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', HTTP_PORT))
});

// Middleware function to insert logs into database
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
// Check endpoint /app/flip/call/heads/
app.get('/app/flip/call/heads/', (req, res) => {
    // Respond with status 200
    res.statusCode = 200;
    res.statusMessage = "OK"
    // Write JSON object
    res.json(flipACoin("heads"))
});

// Check endpoint /app/flip/call/tails/
app.get('/app/flip/call/tails/', (req, res) => {
    // Respond with status 200
    res.statusCode = 200;
    res.statusMessage = "OK"
    // Write JSON object
    res.json(flipACoin("tails"))
});

// Check endpoint /app/flips/param:[number]
app.get('/app/flips/:number', (req, res) => {
    const raw = coinFlips(req.params.number)
    const summary = countFlips(raw)
    const response = {
        raw: raw,
        summary: summary
    }
    // Respond with status 200
    res.statusCode = 200;
    res.statusMessage = "OK"
    // Write JSON object
    res.json(response)
});

// Check endpoint /app/flip/
app.get('/app/flip/', (req, res) => {
    // Respond with status 200
    res.statusCode = 200;
    res.statusMessage = "OK"
    // Write JSON object
    res.json(coinFlip())
});

// Check endpoint /app/
app.get('/app/', (req, res) => {
    // Respond with status 200
    res.statusCode = 200;
    // Respond with status message "OK"
    res.statusMessage = 'OK';
    res.writeHead(res.statusCode, { 'Content-Type': 'text/plain' });
    res.end(res.statusCode + ' ' + res.statusMessage)
});

// Default response for any request
app.use(function (req, res) {
    res.status(404).send('404 NOT FOUND')
});

