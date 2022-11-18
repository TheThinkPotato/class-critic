const express = require("express");
const router = express.Router();

const authCheck = require("../functions/authCheck");
const dbTools = require("../functions/dbTools");

const collectionName = "uni";

// Get all universities
router.get("/", async (req, res, next) => {
  data = await dbTools.getData(collectionName);
  res.status(200).json({ ...data });
});

// Search for a university
router.get("/search/", async (req, res, next) => {
  const name = req.query.name;
  const data = await dbTools.getFirstData({ name: name }, collectionName);
  res.status(200).json({ ...data });
});

// Add a university
router.post("/add-uni", async (req, res, next) => {
  const { name, state, website } = req.body;
  if (authCheck.checkValidToken(req.headers.authorization)) {
    if (!(await dbTools.checkDBEntry({ name: name }, collectionName))) {
      dbTools.createDataBaseEntry({ name, state, website }, collectionName);
      res.status(200).json({ error: false, message: `added ${req.body.name}` });
    } else {
      res
        .status(400)
        .json({ error: true, message: "University already exists." });
    }
  } else {
    res.status(401).json({ error: true, message: "Authorization Error." });
  }
});

module.exports = router;
