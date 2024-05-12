const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// ---middle ware
app.use( cors ())
app.use(express.json())

// ---------from mongodb


const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.mhxjfos.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    const collectionOfUser = client.db('ResturaDB').collection('user')


    // -==--------for user
// ---singUp
    app.post('/user', async (req,res)=>{
      const newUser = req.body;
      console.log(newUser)
      const result = await collectionOfUser.insertOne(newUser);
      console.log(newUser)
      res.send(result)
    })

    // ---user get
    app.get('/user', async (req, res) => {
      const cursor = collectionOfUser.find();
      const users = await cursor.toArray();
      res.send(users);
  })

     // ------?----sign_in and update--------
     app.patch('/user', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email }
      const updateDoc = {
          $set: {
              lastLoggedAt: user.lastLoggedAt
          }
      }
      const result = await collectionOfUser.updateOne(filter, updateDoc);
      res.send(result);
  })

  app.delete('/user/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await collectionOfUser.deleteOne(query);
    res.send(result);
})



// -----------for products


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// -----------------------------


app.get('/', (req, res) => {
  res.send("assigment 11 server is running")
})

app.listen(port, () => {
  console.log(`"server is run runing on port",${port}`)
})
