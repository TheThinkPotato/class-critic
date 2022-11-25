const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
    res.status(200).json(
        {
            "name": process.env.APP_NAME,
            "version": process.env.VERSION,
        }
    )
})


module.exports = router;