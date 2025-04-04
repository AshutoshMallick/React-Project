const Admin = require("../../src/mongoose/models/admin");
const Teams = require("../../src/mongoose/models/teams");
const Members = require("../../src/mongoose/models/members");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { helpers } = require("../../src/helper");

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

const members = [
    {
        _id: new mongoose.Types.ObjectId(),
        employee_name: "Employee one",
        employee_id: 1687954,
        technology_name: "Node.js",
        experience: 2,
    },
    {
        _id: new mongoose.Types.ObjectId(),
        employee_name: "Employee two",
        employee_id: 999999,
        technology_name: "Devops",
        experience: 1,
    },
    {
        _id: new mongoose.Types.ObjectId(),
        employee_name: "Employee three",
        employee_id: 1234567,
        technology_name: "Angular.js",
        experience: 3,
    },
    {
        _id: new mongoose.Types.ObjectId(),
        employee_name: "Employee four",
        employee_id: 111111,
        technology_name: "Node.js",
        experience: 4,
    },
];

const teams = [
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Node.js",
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "React",
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Java",
    },
]

const setUpDataBase = async () => {
    await Admin.deleteMany();
    await Teams.deleteMany();
    await Members.deleteMany();
    await new Admin(admin).save();
    // members.forEach((member) => {
    //     new Members(member).save();
    // });
    // teams.forEach((team) => {
    //     new Teams(team).save();
    // });
    await Promise.all(members.map((member) => new Members(member).save()));
    await Promise.all(teams.map((team) => new Teams(team).save()));
}

const clearData = async() => {
    await Teams.deleteMany();
    await Members.deleteMany();
}

module.exports = {
    admin,
    teams,
    members,
    setUpDataBase,
    clearData
}

