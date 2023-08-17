

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let db = new sqlite3.Database(':memory:');

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const sql = 'INSERT INTO users (username, password) VALUES (?,?)';
    db.run(sql, [username, password], function(err) {
        if (err) {
            return res.status(500).send('Error registering user.');
        }
        res.send('User registered!');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.get(sql, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error logging in.' });
        }
        if (row) {
            const token = jwt.sign({ username: row.username }, SECRET, { expiresIn: '24h' });
            res.json({ success: true, token: token });
        } else {
            res.json({ success: false, message: 'Incorrect credentials.' });
        }
    });
});
app.post('/logout', (req, res) => {
    res.send('Logged out');
});


// Load our database schema
const fs = require('fs');
const initSql = fs.readFileSync('./001-initial.sql', 'utf8');
db.exec(initSql, err => {
    if (err) {
        console.error("Could not initialize DB", err.message);
    } else {
        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    }
});

app.get('/some_protected_route', (req, res) => {
    const token = req.cookies.Authtoken; // Assuming you're using a middleware like cookie-parser

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);  // Forbidden
        }
        // Handle the request knowing the user is authenticated.
    });
});

const jwt = require('jsonwebtoken');
const SECRET = 'mySuperSecretKey';

