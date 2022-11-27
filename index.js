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
        const productCollections = client.db("laptopCollections").collection("products")
        const categoryCollections = client.db("laptopCollections").collection("category")
        const ordersCollections = client.db("laptopCollections").collection("orders")

        app.get("/myorders/:email", async (req, res) => {
            const email = req.params?.email
            const query = { buyerEmail:email }
            const result = await ordersCollections.find(query).toArray()
            console.log(result)
            res.send(result)
        })

        app.put("/productCollections/:id", async (req, res) => {
            const id = req.params.id
            const options = { upsert: true }
            const query = { _id: ObjectId(id) }
            const advertised = req.body
            const updatedDoc = {
                $set: advertised
            }
            const result = await productCollections.updateOne(query, updatedDoc, options)
            res.send(result)
        })
        app.get("/products", async (req, res) => {
            const query = {}
            const result = await productCollections.find(query).toArray()
            res.send(result)
        })
        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productCollections.deleteOne(query)
            res.send(result)
        })
        app.post("/users", async (req, res) => {
            const users = req.body
            const result = await userCollections.insertOne(users)
            res.send(result)
        })
        app.post("/orders", async (req, res) => {
            const orders = req.body
            const result = await ordersCollections.insertOne(orders)
            res.send(result)
        })
        // get categories
        app.get("/categories", async (req, res) => {
            const query = {}
            const result = await categoryCollections.find(query).toArray()
            res.send(result)
        })
        app.get("/myproducts/:email", async (req, res) => {
            const email = req.params.email
            const query = { email }
            const result = await productCollections.find(query).toArray()
            res.send(result)
        })
        app.get("/product/:category", async (req, res) => {
            const category = req.params.category
            const query = { category }
            const result = await productCollections.find(query).toArray()
            res.send(result)
        })
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productCollections.findOne(query)
            res.send(result)
        })
        // user role
        app.get("/users/admin/:email", async (req, res) => {
            const email = req.params.email
            const query = { email }
            const user = await userCollections.findOne(query)
            res.send({ isAdmin: user?.role === 'admin' })
        })
        // is seller checking
        app.get("/users/seller/:email", async (req, res) => {
            const email = req.params.email
            const query = { email }
            const user = await userCollections.findOne(query)
            res.send({ isSeller: user?.role === 'seller' })
        })
        app.get("/seller/:email", async (req, res) => {
            const email = req.params.email
            const query = { email }
            const seller = await userCollections.findOne(query)
            res.send(seller)
        })
        // getting all users
        app.get("/users/buyers", async (req, res) => {
            const query = { role: "buyer" }
            const result = await userCollections.find(query).toArray()
            res.send(result)
        })
        app.get("/users/sellers", async (req, res) => {
            const query = { role: "seller" }
            const result = await userCollections.find(query).toArray()
            res.send(result)
        })
        // delete
        app.delete("/user/:email", async (req, res) => {
            const email = req.params.email
            const query = { email }
            const result = await userCollections.deleteOne(query)
            res.send(result)
        })
        // posting data
        app.put("/user/:email", async (req, res) => {
            const email = req.params.email
            const options = { upsert: true }
            const query = { email }
            const verified = req.body
            const updatedDoc = {
                $set: verified
            }
            const result = await userCollections.updateOne(query, updatedDoc, options)
            res.send(result)
        })
        app.put("/verifcation/:email", async (req, res) => {
            const email = req.params.email
            const options = { upsert: true }
            const query = { email }
            const verified = req.body
            const updatedDoc = {
                $set: verified
            }
            const result = await productCollections.updateOne(query, updatedDoc, options)
            res.send(result)
        })

        app.post("/products", async (req, res) => {
            const products = req.body
            const result = await productCollections.insertOne(products)
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