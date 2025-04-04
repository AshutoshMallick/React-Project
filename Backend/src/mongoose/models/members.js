const mongoose = require("mongoose");

//Scehma for members
const membersSchema = new mongoose.Schema({
    employee_id: {
        type: Number,
        required: true
    },
    employee_name: {
        type: String,
        required: true
    },
    technology_name: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true
    },
});

//setting up members model
const Members = mongoose.model("Members", membersSchema);

module.exports = Members;
