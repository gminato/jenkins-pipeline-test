import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const url = 'mongodb://admin:password@mongodb';
const client = new MongoClient(url);
let db;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


console.log(__dirname);
// Serve the 'public' directory as static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up a route for the home page
app.get('/', async (res) => {
    const dogs = await db.collection('dogs').toArray();
    console.log(dogs);
    console.log('getting dogs');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// get dogs with id
app.get('/api/dogs/:id', async (req, res) => {
    console.log(req.params.id);
    const dog = await db.collection('dogs').findOne({id: parseInt(req.params.id)});
    if(dog === null) {
        res.status(404).json({"error": "Dog not found"});
        return;
    }
    res.json(dog);
});

app.post('/dogs/update', async (req, res) => {
    // get form data from html form field 
    // generate unique id for each dog
    console.log(req.body);
    console.log(await db.collection('dogs').findOne({id: req.body.id}));
    const present = await db.collection('dogs').findOne({id: req.body.id});
    console.log(present);
    if(present !== null) { 
        // update the dog with the new data
        console.log('updating dog');
        await db.collection('dogs').updateOne({id: req.body.id}, {$set: {
            name: req.body.name,
            breed: req.body.breed,
            age: req.body.age
        }});
    } else {
        console.log('inserting dog');
        await db.collection('dogs').insertOne(req.body);
    }
    // redirect to home page
    res.redirect('/');

});

async function initMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db('animals');
    } catch (e) {
        console.error(e);
    }
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    initMongo();
    console.log(`Server is running on port ${PORT}`);
});
