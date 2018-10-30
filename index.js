const express = require('express')
const {Pool} = require('pg')
const moment = require('moment-timezone')
const path = require('path')
const exphbs = require("express-handlebars")

// load environment variables for localhost
try {
	require('dotenv').config()
} catch (e) {}

// get database connection pool
const db = (function() {
    if (process.env.DATABASE_URL) {
        return new Pool({
            'connectionString': process.env.DATABASE_URL,
            'ssl': true
        })
    } else {
        // return stub
        return {
            'query': () => {
                return Promise.resolve({
                    rows: []
                })
            }
        }
    }
})()

// configure app
const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

/**
 * Simple GET route to list accounts.
 */
app.get('/*', (req, res) => {
    const formatDate = (date) => {
        let m = date && date['diff'] ? date : date ? moment(date) : moment()
        return m.tz(process.env.TIMEZONE || 'Europe/Copenhagen').format(process.env.DATETIME_FORMAT || 'YYYY-M-D @ k:mm')
    }

    db.query('select name, website, phone, tickersymbol, accountnumber, type from salesforce.account').then(rs => {
        // build result object for template
        let context = {'updated': formatDate()}
        context.accountlist = rs.rows
		res.render('accountlist', context)
    }).catch(err => {
        res.status(500).send(`Unable to get response from database (${err.message})`).end()
    })
})

// listen
const port = process.env.PORT || 3000
app.listen(port)
console.log(`Listening on port ${port}`)

// add termination listener
require('./terminate-listener.js')(() => {
	console.log("Terminating services");
	db.end()
	console.log("Terminated services");
});
