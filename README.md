# todo-Application

## 💻 About this project
- IDE : VSCode
- OS : MacOS
- Front-end : **Node.js**  
- Back-end : NoSQL, **MongoDB**  
- Framework/Library : express, Bootstrap5.0.2, Socket.io, bodyParser, method-Override, passport, passport-local, express-session, dotenv, multer
- View engine : ejs
- configuration management tool : git

## 👩🏻‍💻 My role❓
- 회원가입 및 로그인 기능 구현
- 로그인 세션
- Todo와 관련된 게시글 CRUD구현
- 검색기능구현
- Ajax 사용
- 실시간 채팅기능 구현
- 파일업로드(단일 및 다중) 기능 구현
- Google Cloud로 사이트 배포 테스트

# 📖 used Skill 🚀
<div align="center">  
  <div>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"/>
  <img src="https://img.shields.io/badge/express-47A248?style=for-the-badge&logo=express&logoColor=white"/>
  </div>
  
  <div>
    <img src="https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=Passport&logoColor=white"/>
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white"/>
    <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=Bootstrap&logoColor=white"/>
  </div>

  <div>    
    <img src="https://img.shields.io/badge/multer-000000?style=for-the-badge&logo=multer&logoColor=white"/>
    <img src="https://img.shields.io/badge/BodyParser-000000?style=for-the-badge&logo=BodyParser&logoColor=white"/>
    <img src="https://img.shields.io/badge/methodOverride-000000?style=for-the-badge&logo=method_Override&logoColor=white"/>
    <img src="https://img.shields.io/badge/dotenv-000000?style=for-the-badge&logo=dotenv&logoColor=white"/>
  </div> 
</div>

## 💻 server run
```nodemon server.js```

## 💿 DB
#### MongoDB
```js
const MongoClient = require('mongodb').MongoClient;
```

## 💿 Template engine
#### ejs
```js
app.set('view engine', 'ejs');
```

## 📚 Used libraries
#### express
```js
const express = require('express');
```

#### body-parser
```js
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({extended : true}));
```

#### method-Override
```js
const methodOverride = require('method-override');
app.use(methodOverride('_method')); 
```

#### passport
```js
const passport = require('passport');
```

#### passport-local
```js
const LocalStrategy = require('passport-local').Strategy;
```

#### express-session
```js
const session = require('express-session');
```

#### dotenv
```js
require('dotenv').config();
```

### multer
```js
let multer = require('multer');
```
