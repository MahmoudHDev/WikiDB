import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Properties
const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const uri = 'mongodb://127.0.0.1:27017/WikiDB';


// Methods

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

mongoose.connect(uri);

const Articles = mongoose.model('Articles', {
    title: String,
    content: String
});

const newArticle = new Articles({
    title: 'Zildjian',
    content:''
});

// Articles.save().then(() => console.log('saved!'));




app.get('/', (req, res) => {
    // res.render(__dirname + '/views/home.ejs');
    res.send('Hello World');
});

app.listen(port, () => {
    console.log('app started listening');
});