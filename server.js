const express = require('express');
const app = express();

app.listen(8080, function(){
    console.log('listening on 8080')
});

// XX 경로로 들어오면 XX로 보내준다.
// 누군가가 /pet으로 방문하면 pet과 관련된 안내문을 띄워주자

app.get('/pet', function(요청, 응답) {
    응답.send('펫용품 쇼핑을 할 수 있는 사이트입니다.');
});

app.get('/beauty', function(요청, 응답) {
    응답.send('뷰티용품 쇼핑을 할 수 있는 사이트입니다.');
});

// 서버 재실행할 수 있는 스크립트
// npm install -g nodemon
// 여기서 -g는 다른 폴더에서도 nodemon이 작동될 수 있게 해달라
