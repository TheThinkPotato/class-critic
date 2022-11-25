const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require('cors');
const app = express();

const res = require("express/lib/response");
const helmet = require('helmet')
require('dotenv').config();

const FRONT_END_LOCATION = "./front-end/class-critic/build"

const hostname = process.env.HOST_NAME || "127.0.0.1";
const port = process.env.PORT || 3001;

app.use(express.static(FRONT_END_LOCATION));



console.log(`Class Critic Server Version ${process.env.VERSION} Starting...`)
console.log(`Server is running on ${process.env.HOST_NAME}:${process.env.PORT}`,);

const aboutRouter = require("./routes/about");
const userRouter = require("./routes/user");
const uniRouter = require("./routes/uni");
const studentRouter = require("./routes/student");

app.options('*', cors()) // include before other routes
app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());

logger.token('req', (req, res) => JSON.stringify(req.headers))
logger.token('res', (req, res) => {
const headers = {}
res.getHeaderNames().map(h => headers[h] = res.getHeader(h))
return JSON.stringify(headers)
})

app.use("/about", aboutRouter);
app.use("/user", userRouter);
app.use("/uni", uniRouter);
app.use("/student", studentRouter);


// app.use("/[.a-zA-Z0-9-]+",function ( req,res,next)
app.use("/", function (req, res, next) {
  res.status(404).json({error: true , message : "Not Found"});
  // next(createError(404, "Not Found"));
})

app.use((req, res) => {
  res.sendFile(path.join(__dirname, FRONT_END_LOCATION, 'index.html'));
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});



app.listen(port, function () {
  console.log(`Express app listening at http://${hostname}:${port}/`);
});

module.exports = app;
