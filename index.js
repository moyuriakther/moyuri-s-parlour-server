const express = require("express");
const app = express();
const port = process.env.PORT || 5050;
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
// console.log(process.env.DB_PASS);

// middle wire
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rdx4d.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const verifyJwtToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  console.log(authorization);
  if (!authorization) {
    return res.status(401).send({ message: "UnAuthorized User" });
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error)
      return res.status(403).send({ message: "Forbidden User Access" });
    req.decoded = decoded;
    next();
  });
};

async function run() {
  try {
    await client.connect();
    const serviceCollection = client
      .db(`moyurisParlour`)
      .collection("services");

    app.get("/", async (req, res) => {
      res.send("Welcome To Parlour Server");
    });
    app.get("/services", async (req, res) => {
      const query = {};
      const result = await serviceCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
