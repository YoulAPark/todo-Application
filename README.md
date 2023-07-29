## 💻 About this project
- IDE : VSCode  
- Front-end : **Node.js**  
- Back-end : NoSQL, **MongoDB**  
- Framework : express, Bootstrap5.0.2
- Middleware : bodyParser  
- View engine : ejs  

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



