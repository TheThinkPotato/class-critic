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

// Log In Route
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

function inputCheck(body) {
  result = { error: false, message: "ok.", code: 200 };

  if (!body.email || !body.password || !body.fName || !body.lName) {
    result = {
      error: true,
      message: "Request body incomplete, all fields are required",
      code: 400,
    };
  }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(body.email)) {
    result = {
      error: true,
      message: "Invalid email address",
      code: 400,
    };
  }
  return result;
}

// Register Route
router.post("/register", async (req, res, next) => {
  const { email, password, fName, lName } = req.body;  
  if (inputCheck(req.body).error) {
    res.status(result.code).json({
      error: true,
      message: result.message,
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

// Get User Data Route
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

// Update Route
router.put("/:email/profile", async (req, res, next) => {
  email = req.params.email;
  fName = req.body.fName;
  lName = req.body.lName;
  password = req.body.password;

  if (checkValidToken(req.headers.authorization)) {
    if (true) {
      const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
      const hash = encryptPassword(password);

      // update the user's data
      await client.connect();
      const db = client.db(DBname);
      const collection = db.collection(collectionName);
      const query = { email: email };
      const newValues = {
        $set: { fName: fName, lName: lName, password: hash },
      };
      const result = await collection
        .updateOne(query, newValues)
        .then((result) => {
          res.status(200).json({ message: "User updated" });
        });
    }
  } else {
    res.status(401).json({
      error: true,
      message: "Authorization Error.",
    });
  }
});



// Get User Data from DB
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

// Check if user already exists
async function checkExistingUser(email) {
  const client = new MongoClient(mongoSrv, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(DBname);
  const collection = db.collection(collectionName);
  const query = { email: email };
  const result = await collection.findOne(query);
  return result !== null ? true : false;
}

// Check if token is valid
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

//create new entry in DB.
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

// Encrypt Password
function encryptPassword(password) {
  password = bcrypt.hashSync(password, saltRounds);
  return password;
}

module.exports = router;
