//
// definitions
//

var path = require('path');
const fs = require('fs');
//const db = require('./connect.js');
let http = require('http');
var express = require('express');
// add express-handlebars to use handlebars with express view engine
var exphbs = require('express-handlebars');
const { setTimeout } = require('timers');
const apiHelper = require('./api.js');
const multer = require('multer');
var storage = multer.diskStorage(
    {
        destination: './images/',
        filename: function ( req, file, cb ) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            //cb( null, file.originalname+ '-' + Date.now()+".pdf");
            cb( null, file.originalname);
        }
    }
);
const upload = multer({ storage: storage });

var app = express()
var port = process.env.PORT || 3003

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//
// route service
//

// index
// NOTE: this route uses ASYNC syntax to allow it to wait
app.get('/', async (req, res) => {
    // debug 
    const sessInfo = req.session
    res.render('index', {
        sessInfo
    })
})
app.get('/submit', function (req, res) {
    // renders the index page with all posts, and thus all features
    res.render('submit', {

    })
})
app.post('/submit', upload.single('submitImage'), function (req, res) {
    // renders the index page with all posts, and thus all features
    let submissionImage = req.file;
    //let submissionTitle = req.body.submitName;
    console.log("FOR "+"submissionTitle");
    console.info(submissionImage)
    res.send('Submitted: '+submissionImage);
})

// services
// DATABASE RESET ROUTE
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

//
app.listen(port, function () {
    console.log("== Server is listening on port", port)
})