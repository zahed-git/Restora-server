const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// ---middle ware
app.use( cors (
  {
  origin:["http://localhost:5173"],
  credentials:true
}
))
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
    // await client.connect();
    const collectionOfUser = client.db('ResturaDB').collection('user')
    const collectionOfFoods = client.db('ResturaDB').collection('foods')


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



// -----------for Foods
app.get('/foods', async (req, res) => {
  const cursor = collectionOfFoods.find()
  const result = await cursor.toArray()
  res.send(result)
})
// ---two-operation-for--update-operation
// ---1---first get data by spacific Id
app.get('/foods/:_id', async (req, res) => {
  const id = req.params._id;
  const query = { _id: new ObjectId(id) };
  const result = await collectionOfFoods.findOne(query);
  res.send(result)
})
// // -----2------then put data for update
app.put('/foods/:_id', async (req, res) => {
  const id = req.params._id;
  const filter = {_id: new ObjectId(id)}
  const option = { upsert: true }
  const updateFoods = req.body;
  const Food = {
    $set: {
      food_name: updateFoods.food_name,
      pickup_location:updateFoods.pickup_location,
      quantity:updateFoods.quantity,
      image:updateFoods.image,
      price:updateFoods.price,
      expired_datetime:updateFoods.expired_datetime,
      additional_notes:updateFoods.additional_notes,
      food_imag:updateFoods.food_imag,
      donator_name:updateFoods.donator_name
    }
  }
  const result = await collectionOfFoods.updateOne(filter, Food, option)
  res.send(result)
})
// ---------------------------

app.post('/foods', async (req, res) => {
  const newFood = req.body;
  const result = await collectionOfFoods.insertOne(newFood)
  console.log(newFood)
  console.log(`A document was inserted with the _id: ${result.insertedId}`)
  res.send(result)
})
// app.delete('/foods/:_id', async (req, res) => {
//   const id = req.params._id;
//   const query = { _id: new ObjectId(id) };
//   const result = await collectionOfFoods.deleteOne(query);
//   res.send(result)
// })



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
