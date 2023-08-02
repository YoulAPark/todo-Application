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
  
/* [multer]
설치방식 : npm install multer | 종류 : Library | 용도 : multipart 데이터를 쉽게 처리할 수 있도록 도와줌 / 파일전송 쉽게쉽게 파일명 저장시키고 분석하는 라이브러리
*/
let multer = require('multer');
var storage = multer.diskStorage({
  destination : function(req, file, cb){
    cb(null, './public/image') // 이미지 저장하는 폴더 지정
  },
  filename : function(req, file, cb){
    cb(null, file.originalname) // 폴더에 저장시 파일명 지정 / originalname : 기존 파일명 그대로
  },
  fileFilter: function (req, file, callback) { // File 확장자 거르기
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return callback(new Error('PNG, JPG만 업로드하세요'))
    }
    callback(null, true)
},
limits:{
    fileSize: 1024 * 1024
}
}); // diskStorage : 일반 하드 내 저장 / memoryStorage : RAM에 저장(휘발성있음)
var upload = multer({storage : storage}); // => 미들웨어처럼 실행하면 된다.



var db;
const { ObjectId } = require('mongodb'); // ObjectId 사용하고 싶을 때
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

app.get('/join', function(요청, 응답) {
  응답.render('join.ejs');
})

app.get('/upload', function(요청, 응답) {
  응답.render('upload.ejs');
})

// Single-File Upload
app.post('/upload', upload.single('profile'), function(요청, 응답){// upload.single('name에 적힌 명')
  응답.send('업로드완료')
}); 

// 다중 파일 업로드 => upload.array('변수명', 한번에 다운받을 자료의 개수)
// app.post('/upload', upload.array('profile', 10), function(요청, 응답){// upload.single('name에 적힌 명')
//   응답.send('업로드완료')
// }); 

// 이미지 가져올 수 있는 경로 => <img src = "/image/music.jpg"> 
app.get('/image/:imageName', function(요청, 응답){
  응답.sendFile( __dirname + '/public/image/' + 요청.params.imageName); // __dirname 현 파일의 경로 server.js
});

app.get('/search', (요청, 응답)=>{
  //db.collection('post').find({ $text : { $search : 요청.query.value } }).toArray((에러, 결과)=>{
  // 해당 부분은 mongoDB에서 Search Index를 적용하는 방법임 => '글쓰기이지만' 이라고 입력해야 검색이 되는 부분에 대한 처리
  var 검색조건 = [
    {
      $search: {
        index: 'titleSearch',
        text: {
          query: 요청.query.value,
          path: '제목'  // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
        }
      }
    },
    // { $project : { 제목 : 1, _id : 1, score : { $meta : "searchScore" } } }, $meta : 검색이 얼마나 일치하는지 score라는 숫자로 나타내준다.
    { $sort : { _id : 1 } }, // _id를 기준으로 1 : 오름차순 // -1 : 내림차순
    { $limit : 10 } // 최대 몇 개 까지 조회할 것인지
]
    db.collection('post').aggregate(검색조건).toArray((에러, 결과)=>{
    console.log(결과)
    응답.render('search.ejs', {posts : 결과})
  })
});

// indexing 처리 - mongoDB에서 indexing 진행 후 사용
// { $text : ; { $search : 요청.query.value } }

app.get('/list', function(요청, 응답) {
  db.collection('post').find().toArray(function(에러, 결과) { // 전체 가져오기
    //console.log(결과);
    응답.render('list.ejs', { posts : 결과 });
  });
}); 

app.get('/detail/:id', function(요청, 응답){
    db.collection('post').findOne({ _id : parseInt(요청.params.id) }, function(에러, 결과){
        console.log("!! : "+결과);
        응답.render('detail.ejs', { data : 결과 });
        // if(응답.status(200)){return console.log("성공")};
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

// 회원가입
/*
    회원가입 진행 전 아이디가 이미 있는지 찾아봐야함
    Id에 알파벳+숫자만 잘들어있나?
    비번 저장 전에 암호화했는지?
*/
app.post('/register', function(요청, 응답){
  db.collection('login').insertOne( { id : 요청.body.id, pw : 요청.body.pw }, function(에러, 결과) {
    응답.redirect('/');
  })
});

// '/add' 라는 링크로 접속했을 때
app.post('/add', function(요청, 응답) {
  console.log(요청.user._id)
  // 응답.send('전송완료');
  // counter라는 collection에서 name이 'boardCnt'인 데이터 하나를 찾아주세요 [findOne]
  db.collection('counter').findOne({name : 'boardCnt'}, function(에러, 결과){
    // 결과.totalPost
    //console.log("결과 확인 : "+결과.totalPost);
    // 총개시물갯수라는 변수로 지정함
    var 총개시물갯수 = 결과.totalPost;
    var 저장할거 = { _id: 총개시물갯수 + 1, 작성자: 요청.user._id , 제목: 요청.body.title, 날짜: 요청.body.date }
    // write에서 무엇인가를 작성했을 때 실행되는 함수 [insertOne]
    db.collection('post').insertOne( 저장할거, function() {
      console.log('저장완료');
      // insert를 진행했을 때 totalPost를 1 increment 시켜줘야하므로 해당 updateOne 함수를 실행시킨다 [updateOne]
      db.collection('counter').updateOne({name : 'boardCnt'},{ $inc : {totalPost:1} },function(에러, 결과){
        if(에러){return console.log(에러)} // 에러문 잡고자 할 떄
      });
    }); 
  }); 
  응답.redirect('/list');
});
 
app.delete('/delete', function(요청, 응답){
  요청.body._id = parseInt(요청.body._id); // 문자열로 치환되는 body._id를 숫자로 치환해주는 것
  var 삭제할데이터 = { _id : 요청.body._id, 작성자 : 요청.user._id }
  db.collection('post').deleteOne( 삭제할데이터, function(에러, 결과) {
    console.log('삭제완료');
    if (에러) {console.log(에러)}
    //if (결과) {console.log(결과)}
    응답.status(200).send({ message : '성공했습니다.' }); // 무조건 200 성공 코드 보냄
    // 응답.status(400).send({ message : '실패했습니다.' }); // 무조건 400 에러 코드 보냄
  });
});

app.get('/edit/:id', function(요청, 응답) {
  var 수정할데이터 = { _id : parseInt(요청.params.id), 작성자 : 요청.user._id }
  db.collection('post').findOne(수정할데이터,function(에러, 결과){
    응답.render('edit.ejs', { data : 결과 });
    if(결과==null){return console.log("400 Bad Error가 발생했습니다.")};        
  }); 
});

app.use('/shop', require('./routes/shop.js')); 
app.use('/board/sub', require('./routes/board.js'));

// 채팅
app.post('/chatroom', 로그인했니, function(요청, 응답) {
  var 저장할거 = {
    member : [ObjectId(요청.body.당한사람id), 요청.user._id] ,
    date : new Date(),
    title : '에라잇'
  }
  db.collection('chatroom').insertOne( 저장할거, function(에러, 결과){
  });
});

app.get('/chat', 로그인했니, function(요청, 응답){
  db.collection('chatroom').find({ member : 요청.user._id }).toArray().then((결과)=>{
    console.log(결과);
    응답.render('chat.ejs', {data : 결과})
  });
});

app.post('/message', 로그인했니, function(요청, 응답) {
  var 저장할거 = {
    parent : 요청.body.parent ,
    content : 요청.body.content ,
    userId : 요청.user._id,
    date : new Date()
  }
  db.collection('message').insertOne(저장할거).then(()=>{
    console.log('DB저장성공');
    응답.send('DB저장성공')
  });
});
