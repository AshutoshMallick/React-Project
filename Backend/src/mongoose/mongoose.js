const mongoose = require("mongoose");
const { helpers } = require("../helper");

mongoose.connect(helpers.mongo_url, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
