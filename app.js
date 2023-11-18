import express from 'express';
import bodyParser from 'body-parser';

import mongoose, { Query } from 'mongoose';
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

/////////////////////////////////// Route for all Articles //////////////////////////////////
app.route('/articles')
    .get(async (req, res, next) => {
        // GET
        if ((await Articles.find().exec()).length == 0) {
            res.send("No data to show or there's an error occured");
        } else {
            // res.sendFile(__dirname + '/index.html');
            res.send(await Articles.find().exec());
        };
    })
    .post(async (req, res, next) => {
        // POST
        try {
            const theTitle = req.body.title;
            const theCont = req.body.content;

            if (postMethodAsSave(theTitle, theCont)) {
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
        };
    })
    .delete(async (req, res) => {
        await Articles.deleteMany();
        res.send("Successfully deleted all the documents");
    });

function postMethodAsSave(title, content) {

    if (!title || !content || title.length === 0 || content.length === 0) {
        console.log("Values are null");
        return false;
    } else {
        console.log("Values aren't null");
        return true;
    }
};
/////////////////////////////////// Route for a specific Article //////////////////////////////////
app.route('/articles/:articleTitle')
.get(async (req,res)=>{ 
    // NOTE:- articleTitle is the name of the variable that we will use to access the params the user has been used in the request.
    try {
        // Find the user by ID
        const paramTitle = req.params.articleTitle;
        console.log(paramTitle);
        const articleTitle = await Articles.findOne({title: paramTitle});
        if (!articleTitle) {
            return res.status(404).send('User not found');
        }else{
            res.send(articleTitle);

        }
    } catch (error) {
        res.status(500).send('Error updating user');
    }
})
.put(async (req, res) => {
    // Find by variable
    console.log(req.params.articleTitle);
            // Replace the entire user data with the request body
        // articleTitle.set(req.body); // Assuming req.body contains the entire updated user data
        // await user.save();

})
.patch(async (req, res) => {
    console.log(req.params.articleTitle);
})

// GET Request:
// app.get('/articles', async (req, res) => {

// });

// POST Request:
// app.post('/articles', async (req, res) => {

// });
// DELETE Request:
// app.delete('/articles', async (req, res) => {

// });



app.listen(port, () => {
    console.log('app started listening');
});