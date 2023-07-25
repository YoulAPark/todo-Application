const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({extended : true}));

const MongoClient = require('mongodb').MongoClient;

var db;

MongoClient.connect('mongodb+srv://admin:qwer1234@jennifer.j22z1ok.mongodb.net/todoApplication?retryWrites=true&w=majority', { useUnifiedTopology: true }, function (에러, client) {

if (에러) return console.log(에러)
  db = client.db('todoApplication');

  app.listen(8080, function () {
    console.log('listening on 8080')
  });
});

app.get('/write', function(요청, 응답) {
    응답.sendFile(__dirname + '/write.html');
}); 

app.post('/add', function(요청, 응답) {
  var todo = (요청.body.title);
  var date = (요청.body.date);
  db.collection('post').insertOne( { 제목 : todo, 날짜 : date }, function(에러, 결과) {
    console.log('저장완료');
  });
});