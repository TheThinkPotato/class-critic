const express = require("express");
const router = express.Router();

const authCheck = require("../functions/authCheck");
const dbTools = require("../functions/dbTools");
const classCritic = require("../functions/class_critic");

const collectionName = "student";

// Get all students
router.get("/", async (req, res, next) => {
  data = await dbTools.getData(null, collectionName);
  res.status(200).json({ ...data });
});

// Get a student
router.get("/get-student/", async (req, res, next) => {
  const name = req.query.lookupName;
  const data = await dbTools.getFirstData({ lookupName: name }, collectionName);
  res.status(200).json({ ...data });
});

// Search for students
router.get("/search/", async (req, res, next) => {
  try {
    const regexString = new RegExp(req.query.search, "i");
    const data = await dbTools.getData(
      { lookupName: { $regex: regexString } },
      collectionName
    );
    res.status(200).json({ ...data });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Add a student
router.post("/add-student", async (req, res, next) => {
  if (!authCheck.checkValidToken(req.headers.authorization)) {
    res.status(401).json({ error: true, message: "Authorization Error." });
    return;
  }
  const { fName, lName, gender, uni, major } = req.body;
  lookupName = fName + " " + lName + " " + uni;
  if (await dbTools.checkDBEntry({ lookupName: lookupName }, collectionName))
    res.status(400).json({ error: true, message: "Student already exists." });
  else {
    dbTools.createDataBaseEntry(
      { lookupName, fName, lName, gender, uni, major },
      collectionName
    );
    res.status(200).json({ error: false, message: `added ${lookupName}` });
  }
});

function ratingsCheckOK(
  communication,
  participation,
  qualityOfWork,
  teamWork,
  punctual,
  attitude
) {
  if (
    communication < 0 ||
    communication > 5 ||
    communication === undefined ||
    communication === null ||
    isNaN(communication) ||
    participation < 0 ||
    participation > 5 ||
    participation === undefined ||
    participation === null ||
    isNaN(participation) ||
    qualityOfWork < 0 ||
    qualityOfWork > 5 ||
    qualityOfWork === undefined ||
    qualityOfWork === null ||
    isNaN(qualityOfWork) ||
    teamWork < 0 ||
    teamWork > 5 ||
    teamWork === undefined ||
    teamWork === null ||
    isNaN(teamWork) ||
    punctual < 0 ||
    punctual > 5 ||
    punctual === undefined ||
    punctual === null ||
    isNaN(punctual) ||
    attitude < 0 ||
    attitude > 5 ||
    attitude === undefined ||
    attitude === null ||
    isNaN(attitude)
  ) {
    return false;
  }
  return true;
}

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
    participation,
    qualityOfWork,
    teamWork,
    punctual,
    attitude,
  } = req.query;

  if (
    owner === undefined ||
    owner === null ||
    owner === "" ||
    owner === "undefined" ||
    owner === "null"
  ) {
    return res.status(400).json({ error: true, message: "Please login." });
  }

  if (
    !ratingsCheckOK(
      communication,
      participation,
      qualityOfWork,
      teamWork,
      punctual,
      attitude
    )
  ) {
    return res
      .status(400)
      .json({ error: true, message: "Category's must be between 1 - 5." });
  }

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
      await dbTools.appendArray(
        { lookupName: student },
        {
          ratings: {
            owner,
            // student,
            communication,
            participation,
            qualityOfWork,
            teamWork,
            punctual,
            attitude,
          },
        },
        collectionName
      );

      // Update the student's overall ratings
      const ratings = await getDbRating(student)      
      // delete ratings.student;

      dbTools.updateData(
        { lookupName: student },
        { overallRatings: { ...ratings } },
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

// Get all ratings from a student
async function getDbRating(student) {
  const data = await dbTools.getScores({ lookupName: student }, collectionName);
  
  if (data.length !== 0) {
    const result = classCritic.calculateScores(data);
    return result;
  }
}

//update a rating from a student

// Add a rating to a student
router.get("/update-rating", async (req, res, next) => {
  if (!authCheck.checkValidToken(req.headers.authorization))
    return res
      .status(401)
      .json({ error: true, message: "Authorization Error." });

  const {
    owner,
    student,
    communication,
    participation,
    qualityOfWork,
    teamWork,
    punctual,
    attitude,
    index,
  } = req.query;

  if (
    !ratingsCheckOK(
      communication,
      participation,
      qualityOfWork,
      teamWork,
      punctual,
      attitude
    )
  ) {
    return res
      .status(400)
      .json({ error: true, message: "Difficulty must be between 1 and 5." });
  }

  if (!(await dbTools.checkDBEntry({ lookupName: student }, collectionName))) {
    res.status(400).json({ error: true, message: "Student does not exist." });
  } else {
    if (
      (await dbTools.checkInArray(
        { lookupName: student },
        { "ratings.owner": owner },
        "$ratings",
        collectionName
      )) === 0
    ) {
      res
        .status(400)
        .json({ error: true, message: "You have no rating to update." });
    } else {
      const result = await dbTools.updateArray(
        { lookupName: student },
        {
          owner,
          student,
          communication,
          participation,
          qualityOfWork,
          teamWork,
          punctual,
          attitude,
        },
        collectionName
      );

        
        // wait 2 seconds for the update to take place
        // await new Promise((resolve) => setTimeout(resolve, 5000));               

      // Update the student's overall ratings
      const ratings = await getDbRating(student);      
      delete ratings.student;

      dbTools.updateData(
        { lookupName: student },
        { overallRatings: { ...ratings } },
        collectionName
      );
      res.status(200).json({ error: false, message: "updated rating" });
    }
  }
});

module.exports = router;
