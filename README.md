## 💻 About this project
- IDE : VSCode  
- Front-end : **Node.js**  
- Back-end : NoSQL, **MongoDB**  
- Framework : express, Bootstrap5.0.2
- Middleware : bodyParser  
- View engine : ejs

---

# 📖 About Todo Application?
- 프로젝트명 : todoApplication
- 기간 : 2023.07.23 ~
- 인원 : 1명
- OS : MacOS
- 주요기술 : Node.js, MongoDB
- View Engine : EJS
- 사용 라이브러리 : Socket.io, express, body-parser, method-Override, passport, passport-local, express-session, dotenv, multer
  
---

# 👩🏻‍💻 My role❓

# used skill
<img src="https://img.shields.io/badge/스킬입력-색상입력?style=for-the-badge&logo=스킬입력&logoColor=white"/>

<div align="center">  
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"/>
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
