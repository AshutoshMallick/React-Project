const Admin = require("./models/admin");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { helpers } = require("../helper");
require("./mongoose");

const adminObjectId = new mongoose.Types.ObjectId();

const admin = {
    _id: adminObjectId,
    name: "Admin",
    password: "Fresco@123",
    tokens: [
        {
            token: jwt.sign({_id: adminObjectId}, helpers.secret_token),
        }
    ]
}

const setUpDataBase = async () => {
    await Admin.deleteMany();
    await new Admin(admin).save();
    await mongoose.connection.close();
}

setUpDataBase();

