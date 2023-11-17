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

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
// Connect to mongoose
mongoose.connect(uri);

// Schema/Model:-
const Articles = mongoose.model('Articles', {
    title: String,
    content: String
});

// will return a json object ==> Which is the Get request
// console.log(await Articles.find().exec());

// GET Request:
app.get('/articles', async (req, res) => {
    if ((await Articles.find().exec()).length == 0) {
        res.send("No data to show or there's an error occured");
    } else {
        res.sendFile(__dirname + '/index.html');
    }

});

// POST Request:
app.post('/articles', async (req, res) => {
    try {
        const theTitle = req.body.title;
        const theCont = req.body.content;

        if (postMethodAsSave(theTitle, theCont)) {
            // => True
            // Create a new article using the Mongoose model
            const newArticle = new Articles({
                title: theTitle,
                content: theCont
            });
            await newArticle.save();
            res.status(200).send('Article added successfully');

        } else {
            res.status(500).send('Error processing the request');
        }

    } catch (error) {
        console.error(error);
    }
});

function postMethodAsSave(title, content) {

    if (!title || !content || title.length === 0 || content.length === 0) {
        console.log("Values are null");
        return false;
    } else {
        console.log("Values aren't null");
        return true;
    }
}


app.listen(port, () => {
    console.log('app started listening');
});