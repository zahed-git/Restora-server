const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// ---middle ware
app.use(
  cors({
    origin:["http://localhost:5173"],
    // "https://fire-base-64c1c.web.app",
    // "https://fire-base-64c1c.firebaseapp.com"],
    credentials:true,
  })
  )
app.use(express.json())

// ---------from mongodb


const uri = `mongodb+srv://${process.env.assig_11user}:${process.env.assig_11pass}@cluster0.mhxjfos.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const collectionOfLocation = client.db('Restura').collection('foods')
    const collectionOfUser = client.db('Restura').collection('user')

    app.get('/places', async (req, res) => {
      const cursor = collectionOfLocation.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    // ---two-operation-for--update-operation
    // ---1---first get data by spacific Id
    app.get('/places/:_id', async (req, res) => {
      const id = req.params._id;
      const query = { _id: new ObjectId(id) };
      const result = await collectionOfLocation.findOne(query);
      res.send(result)
    })
    // -----2------then put data for update
    app.put('/places/:_id', async (req, res) => {
      const id = req.params._id;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true }
      const updateLocation = req.body;
      const location = {
        $set: {
          image: updateLocation.image,
          tourists_spot_name: updateLocation.tourists_spot_name,
          country_Name: updateLocation.country_Name,
          location: updateLocation.location,
          description: updateLocation.description,
          averageCost: updateLocation.averageCost,
          seasonality: updateLocation.seasonality,
          travel_Time: updateLocation.travel_Time,
          total_Visitors_Per_Year: updateLocation.total_Visitors_Per_Year,
        }
      }
      const result = await collectionOfLocation.updateOne(filter, location, option)
      res.send(result)
    })
    // ---------------------------

    app.post('/places', async (req, res) => {
      const newPlace = req.body;
      const result = await collectionOfLocation.insertOne(newPlace)
      console.log(newPlace)
      console.log(`A document was inserted with the _id: ${result.insertedId}`)
      res.send(result)
    })
    app.delete('/places/:_id', async (req, res) => {
      const id = req.params._id;
      const query = { _id: new ObjectId(id) };
      const result = await collectionOfLocation.deleteOne(query);
      res.send(result)
    })


    // ------------for user
    // ---user get
    app.get('/user', async (req, res) => {
      const cursor = collectionOfUser.find();
      const users = await cursor.toArray();
      res.send(users);
  })

    // -----------sign-Up
    app.post('/user', async (req, res) => {
      const newUser = req.body;
      const result = await collectionOfUser.insertOne(newUser)
      console.log(newUser)
      console.log(`A document was inserted with the _id: ${result.insertedId}`)
      res.send(result)
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

  // ---------------user delet
  app.delete('/user/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await collectionOfUser.deleteOne(query);
    res.send(result);
})

    // ------------------------------

   

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
