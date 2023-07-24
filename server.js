const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({extended : true}));

const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect('mongodb+srv://admin:qwer1234@jennifer.j22z1ok.mongodb.net/todoApplication?retryWrites=true&w=majority', function (에러, client) {

if (에러) return console.log(에러)
  db = client.db('todoapp');

  db.collection('post').insertOne( {이름 : 'John', _id : 100} , function(에러, 결과){
    console.log('저장완료'); 
  }); 

  app.listen(8080, function () {
    console.log('listening on 8080')
  });
});

app.get('/write', function(요청, 응답) {
    응답.sendFile(__dirname + '/write.html');
}); 

app.post('/add', function(요청, 응답){
    응답.send('전송완료');
    console.log(요청.body.title);
    console.log(요청.body.date);
    // DB에 저장해주세요
});
