// Middleware function definitions go here
import { db } from '../services/database.mjs'

function logdb(req, res, next) {
    // Middleware
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user, // May not work...
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    }

    // SQL command to insert the above info into access log
    const stmt = db.prepare(`INSERT INTO accesslog (
                            remoteaddr, 
                            remoteuser, 
                            time, 
                            method, 
                            url, 
                            protocol, 
                            httpversion, 
                            status, 
                            referer, 
                            useragent) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            `)
    stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, 
        logdata.protocol, logdata.httpversion, logdata.status, logdata.referer, logdata.useragent);
    next()
}

export {logdb}