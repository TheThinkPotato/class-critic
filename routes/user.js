const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = process.env.APIKEY;

const MongoClient = require("mongodb").MongoClient;
const mongoSrv = "mongodb://localhost:27017";
const DBname = "class_critic";
const collectionName = "user";

const authCheck = require("../functions/authCheck");
const saltRounds = 10;

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required",
    });
  }

  data = await getUserData(email);
  hash = data.password;
  if (!hash) {
    res.status(401).json({
      error: true,
      message: "Incorrect email or password",
    });
  }

  if (!bcrypt.compareSync(password, hash)) {
    res.status(401).json({
      error: true,
      message: "Incorrect email or password",
    });
  }
  const expires_in = 60 * 60 * 24;

  const exp = Date.now() + expires_in * 1000;
  const token = jwt.sign({ email, exp }, secretKey);

  res.status(200).json({
    token,
    token_type: "Bearer",
    expires_in,
  });
});

router.post("/register", async (req, res, next) => {
  const { email, password, fName, lName } = req.body;
  if (!email || !password || !fName || !lName) {
    res.status(400).json({
      error: true,
      message: "Bad Request on Register",
    });
    return;
  }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    res.status(400).json({
      error: true,
      message: "Invalid format email address",
    });
    return;
  }

  if (await checkExistingUser(email)) {
    res.status(400).json({ message: "User already exists" });
    return;
  } else {
    hash_password = encryptPassword(password);
    createDataBaseEntry({ email, password: hash_password, fName, lName });
    res.status(200).json({ message: "User created" });
  }
});

router.get("/:email/profile", async (req, res, next) => {
  data = await getUserData(req.params.email);
  if (data !== null) {
    delete data.password;
    if (checkValidToken(req.headers.authorization)) {
      res.status(200).json({ ...data });
    } else {
      res.status(401).json({
        error: true,
        message: "Authorization Error.",
      });
    }
  } else {
    res.status(400).json({ message: "User not found." });
  }
});

async function getUserData(email) {
  const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DBname);
  const collection = db.collection(collectionName);
  const query = { email: email };
  const result = await collection.findOne(query);
  if (result) {
    return result;
  } else {
    return null;
  }

  // const result = await collection
  //   .find(query)
  //   .toArray()
  //   .then((result) => {
  //     return result;
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // client.close();
  // return result;
}

async function checkExistingUser(email) {
  const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DBname);
  const collection = db.collection(collectionName);
  const query = { email: email };
  const result = await collection.findOne(query);
  return (result !== null) ? true : false;
}

function checkValidToken(auth) {  
  if (auth) {
    const token = auth.split(" ")[1];
    try {
      const payload = jwt.verify(token, secretKey);
      userEmail = payload["email"];
    } catch (ex) {
      console.log(ex.message);
    }
    return authCheck.check(auth).error ? false : true;
  }
}

function createDataBaseEntry(newEntry) {
  MongoClient.connect(mongoSrv, function (err, db) {
    if (err) throw err;
    {
      const dbo = db.db(DBname);
      dbo.collection(collectionName).insertOne(newEntry, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    }
  });
}

function encryptPassword(password) {
  password = bcrypt.hashSync(password, saltRounds);
  return password;
}

module.exports = router;
