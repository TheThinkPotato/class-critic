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

// Update Data in DB
async function updateData(query, newValues, collectionName) {
  const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DBname);
  const collection = db.collection(collectionName);
  const result = await collection
    .updateOne(query, { $set: { newValues } })
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
  const result = await collection.updateOne(query, { $push: { newValues } });
  client.close();
  return result !== null ? result : { message: "No data found." };
}

// check if array contains value and how many times
async function checkInArray(query, array, collectionName) {
  const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DBname);
  const collection = db.collection(collectionName);
  const email = "test@testmail.au";
  // const result = await collection.aggregate([ { $unwind: "$ratings" }, { $match: { "ratings": { $exists: true } } }, { $group: { _id: null, count: { $sum: 1 } } } ]).toArray();
  // const result = await collection.aggregate([ { $unwind: "$ratings" }, { $match: { "ratings": { owner: email } } }, { $group: { _id: null, count: { $sum: 1 } } } ]).toArray();
  // const result = await collection.aggregate([ { $unwind: "$ratings" }, { $match: { "ratings.owner": email } }, { $group: { _id: null, count: { $sum: 1 } } },{ $project : { _id:0, count : 1 } } ]).toArray();
  const result = await collection
    .aggregate([
      { $unwind: array },
      { $match: query },
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0, count: 1 } },
    ])
    .toArray();
  client.close();
  return result.length > 0 ? result[0].count : false;
}

// .aggregate([
//   { $match: query },
//   { $unwind: "$ratings" },
//   // get avg of communication
//   { $group: { _id: "$_id", avgCommunication: { $avg: "$ratings.communication" } } },
//   ])
// .toArray();

async function getScores(query, collectionName) {
  const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DBname);
  const collection = db.collection(collectionName);
  const result = await collection
    .aggregate([{ $match: query }, { $unwind: "$ratings" }])
    .toArray();
  client.close();
  console.log(result);
  return result;
}

//     { "$group": {
//          "_id": { "Information": "$_id", "Name": "$details.Name" },
//          "id": { "$avg": "$id" },
//          "AvgValue": { "$avg": "$details.Marks" }
//       }},

// get average of communication from ratings array
// .aggregate([
//       { $match: query },

//       { $unwind: "$ratings" },

//       { $group: {
//          _id: { "Information": "$_id", "Student": "$details.Student" },
//           "AvgCommunication": { "$avg": "$ratings.communication" }

//     } },

//       // { $group: { _id: 0, avgCommunication: { $avg: "$ratings.communication" } } },
//       // { $group: { _id: null, avg: { $avg: "$ratings.communication" } } },
//       // { $project: { _id: 0, avg: 1 } },
// .aggregate([

//       { "$group": {
//          "_id": "$lookupName",
//          "ratings": { "$push": "$ratings" }
//       }},
//       { "$unwind": "$ratings" },
//       { "$unwind": "$ratings" },
//       { "$group": {
//          "_id": { "lookupName": "$lookupName",
//          "communication": "$ratings.communication",
//          "attendance": "$ratings.communication",
//          "workmanship": "$ratings.workmanship",
//          "focus": "$ratings.focus",
//          "organization": "$ratings.organization",
//          "niceness": "$ratings.niceness",
//         },
//         //  "id": { "$avg": "$id" },
//         //  "AvgValue": { "$first": "$ratings.communication" }
//       }},

//     ]).toArray();
//     client.close();
//     // console.log(result);
//     return result;
//   }

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
