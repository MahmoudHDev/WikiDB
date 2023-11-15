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
// Connect to mongoose
mongoose.connect(uri);

// Schema/Model
const Articles = mongoose.model('Articles', {
    title: String,
    content: String
});

// will return a json object ==> Which is the Get request
// console.log(await Articles.find().exec());


app.get('/articles', async (req, res) => {


    if ((await Articles.find().exec()).length == 0) { 
        console.log("No data to show or there's an error occured");
    }else{
        
    res.send(await Articles.find().exec());
    }

    res.send('Hello World');
});

app.listen(port, () => {
    console.log('app started listening');
});