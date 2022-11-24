const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express();

// app using
app.use(cors())
app.use(express.json());

// mongo database
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@cluster0.ygyoxnw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// mongo operations

const runMongoOperation = async () =>{
    try{
        const userCollections = client.db("laptopCollections").collection("users")

        app.post("/users",(req, res) =>{
            const users = req.body
            console.log(users)
        })
    }
    finally{}
}
runMongoOperation().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send('Hello World!');

})

app.listen(5000, ()=>{
    console.log('listening on port 5000');
})