const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({extended : true}));

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://admin:qwer1234@jennifer.j22z1ok.mongodb.net/?retryWrites=true&w=majority', function() {
    app.listen(8080, function(){
        console.log('listening on 8080')
        // MongoDB 10:27
    });
});


app.get('/write', function(요청, 응답) {
    응답.sendFile(__dirname + '/write.html');
}); 

app.post('/add', function(요청, 응답){
    응답.send('전송완료');
    console.log(요청.body.title);
    console.log(요청.body.date);
    // DB에 저장해주세요
});