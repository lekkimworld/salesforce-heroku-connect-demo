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
            },
            'end': () => {}
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
app.get('/', (req, res) => {
    const formatDate = (date) => {
        let m = date && date['diff'] ? date : date ? moment(date) : moment()
        return m.tz(process.env.TIMEZONE || 'Europe/Copenhagen').format(process.env.DATETIME_FORMAT || 'YYYY-M-D @ k:mm')
    }

    db.query('select * from salesforce.account').then(rs => {
        // build result object for template
        let context = {'updated': formatDate()}
        context.accountlist = rs.rows
		res.render('accountlist', context)
    }).catch(err => {
        res.status(500).send(`Unable to get response from database (${err.message}) - did you create a Heroku Connect Mapping yet?`).end()
    })
})

/**
 * Add many certifications to the database.
 */
app.get('/addcertifications', (req, res) => {
    // get account number for bulk insert
    const accountNo = process.env.BULK_ACCOUNT_NO || 'CD736025'
    const numRecords = (function() {
        if (process.env.BULK_NUM_RECORDS) return process.env.BULK_NUM_RECORDS - 0
        return 100
    })()
    console.log(`Inserting bulk certifications - ${numRecords} for ${accountNo}`)

    // delete all rows from cerfifications (also to ensure we have the certification table)
    return db.query('delete from salesforce.certification__c;').then(rs => {
        return db.query('BEGIN;')
    }).then(() => {
        return db.query(`select sfid from salesforce.account where accountnumber='${accountNo}';`)
    }).then(rs => {
        // get the account id
        const accountId = rs.rows[0].sfid
        console.log(`Inserting ${numRecords} records for account with ID ${accountId}`)

        // insert the data using sequential promises as it otherwise only took around 70
        const promiseSerial = funcs =>
            funcs.reduce((promise, func) =>
            promise.then(result => func().then(Array.prototype.concat.bind(result))),
            Promise.resolve([]))
        return promiseSerial([...Array(numRecords).keys()].map(i => {
            return () => db.query("insert into salesforce.certification__c (external_id__c, date_issued__c, name, account__c) values ($1, now(), $2, $3);", 
            [`d8b1ee8f-dfad-45e5-bfbf-counter${i}`, `Advanced Platform (${i})`, accountId])
        }))
    }).then(() => {
        console.log('Committing...')
        return db.query('COMMIT;')
    }).then(() => {
        console.log('Redirecting back to /...')
        return res.redirect('/')
    }).catch(err => {
        // error - table probably not there - send to error page
        console.log(err)
        db.query('ROLLBACK;').then(rs => {
            res.render('nocertificationtable')
        })
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
