const express = require('express');
const app = express();


app.use(express.static('<path to the built Angular app>'));

app.listen(3000, () => {
        console.log('Web server app listening on port 3000!'); });