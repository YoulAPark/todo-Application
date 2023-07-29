const express = require('express');
const app = express();
/* [bodyParser]
설치방식 : npm install body-parser | 종류 : Library | 용도 : post방식으로 보낼 때 데이터들을 쉽게 처리해줌
2021년 이후로는 express에 기본 포함되어있어 따로 설치할 필요도 없음
*/
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({extended : true}));

/*[MongoDB]
설치방식 : npm install mongodb@3.6.4 | 종류 : Library | 용도 : mongoDB 연결을 쉽게해줌
*/
const MongoClient = require('mongodb').MongoClient;

/* [method-Override]
설치방식 : npm install method-override | 종류 : Library | 용도 : ejs form 태그에서 put, delete가 되도록 해준다*/
const methodOverride = require('method-override');
app.use(methodOverride('_method')); 

// [로그인준비]
/* [passport] [passport-local] [express-session]
설치방식 : npm install passport passport-local express-session | 종류 : Library | 용도 : Session 로그인 기능 구현
passport : 로그인할때 유효성검사 기능을 쉽게 구현할 수 있도록 도와준다. */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
// Middleware?
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

/* [ejs]
설치방식 : npm install ejs | 종류 : Template engine | 용도 : HTML에 실제 DB를 넣음 / 서버데이터를 HTML에 쉽게 넣을 수 있는 HTML 렌더링 엔진
*/
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

/* [dotenv]
설치방식 : npm install dotenv | 종류 : Library | 용도 : MongoDB 접속에 필요한 아디,비번이라던지 그런 부분들을 .env파일에 넣고 포트번호로 찾을 수 있게 해주는 라이브러리 
*/
require('dotenv').config();
  
var db;

MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true }, function (에러, client) {
  if (에러) return console.log(에러)
    db = client.db('todoApplication');
    app.listen(process.env.PORT, function () {
      console.log('listening on 8080')
    });
});

app.get('/', function(요청, 응답) {
  응답.render('index.ejs');
});

app.get('/login', function(요청, 응답){
  응답.render('login.ejs');
})

app.get('/write', function(요청, 응답) {
  응답.render('write.ejs');
});

app.get('/search', (요청, 응답)=>{
  console.log(요청.query);
  db.collection('post').find({ $text : { $search : 요청.query.value } }).toArray((에러, 결과)=>{
    console.log(결과)
    응답.render('search.ejs', {posts : 결과})
  })
});

// indexing 처리 - mongoDB에서 indexing 진행 후 사용
// { $text : ; { $search : 요청.query.value } }
// 검색기능 만들기 3 : 네이버같은 검색기능 만들려면 (Search index) : 02:35


// '/add' 라는 링크로 접속했을 때
app.post('/add', function(요청, 응답) {
  // 응답.send('전송완료');
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
  응답.redirect('/list');
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

app.get('/login', function(요청, 응답){
  응답.render('login.ejs');
});

app.post('/login', passport.authenticate('local', {
  failureRedirect : '/fail'
}), function(요청, 응답){
  응답.redirect('/');
});

// app.post('/login') 을 실행하면 실행하게 되는 메서드이다.
passport.use(new LocalStrategy({
  usernameField: 'id',
  passwordField: 'pw',
  session: true,
  passReqToCallback: false,
}, function (입력한아이디, 입력한비번, done) {
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
      if (에러) return done(에러)
      if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
      if (입력한비번 == 결과.pw) {
        return done(null, 결과)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
  })
}));

// session 데이터 만드는법
// session을 저장시키는 코드 (로그인 성공시 발동)
passport.serializeUser(function (user, done) {
  done(null, user.id)
});

//myPage로 들어올경우 로그인했니라는 미들웨어(메서드)를 실행한다
app.get('/myPage', 로그인했니, function(요청, 응답){
  응답.render('myPage.ejs', {사용자 : 요청.user})
});

//미들웨어 만드는법
function 로그인했니(요청, 응답, next){ //요청.user가 있을 경우 next를 실행해라
  if (요청.user) {
    next()
  } else {
    응답.send('로그인 안하셨는데요?')
  }
}

// 세션을 찾을때 실행되는 함수 -> 마이페이지 접속할때라던지
passport.deserializeUser(function (아이디/*user.id*/, done) {
  db.collection('login').findOne( {id : 아이디}, function(에러, 결과) {
    done(null, 결과)
  });
}); 