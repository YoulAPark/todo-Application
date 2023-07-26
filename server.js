const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

var db;

MongoClient.connect('mongodb+srv://admin:qwer1234@jennifer.j22z1ok.mongodb.net/todoApplication?retryWrites=true&w=majority', { useUnifiedTopology: true }, function (에러, client) {

if (에러) return console.log(에러)
  db = client.db('todoApplication');

  app.listen(8080, function () {
    console.log('listening on 8080')
  });
});

app.get('/', function(요청, 응답) {
  응답.render('index.ejs');
});

app.get('/write', function(요청, 응답) {
  응답.render('write.ejs');
});


// '/add' 라는 링크로 접속했을 때
app.post('/add', function(요청, 응답) {
  응답.send('전송완료');

  // counter라는 collection에서 name이 'boardCnt'인 데이터 하나를 찾아주세요 [findOne]
  db.collection('counter').findOne({name : 'boardCnt'}, function(에러, 결과){
    // 결과.totalPost
    console.log("결과 확인 : "+결과.totalPost);
    // 총개시물갯수라는 변수로 지정함
    var 총개시물갯수 = 결과.totalPost;

    // write에서 무엇인가를 작성했을 때 실행되는 함수 [insertOne]
    db.collection('post').insertOne( { _id : 총개시물갯수+1, 제목 : 요청.body.title, 날짜 : 요청.body.date }, function() {
      console.log('저장완료');
      // insert를 진행했을 때 totalPost를 1 increment 시켜줘야하므로 해당 updateOne 함수를 실행시킨다 [updateOne]
      db.collection('counter').updateOne({name : 'boardCnt'},{ $inc : {totalPost:1} },function(에러, 결과){
        if(에러){return console.log(에러)} // 에러문 잡고자 할 떄
      });
    }); 
  }); 
  
});

app.get('/list', function(요청, 응답) {
  db.collection('post').find().toArray(function(에러, 결과) { // 전체 가져오기
    console.log(결과);
    응답.render('list.ejs', { posts : 결과 });
  });
}); 

app.delete('/delete', function(요청, 응답){
  console.log(요청.body);
  요청.body._id = parseInt(요청.body._id); // 문자열로 치환되는 body._id를 숫자로 치환해주는 것
  db.collection('post').deleteOne( 요청.body, function(에러, 결과) {
    // 응답.status(200).send({ message : '성공했습니다.' }); // 무조건 200 성공 코드 보냄
    // 응답.status(400).send({ message : '실패했습니다.' }); // 무조건 400 에러 코드 보냄
    console.log('삭제완료');
  });
});

app.get('/detail/:id', function(요청, 응답){
    db.collection('post').findOne({ _id : parseInt(요청.params.id) }, function(에러, 결과){
        console.log(결과);
        응답.render('detail.ejs', { data : 결과 });
        // if(응답.status(200)){return console.log("성공")};
        if(결과==null){return console.log("400 Bad Error가 발생했습니다.")};        
    });    
});