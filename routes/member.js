var router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/join', function(요청, 응답) {
    응답.render('join.ejs');
});

router.get('/login', function(요청, 응답){
    응답.render('login.ejs');
})

router.get('/myPage', (요청, 응답) => {
    응답.render('mypage.ejs', {사용자 : 요청.user});
});


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
        console.log(id + ' 님의 가입완료');
        bcrypt.hash(pw, saltRounds, (에러, hash) => {
            try {
                db.collection('login').insertOne({ id : id, nickName : nickName, pw : hash }, (에러, 결과) => {
                    응답.send({code : 2})
                });
            } catch {
                console.log('bcrypt ERROR : '+에러)
            }
        });        
    }
});

module.exports = router;