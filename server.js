//
// definitions
//

var path = require('path');
const fs = require('fs');
const db = require('./connect.js');
let http = require('http');
var express = require('express');
const session = require('express-session');
// add express-handlebars to use handlebars with express view engine
var exphbs = require('express-handlebars');
const { setTimeout } = require('timers');

var app = express()
var port = process.env.PORT || 3001

//
// middleware
//

// set express app to use express-handlebars on res.render() call
app.engine('handlebars', exphbs.engine({
    defaultLayout: null
}))
app.set('view engine', 'handlebars')

// register custom handlebars helpers...
var hbs = exphbs.create({});
hbs.handlebars.registerHelper('ifDefined', function(conditional, options) {
    // returns true if given variable defined, false if not
    if (typeof conditional !== 'undefined') {
        return options.fn(this);
    }
    else {
        return options.inverse(this);
    }
});

app.use(express.static('static'))
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
    cookie: { }
}));
app.use(function (req, res, next) {
    res.locals.session = req.session;
    //user = req.session.user;
    console.info("Middleware session: "+req.session.username)
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//
// route service
//

// index
// NOTE: this route uses ASYNC syntax to allow it to wait
app.get('/', async (req, res) => {
    // debug 
    try {
        const [dbDebug] = await db.query("SHOW TABLES;");
        console.info(dbDebug);
    }
    catch (err) {
        console.error("Database connection failed");
    }

	if (req.session.loggedin) {
		// Output username
		console.info('Welcome back, ' + req.session.username + '!');
	} else {
		// Not logged in
		console.info('Please login to view this page!');
        //response.end();
	}
    const sessInfo = req.session
    res.render('index', {
        sessInfo
    })
})
app.get('/login', function (req, res) {
    // renders the index page with all posts, and thus all features
    console.log("SERVING LOGIN VIEW")
    res.render('login', {

    })
})

// services
// DATABASE RESET ROUTE
app.post('/reset-database', async function (req, res) {
    try {
        const resetQuery = `EXEC sp_create_lserveDB();`;
        const [queryResult] = await db.query(resetQuery);
        console.info('RESET the database \"lserve\"...');

        res.redirect('/');
    } catch (err) {
        console.error('Outer reset failure:', err.message);
        res.status(500).send('Database reset failed.');
    }
});
//auth:login
app.post('/auth', async (request, response) => {
    console.log("Authorizing...")
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
    console.log("Attempting login "+username+" "+password);
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		const [loginResult] = await db.query('CALL lserve.sp_access_user(?, ?);', 
                                            [username, password]);
        const [resultUser] = loginResult[0];
        // If there is an issue with the query, output the error
        if (typeof resultUser === 'undefined') {
            const resJSON = {"userInfo": 'undefined', 
                            "userID": -1,
                            "message": "Login failure!"}
            response.send(resJSON);
        } 
        else {
            (console.info(resultUser));
            // Authenticate the user
            const resJSON = {"userInfo": resultUser, 
                            "userID": resultUser.userID,
                            "message": "Login success!"}
            response.send(resJSON);
        }		
        response.end();
	} 
    else {
        const resJSON = {"userInfo": 'undefined', 
                        "userID": -1,
                        "message": "Please enter a username and password!"}
        response.send(resJSON);
		response.end();
	}
});
app.get('/logout', async (req, res, next) => {
    console.log("Attempting to log out user...")
    req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
})

//
app.listen(port, function () {
    console.log("== Server is listening on port", port)
})