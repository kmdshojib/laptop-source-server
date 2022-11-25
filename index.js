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

        app.post("/users", async (req, res) => {
            const users = req.body
            const result = await userCollections.insertOne(users)
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
        app.get("/seller/:email",async(req,res)=>{
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
        app.delete("/user/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await userCollections.deleteOne(query)
            res.send(result)
        })
        // posting data
        app.put("/user/:id", async (req, res) => {
            const id = req.params.id
            const options = { upsert: true }
            const query = { _id: ObjectId(id) }
            const verified = req.body
            const updatedDoc = {
                $set: verified
            }
            const result = await userCollections.updateOne(query,updatedDoc,options)
            res.send(result)
        })

        app.post("/products", async (req, res)=>{
            const products = req.body
            const result = await productCollections.insertOne(products)
            res.send(result)
        })

        const catagories = [
            {
                catagoryName: "Business",
                image:"https://i.dell.com/is/image/DellContent//content/dam/ss2/product-images/dell-client-products/notebooks/latitude-notebooks/15-3520/global-spi/ng/notebook-latitude-15-3520-campaign-hero-504x350-ng.psd?fmt=jpg&wid=570&hei=400",
                description: "You will find all the Business category laptops available here."
            },
            {
                catagoryName: "Gaming",
                image:"https://assets2.razerzone.com/images/pnx.assets/e69b14d8b16a77ad61a59359a7275694/new-razer-blade-15-2022-nvidia-mobile.jpg",
                description: "You will find all the Gaming laptops available here."
            },
            {
                catagoryName: "Gaming",
                image:"https://www.apple.com/v/macbook-pro-14-and-16/c/images/meta/macbook-pro-14-and-16_overview__fz0lron5xyuu_og.png",
                description: "You will find all the Apple laptops available here."
            }
        ]
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