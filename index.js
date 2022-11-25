const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();

// app using
app.use(cors())
app.use(express.json());

// mongo database
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@cluster0.ygyoxnw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// mongo operations

const runMongoOperation = async () => {
    try {
        const userCollections = client.db("laptopCollections").collection("users")

        app.post("/users", async (req, res) => {
            const users = req.body
            const result = await userCollections.insertOne(users)
            res.send(result)
        })

        app.get("/users/admin/:email", async (req, res) => {
            const email = req.params.email
            const query = { email }
            const user = await userCollections.findOne(query)
            res.send({ isAdmin: user?.role === 'admin' })
        })

        // getting all users
        app.get("/users/buyers", async (req, res) => {
            const query = {role:"buyer"}
            const result = await userCollections.find(query).toArray()
            console.log(result)
            res.send(result)
        })
    }
    finally {

    }
}
runMongoOperation().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send('Hello World!');

})

app.listen(5000, () => {
    console.log('listening on port 5000');
})