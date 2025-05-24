const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000
const app = express()

// Middle ware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://Book-nest:Ad4kAJcRKfcYCNMo@cluster0.y8uksmr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const booksCollection = client.db('Book-nest').collection('books')

        app.get('/books', async (req, res) => {
            const result = await booksCollection.find().toArray();
            res.send(result)
        })

        // get single books data 
        app.get('/books/:id', async (req, res)=>{
            const id = req.params.id 
            const query = {_id: new ObjectId(id)}
            const result = await booksCollection.findOne(query)
            res.send(result)
        })

        app.post('/addBook', async (req, res) => {
            try {
                const data = req.body;
                const result = await booksCollection.insertOne(data);
                res.send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send({ message: 'Failed to add book', error });
            }
        });

        // update data of single books
        app.patch('/updateData/:id', async(req, res)=>{
            const id = req.params.id 
            const updateData = req.body 
            
            const query = {_id: new ObjectId(id)}

            const update = {
                $set:{
                    "title" : updateData.title, 
                    "author": updateData.author, 
                    "genre": updateData.genre, 
                    'description' : updateData.description, 
                    'publishYear': updateData.publishYear, 
                    'price': updateData.price, 
                    'rating': updateData.rating, 
                    'stock': updateData.stock, 
                    'coverImage': updateData.coverImage
                }
            }
            const result = await booksCollection.updateOne(query, update)
            res.send(result)
        })

        // delete single data 
        app.delete('/books/:id', (req, res)=>{
            const id = req.params.id 
            const query = {_id: new ObjectId(id)}
            const result = booksCollection.deleteOne(query)
            res.send(result)
        })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('BookNest server is running')
})

app.listen(port, () => {
    console.log('BookNest Server is running on port', port)
})