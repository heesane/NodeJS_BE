const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL 연결
const dbConn = mysql.createConnection({
  host: '3.216.219.9',
  user: 'hhs',
  password: '5499458kK@',
  database: 'test_db'
});

dbConn.connect();

// 모든 사용자 조회 API
app.get('/users', (req, res) => {
  dbConn.query('SELECT * FROM users', (err, rows, fields) => {
    if (!err)
      res.send(rows);
    else
      console.log(err);
  })
});

// 사용자 생성 함수
app.post('/users', (req, res) => {
  let user = req.body;
  if (!user) {
    return res.status(400).send({ error:true, message: 'Please provide user data' });
  }

  dbConn.query("INSERT INTO users SET ?", user, (err, rows, fields) => {
    if (!err)
      res.send({ error: false, message: 'User added successfully' });
    else
      console.log(err);
  });
});

// 사용자 조회 함수
app.get('/users/:id', (req, res) => {
  let userId = req.params.id;
  if (!userId) {
    return res.status(400).send({ error: true, message: 'Please provide user id' });
  }

  dbConn.query("SELECT * FROM users WHERE id = ?", userId, (err, rows, fields) => {
    if (!err && rows.length > 0)
      res.send(rows[0]);
    else if (rows.length == 0)
      res.send({ message: 'User not found' });
    else
      console.log(err);
  });
});

// 사용자 업데이트 함수
app.put('/users/:id', (req, res) => {
  let userId = req.params.id;
  let user = req.body;
  if (!userId || !user) {
    return res.status(400).send({ error: user, message: 'Please provide user id and data' });
  }

  dbConn.query("UPDATE users SET username = ?, password = ?, is_active = ?, phone_number = ? WHERE id = ?",
    [user.username, user.password, user.is_active, user.phone_number, userId], (err, rows, fields) => {
      if (!err)
        res.send({ error: false, message: 'User updated successfully' });
      else
        console.log(err);
    });
});

// 사용자 삭제 함수
app.delete('/users/:id', (req, res) => {
  let userId = req.params.id;
  if (!userId) {
    return res.status(400).send({ error: true, message: 'Please provide user id' });
  }

  dbConn.query("DELETE FROM users WHERE id = ?", userId, (err, rows, fields) => {
    if (!err)
      res.send({ error: false, message: 'User deleted successfully' });
    else
      console.log(err);
  });
});

// 서버 실행
app.listen(3001, () => {
  console.log('Server started on port 3001...');
});
