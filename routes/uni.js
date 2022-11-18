const express = require("express");
const router = express.Router();

const authCheck = require("../functions/authCheck");
const dbTools = require("../functions/dbTools");

const collectionName = "uni";

// Get all universities
router.get("/", async (req, res, next) => {
data = await dbTools.getData(collectionName);
res.status(200).json({...data});
});

router.get("/:name", async (req, res, next) => {
  const name = req.params.name;
  const data = await dbTools.getFirstData({ name: name }, collectionName);  
  res.status(200).json({ ...data });
});

router.post("/add-uni", async (req, res, next) => {
  const { name, state, website } = req.body;
  if (!(await dbTools.checkDBEntry({ name: name }, collectionName))) {
    dbTools.createDataBaseEntry({ name, state, website }, collectionName);
    res.status(200).json({ error: false, message: `added ${req.body.name}` });
  } else {
    res
      .status(400)
      .json({ error: true, message: "University already exists." });
  }
});

module.exports = router;
