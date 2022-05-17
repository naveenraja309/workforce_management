const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./_middleware/error-handler");
const fileUpload = require("express-fileupload");
const process = require("process");
const path = require("path");

app.use(cors());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use("/img", express.static(path.join("img")));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(fileUpload({}));

// api routes
app.use(require("./admin/admin.controller"));

// global error handler
app.use(errorHandler);

// // start server
// const port =
//   process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
// app.listen(port, () => console.log("Server listening on port " + port));

////////////////////////////////////////////////////////////////////////////

//while uploading server

// start server
const port = process.env.PORT || 4001;
app.listen(port, () => console.log("Server listening on port " + port));

///////////////////////////////////////////////////////////////////////////
