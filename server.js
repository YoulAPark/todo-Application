const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;

/* [method-Override]
설치방식 : npm install method-override | 종류 : Library | 용도 : ejs form 태그에서 put, delete가 되도록 해준다*/
const methodOverride = require('method-override');
app.use(methodOverride('_method')); 

// [로그인준비]
/* [passport] [passport-local] [express-session]
설치방식 : npm install passport passport-local express-session | 종류 : Library | 용도 : Session 로그인 기능 구현*/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
// Middleware?
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());



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

app.get('/edit/:id', function(요청, 응답) {
  db.collection('post').findOne({ _id : parseInt(요청.params.id) }, function(에러, 결과){
    console.log(결과);
    응답.render('edit.ejs', { data : 결과 });
    if(결과==null){return console.log("400 Bad Error가 발생했습니다.")};        
  }); 
});

app.put('/edit', function(요청, 응답){
    // 폼에 담긴 제목, 날짜 데이터를 가지고
    // db.collection에다가 update 함
  db.collection('post').updateOne( {_id : parseInt(요청.body.id)}, { $set : { 제목 : 요청.body.title, 날짜 : 요청.body.date } }, function(에러, 결과){
      console.log('수정완료');
      응답.redirect('/list');
  });
});

app.post('/login', function(요청, 응답){
  // (회원인증기능 1) 로그인 페이지 만들기 & 아이디 비번 검사 07:37 
});