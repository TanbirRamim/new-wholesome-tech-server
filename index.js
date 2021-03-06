const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zug5c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("wholeSomeTech").collection("product");

    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    app.get("/cardDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await productCollection.findOne(query);

      res.send({ item });
    });

    //POST
    app.post("/product", async (req, res) => {
      const newItem = req.body;
      const output = await productCollection.insertOne(newItem);
      res.send(output);
    });

    //UPDATE
    app.put("/cardDetails/:id", async (req, res) => {
      const id = req.params.id;
      const updatedQuantity = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedNumber = {
        $set: {
          quantity: updatedQuantity.quantity,
        },
      };
      const output = await productCollection.updateOne(
        filter,
        updatedNumber,
        options
      );
      res.send(output);
    });

    //DELETE
    app.delete("/cardDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const output = await productCollection.deleteOne(query);
      res.send(output);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my Wholesome server");
});

app.get("/hero", (req, res) => {
  res.send("Hero meets the real hero");
});

app.listen(port, () => {
  console.log("Wholesome tech is running", port);
});
