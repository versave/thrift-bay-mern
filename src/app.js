const path = require('path');
const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const productRouter = require('./routers/product');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(productRouter);

app.use(express.static(path.join(__dirname, '../client/build')));
 
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// if(process.env.NODE_ENV === 'production') {
//     app.use(express.static('../client/build'));

//     app.get('*', (res, req) => {
//         res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
//     });
// }

module.exports = app;