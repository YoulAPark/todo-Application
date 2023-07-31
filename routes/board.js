var router = require('express').Router();

function 로그인했니(요청, 응답, next){ //요청.user가 있을 경우 next를 실행해라
  if (요청.user) {
    next()
  } else {
    응답.send('로그인 안하셨는데요?')
  }
}

// 하나의 URL에 적용할 미들웨어 적용법 (1)
router.use('/sports', 로그인했니);

// 하나의 URL에 적용할 미들웨어 적용법 (2)
router.get('/sports', 로그인했니, function(요청, 응답){
    응답.send('스포츠 게시판');
  });
router.use('/shirts', 로그인했니);
  
router.get('/game', function(요청, 응답){
    응답.send('게임 게시판');
});

module.exports = router;