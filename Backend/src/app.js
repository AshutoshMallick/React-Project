const express = require("express");
const membersRouter = require("./routers/teams");
require("./mongoose/mongoose");

const app = new express();

app.use(express.json());
app.use(membersRouter);

module.exports = app;