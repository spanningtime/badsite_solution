const  fs = require('fs'),
       data = fs.readFileSync('test_feed.json', 'utf8'),
       dataContent = JSON.parse(data),
       bodyparser = require('body-parser'),
       express = require('express');


const app = express();

const server = app.listen(3000,listening);

function listening() {
    console.log("listening...");
}

app.use(express.static('./public/'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.get('/all', function(req, res) {
    res.send(dataContent);
});