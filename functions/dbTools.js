const res = require("express/lib/response");

const MongoClient = require("mongodb").MongoClient;
const mongoSrv = "mongodb://localhost:27017";
const DBname = "class_critic";

//create new entry in DB.
async function createDataBaseEntry(newEntry, collectionName) {
  const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DBname);
  const collection = db.collection(collectionName);
  await collection.insertOne(newEntry);
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
async function getData(query,collectionName) {  
  const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DBname);
  const collection = db.collection(collectionName);
  const result = await collection
    .find(query)
    .sort({ "overallRatings.totalRating": -1 })
    .toArray()    
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
  client.close();
  return result !== null ? {data : result} : { message: "No data found." };
}

// Update Data in DB
async function updateData(query, newValues, collectionName) {
  const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DBname);
  const collection = db.collection(collectionName);
  const result = await collection
    .updateOne(query, { $set: { ...newValues } })
    .then((result) => {
      client.close();
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
  return result !== null ? result : { message: "No data found." };
}

// append to an array in DB
async function appendArray(query, newValues, collectionName) {
  const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DBname);
  const collection = db.collection(collectionName);
  const result = await collection.updateOne(query, { $push: { ...newValues } });
  client.close();
  return result !== null ? result : { message: "No data found." };
}

// check if array contains value and how many times
async function checkInArray(query1, query2, array, collectionName) {
  const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DBname);
  const collection = db.collection(collectionName);
  const result = await collection
    .aggregate([
      { $match: query1 },
      { $unwind: array },
      { $match: query2 },
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0, count: 1 } },
    ])
    .toArray();  
  client.close();
  return result.length > 0 ? result[0].count : false;
}

// gets rating scores from DB
async function getScores(query, collectionName) {
  const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DBname);
  const collection = db.collection(collectionName);
  const result = await collection
    .aggregate([{ $match: query }, { $unwind: "$ratings" }])
    .toArray();
  client.close();  
  return result;
}

module.exports = {
  createDataBaseEntry,
  checkDBEntry,
  getFirstData,
  getData,
  updateData,
  appendArray,
  checkInArray,
  getScores,
};
