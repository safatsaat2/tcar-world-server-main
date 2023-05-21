const express = require('express')
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express()

const port = 5000;

// middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zbaa30j.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const categoryData = client.db('tcar-world').collection('category-data')

        // Category Data routes
        app.get('/category-data', async (req, res) => {
            const cursor = categoryData.find().limit(20)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get(`/category-data/:email`, async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const query = { sellerEmail: email }
            const result = await categoryData.find(query).toArray()
            res.send(result)
        })
        app.get('/categoryData/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await categoryData.findOne(filter);
            res.send(result);
        })
        // 
        app.post('/category-data', async (req, res) => {
            const toy = req.body;
            console.log(toy)
            const result = await categoryData.insertOne(toy);
            res.send(result)
        })

        app.delete('/category-data/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await categoryData.deleteOne(query);
            res.send(result)

        })
        app.patch('/category-data/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updatedToy = req.body;
            const newInfo = {
                $set: {
                    price: updatedToy.price,
                    quantity: updatedToy.quantity,
                    description: updatedToy.description
                }
            }
            const result = await categoryData.updateOne(filter, newInfo)
            res.send(result)

        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('tcar is running')
})

app.listen(port, () => {
    console.log(`tcar port is running on: ${port}`)
})