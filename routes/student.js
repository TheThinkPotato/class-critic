const express = require("express");
const router = express.Router();

const authCheck = require("../functions/authCheck");
const dbTools = require("../functions/dbTools");
const classCritic = require("../functions/class_critic");

const collectionName = "student";

// Get all students
router.get("/", async (req, res, next) => {
  data = await dbTools.getData(collectionName);
  res.status(200).json({ ...data });
});

// Search for a student
router.get("/search/", async (req, res, next) => {
  const name = req.query.lookupName;
  const data = await dbTools.getFirstData({ lookupName: name }, collectionName);
  res.status(200).json({ ...data });
});

// Add a student
router.post("/add-student", async (req, res, next) => {
  if (!authCheck.checkValidToken(req.headers.authorization)) {
    res.status(401).json({ error: true, message: "Authorization Error." });
    return;
  }
  const { fName, lName, uni } = req.body;
  lookupName = fName + " " + lName + " " + uni;
  if (await dbTools.checkDBEntry({ lookupName: lookupName }, collectionName))
    res.status(400).json({ error: true, message: "Student already exists." });
  else {
    dbTools.createDataBaseEntry(
      { lookupName, fName, lName, uni },
      collectionName
    );
    res.status(200).json({ error: false, message: `added ${lookupName}` });
  }
});

// Add a rating to a student
router.get("/add-rating", async (req, res, next) => {
  if (!authCheck.checkValidToken(req.headers.authorization))
    return res
      .status(401)
      .json({ error: true, message: "Authorization Error." });

  const {
    owner,
    student,
    communication,
    attendance,
    workmanship,
    focus,
    organization,
    niceness,
  } = req.query;

  if (!(await dbTools.checkDBEntry({ lookupName: student }, collectionName))) {
    res.status(400).json({ error: true, message: "Student does not exist." });
  } else {
    if (
      (await dbTools.checkInArray(
        { lookupName: student },
        { "ratings.owner": owner },
        "$ratings",
        collectionName
      )) > 0
    ) {
      res
        .status(400)
        .json({ error: true, message: "You have already rated this student." });
    } else {
      dbTools.appendArray(
        { lookupName: student },
        {
          ratings: {
            owner,
            student,
            communication,
            attendance,
            workmanship,
            focus,
            organization,
            niceness,
          },
        },
        collectionName
      );
      res.status(200).json({ error: false, message: "added rating" });
    }
  }
});

//Get rating from a student
router.get("/get-rating", async (req, res, next) => {
  const { student } = req.query;
  if (!(await dbTools.checkDBEntry({ lookupName: student }, collectionName))) {
    res.status(400).json({ error: true, message: "Student does not exist." });
  } else {
    const data = await dbTools.getScores(
      { lookupName: student },
      collectionName
    );    
    if (data.length === 0) {
      res.status(400).json({ error: true, message: "No ratings found." });
      return;
    }

    const result = classCritic.calculateScores(data);

    res.status(200).json({ ...result });
  }
});

module.exports = router;
