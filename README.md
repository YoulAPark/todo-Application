## 💻 About this project
- IDE : VSCode  
- Front-end : **Node.js**  
- Back-end : NoSQL, **MongoDB**  
- Framework : express, Bootstrap5.0.2
- Middleware : bodyParser  
- View engine : ejs  

## 💻 server run
```nodemon server.js```

## 📚 Modules Used
#### express
```js
const express = require('express');
```

#### body-parser
```js
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({extended : true}));
```

#### ejs
```js
app.set('view engine', 'ejs');
```

## 💿 DB
#### MongoDB
```js
const MongoClient = require('mongodb').MongoClient;
```
