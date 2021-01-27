// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT

// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// native js function for hashing messages with the SHA-256 algorithm
var crypto = require('crypto');

// include the mysql module
var mysql = require("mysql");

var Parser = require("xml2js-parser");

var parser = new Parser({trim:true});

var db;
fs.readFile(__dirname + '/dbconfig.xml', (err, xml) => {
  parser.parseString(xml, (err, dbInfo) => {
    db = mysql.createConnection({
      host: dbInfo['dbconfig'].host[0],
      user: dbInfo['dbconfig'].user[0],
      password: dbInfo['dbconfig'].password[0],
      database: dbInfo['dbconfig'].database[0],
      port: 3306
    });
    db.connect(function(err) {
      if(err) throw err;
      console.log("Connected to MYSQL database!");
    });
  });
});

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false
}));

// server listens on port 9007 for incoming connections
app.listen(process.env.PORT || 9007, () => console.log('Listening on port 9007!'));

app.get('/',function(req, res) {
  res.sendFile(__dirname + '/client/welcome.html');
});

// // GET method route for the events page.
// It serves events.html present in client folder
app.get('/events',function(req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  }
  else {
    res.sendFile(__dirname + '/client/events.html');
  }
});

// GET Method route for the welcome/home page
app.get('/welcome',function(req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  }
  else {
    res.sendFile(__dirname + '/client/welcome.html');
  }
});


// GET method route for the addEvent page.
// It serves addEvent.html present in client folder
app.get('/addEvent',function(req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  }
  else {
    res.sendFile(__dirname + '/client/addEvent.html');
  }
});

app.get('/admin', function(req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  }
  else {
    res.sendFile(__dirname + '/client/admin.html');
  }
});

//GET method for stock page
app.get('/stock', function (req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  }
  else {
    res.sendFile(__dirname + '/client/stock.html');
  }
});

// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login',function(req, res) {
  res.sendFile(__dirname + '/client/login.html');
});

// GET method for index pagee.
app.get('/index', function (req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  }
  else {
    res.sendFile(__dirname + '/client/index.html');
  }
});

app.get('/getListOfUsers', function(req, res) {
  db.query('SELECT  * FROM tbl_accounts', function(err, results) {
    if (err) throw err;
    res.send(results);
  })
});

app.post('/updateUser', function(req,res) {
  db.query('SELECT * FROM tbl_accounts WHERE acc_login=?', req.body.account_login,
  function(err, result) {
    if (err) throw err;
    if (result.length > 0 && req.body.account_id != result[0].acc_id) {
      res.send({'msg' : 'false'});
    }
  });
  var rowToUpdate = {
    acc_name: req.body.account_name,
    acc_login: req.body.account_login,
    acc_password: crypto.createHash('sha256').update(req.body.account_pwd).digest('base64')
  }
  if (req.body.account_pwd == "") {
    rowToUpdate = {
      acc_name: req.body.account_name,
      acc_login: req.body.account_login
    };
  }
  db.query('UPDATE tbl_accounts SET ? WHERE acc_id=?', [rowToUpdate, req.body.account_id],
  function(err, result) {
    if (err) throw err;
    res.send(rowToUpdate);
  });
});
// GET method to return the list of events
// The function queries the tbl_events table for the list of events and sends the response back to client
app.get('/getEvents', function(req, res) {
  db.query('SELECT * FROM tbl_events',
  function(err, results) {
    if (err) {
      throw err;
    }
    res.send(results);
  })
});

// POST method to insert details of a new event to tbl_events table
app.post('/postEventEntry', function(req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  }
  else {
    var insertRow = {
      event_day: req.body.day,
      event_event: req.body.event,
      event_start: req.body.start,
      event_end: req.body.end,
      event_location: req.body.location,
      event_phone: req.body.phone,
      event_info: req.body.info,
      event_url: req.body.url
    };

    db.query('INSERT tbl_events SET ?', insertRow, function(err, result) {
      if (err) {
        throw err;
      }
    });
    res.redirect('/events');
  }
});

app.post('/postAccount', function(req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  }
  else {
    var insertRow = {
      acc_name: req.body.account_name,
      acc_login: req.body.account_login,
      acc_password: crypto.createHash('sha256').update(req.body.account_pwd).digest('base64')
    };
    db.query('INSERT tbl_accounts SET ?', insertRow, function(err, result) {
      if (err) throw err;
    });
    res.redirect('/admin');
  }
});

app.post('/deleteUser', function(req, res) {
  if (!req.session.value) {
    res.rdirect('/login');
  }
  else {
    var id = req.body.id;
    if (id == req.session.value) {
      res.sendStatus(492);
    }
    else {
      var sql = 'DELETE FROM tbl_accounts WHERE acc_id = ?';
      db.query(sql, id, function(err, result) {
        if (err) throw err;
        res.sendStatus(491);
      });
    }
  }
});

app.post('/addUser', function(req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  }
  else {
    var insertRow = {
      acc_name: req.body.account_name,
      acc_login: req.body.account_login,
      acc_password: crypto.createHash('sha256').update(req.body.account_pwd).digest('base64')
    };
    db.query('SELECT * FROM tbl_accounts WHERE acc_login = "'+req.body.account_login+'"',
    function(err, result) {
      if (result.length == 0) {
        db.query('INSERT tbl_accounts SET ?', insertRow, function(err, result) {
          if (err) throw err;
        });
        db.query('SELECT * FROM tbl_accounts WHERE acc_id = (SELECT MAX(acc_id) FROM tbl_accounts)',
        function(err, rows) {
          if (err) throw err;
          res.send(rows);
        });
      }
      else {
        res.send({'msg' : 'false', acc_login: req.body.account_login});
      }
    });
  }
});
// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function(req, res) {
  var user = req.body.username;
  var password = crypto.createHash('sha256').update(req.body.password).digest('base64');
  db.query('SELECT * FROM tbl_accounts WHERE acc_login = "'+user+'" AND acc_password = "'+password+'"',
  function(err, results) {
    if (results.length > 0) {
      req.session.value = results[0].acc_id;
      res.sendStatus(200);
    }
    else {
      res.sendStatus(490);
    }
  });
});

app.get('/userLogin', function(req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  }
  else {
    db.query('SELECT * FROM tbl_accounts WHERE acc_id = "' + req.session.value + '"',
    function (err, results) {
      if (err) throw err;
      res.send(results);
    });
  }
});

// log out of the application
// destroy user session
app.get('/logout', function(req, res) {
  if (!req.session.value) {
    res.send('Can not logout, session is not started.');
  }
  else {
    console.log('Session destroyed successfully.');
    req.session.destroy();
    res.redirect('/login');
  }
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/client/404.html');
});
