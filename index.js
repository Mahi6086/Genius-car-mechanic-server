const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");

const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;
// C1wsNtsU2Cat3U7x
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cfmbo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// console.log(uri);

client.connect((err) => {
  const collection = client.db("carMechanic").collection("services");

  //   client.close();
});

async function run() {
  try {
    await client.connect();
    console.log("connect to database");
    const database = client.db("carMechanic");
    const servicesCollection = database.collection("services");

    //get api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //GET Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });
    //post api
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the api", service);

      const result = await servicesCollection.insertOne(service);
      console.log(result);

      res.send(result);
    });

    //DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.send(result);
    });

    // create a document to insert
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Genius car mechanics server");
});
app.listen(port, () => {
  console.log("Rurning Genius Server on port:", port);
});
