var router = require('express').Router();

router.get('/login', function(요청, 응답){
    응답.render('login.ejs');
});

router.get('/join', function(요청, 응답){
    응답.render('join.ejs');
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
        console.log('중복아니므로 가입이 가능합니다.')
        db.collection('login').insertOne({ id : id, nickName : nickName, pw : pw }, (에러, 결과) => {
            응답.send({code : 2})
        });
    }


});

module.exports = router;