const express = require("express");
const router = express.Router();

const authCheck = require("../functions/authCheck");
const dbTools = require("../functions/dbTools");

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
  if (authCheck.checkValidToken(req.headers.authorization)) {
    const { fName, lName, uni } = req.body;
    lookupName = fName + " " + lName + " " + uni;
    const totalRating = 5;
    if (
      !(await dbTools.checkDBEntry({ lookupName: lookupName }, collectionName))
    ) {
      dbTools.createDataBaseEntry(
        { lookupName, fName, lName, uni, totalRating },
        collectionName
      );
      res.status(200).json({ error: false, message: `added ${lookupName}` });
    } else {
      res.status(400).json({ error: true, message: "Student already exists." });
    }
  } else {
    res.status(401).json({ error: true, message: "Authorization Error." });
  }
});

router.get("/add-rating", async (req, res, next) => {
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
    if (await dbTools.checkInArray({ "ratings.owner": owner }, "$ratings", collectionName) > 0) {
      res
        .status(400)
        .json({ error: true, message: "You have already rated this student." });
    } else {
      dbTools.appendArray({lookupName: student}, {ratings:{owner,student ,communication, attendance, workmanship, focus, organization, niceness}},collectionName);
      res.status(200).json({ error: false, message: "added rating" });
    }
  }
});

module.exports = router;
