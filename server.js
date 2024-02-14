const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const ejs = require('ejs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login_register'
});

db.connect((err) => {
    if (err) {
        console.error(`Error connection to database`);
    } else {
        console.log('Connected to database');
    }
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const sqlAgain = `SELECT * FROM users WHERE username = ?`
    const sqlRegister = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.query(sqlAgain, [username], (err, results) => {
      if (err) {
        console.log(err);
        res.send('Error');
      } else if (results.length > 0) {
        res.send('username is already');
      } else {
        db.query(sqlRegister, [username, password], (err) => {
          if (err) {
            console.log(err);
            res.send('Error');
          } else {
            res.redirect('/login');
          }
        });
      }
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sqlLogin = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.query(sqlLogin, [username, password], (err, results) => {
      if (err) {
        console.log(err);
        res.send('Error');
      } else if (results.length === 0) {
        res.send('incorrect');
      } else {
        res.redirect('/home');
      }
    });
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`);
});