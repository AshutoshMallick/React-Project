const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { helpers } = require("../../helper");

//Schema for admin collection
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens: [
        {
            token : {
                type: String
            }
        }
    ]
});

//deleting password and tokens when sending resposne
adminSchema.methods.toJSON = function() {
    const admin = this;
    const adminObject = admin.toObject();
    delete adminObject.password;
    delete adminObject.tokens;
    return adminObject;
}

//setting up the admin model
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
