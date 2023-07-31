var router = require('express').Router(); // npm에서 다운로드한 express의 Router()함수를 router라고 하겠습니다.

function 로그인했니(요청, 응답, next){ //요청.user가 있을 경우 next를 실행해라
    if (요청.user) {
      next()
    } else {
      응답.send('로그인 안하셨는데요?')
    }
  }

// 여기에 있는 모든 URL에 적용할 미들웨어
router.use(로그인했니);

router.get('/shirts', function(요청, 응답){
    응답.send('셔츠 파는 페이지입니다.');
});
  
router.get('/pants', function(요청, 응답){
    응답.send('바지 파는 페이지입니다.');
});

module.exports = router; // js파일을 다른 파일에서 갖다 쓰고 싶을 때 => moudule.exports = 내보낼 변수명