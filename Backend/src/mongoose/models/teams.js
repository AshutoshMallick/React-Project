const mongoose = require("mongoose");

const teamsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

const Teams = mongoose.model("Teams", teamsSchema);

module.exports = Teams;
