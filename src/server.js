require('dotenv').config();

const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "../public")));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

const cors = require("cors");
app.use(cors());

const methodOverride = require("method-override"); 
app.use(methodOverride('_method'));


app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

const mainRoute = require("./routes/mainRoute");
const apiRoute = require("./routes/apiRoute");
const cabañasRoute = require("./routes/cabanasRoute")

app.listen(process.env.PORT_SECRET || 5005, () => console.log("Server running"));
//app.listen(5005, () => console.log("Server running"));

app.use("/", mainRoute);
app.use("/api", apiRoute);
app.use("/cabanas", cabañasRoute);