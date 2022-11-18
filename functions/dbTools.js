const res = require("express/lib/response");

const MongoClient = require("mongodb").MongoClient;
const mongoSrv = "mongodb://localhost:27017";
const DBname = "class_critic";

//create new entry in DB.
function createDataBaseEntry(newEntry, collection) {
  MongoClient.connect(mongoSrv, function (err, db) {
    if (err) throw err;
    {
      const dbo = db.db(DBname);
      dbo.collection(collection).insertOne(newEntry, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    }
  });
}

// Check if entry already exists
async function checkDBEntry(query, collectionName) {
  const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DBname);
  const collection = db.collection(collectionName);
  const result = await collection.findOne(query);
  return result !== null ? true : false;
}

// Get Data from DB
async function getFirstData(query, collectionName) {
  const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DBname);
  const collection = db.collection(collectionName);
  const result = await collection.findOne(query);
  return result !== null ? result : { message: "No data found." };
}

// Get All Data from DB
async function getData(collectionName) {
  const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DBname);
  const collection = db.collection(collectionName);
  // const result = await collection.findOne(query);
  const result = await collection
    .find({})
    .toArray()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
  client.close();  
  return result !== null ? result : { message: "No data found." };
}

module.exports = { createDataBaseEntry, checkDBEntry, getFirstData, getData };
