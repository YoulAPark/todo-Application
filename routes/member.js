var router = require('express').Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

router.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: 'id',  // input name 이 id 인 값
    passwordField: 'pw',  // input name 이 pw 인 값
    session: true,  // 로그인 후 세션 저장할건지
}, (input_id, input_pw, done) => {
    db.collection('login').findOne({id: input_id}, (error, user)=>{
        if(error) return done(error);
        if(!user) {
            console.log('로그인실패: 아디없음');
            return done(null, false, {message: '존재하지 않는 아이디'});
        }
        bcrypt.compare(input_pw, user.pw, (error, result)=>{  // 기존 로그인 확인 코드
            try {
                if(result) {
                    console.log('로그인성공');
                    return done(null, user);
                } else {
                    console.log('로그인실패: 비번틀림');
                    return done(null, false, {message: '비번틀림'});
                }
            } catch(error) {
                return done(error);
            }
        })
    })
}));

router.post('/login', passport.authenticate('local', {
    failureRedirect : '/member/loginFail'
    }), (요청, 응답) => {
      응답.send({code:1})
});
  
router.get('/loginFail', (요청, 응답) => {
      응답.send({code:0})
});

router.post('/register', async function(요청, 응답){
    const id = 요청.body.id;
    const nickName = 요청.body.nickName;
    const pw = 요청.body.pw;
    const exId = await db.collection('login').findOne({ id: id });
    const exNickName = await db.collection('login').findOne({ nickName : nickName });
    if (exId) {
        console.log('ID가 이미 존재합니다.');
        응답.send({code : 0});
    } else if (exNickName) {
        console.log('NickName이 이미 존재합니다.');
        응답.send({code : 1});
    } else {
        console.log('중복아니므로 가입이 가능합니다.');
        bcrypt.hash(pw, saltRounds, (에러, hash) => {
            console.log(hash)
            try {
                console.log('bcrpt SUCCESS')
                db.collection('login').insertOne({ id : id, nickName : nickName, pw : hash }, (에러, 결과) => {
                    응답.send({code : 2})
                });
            } catch {
                console.log('bcrypt ERROR : '+에러)
            }
        });        
    }
});

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.collection('login').findOne({id: id}, (error, result)=>{
        done(error, result);
    })
});

module.exports = router;