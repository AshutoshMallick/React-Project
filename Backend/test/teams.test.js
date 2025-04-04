const request = require("supertest");
const Admin = require("../src/mongoose/models/admin");
const Teams = require("../src/mongoose/models/teams");
const Members = require("../src/mongoose/models/members");
const app = require("../src/app");
const {members, setUpDataBase, teams, admin, clearData} = require("./utils/testDB");

beforeEach(setUpDataBase);

afterAll(clearData);

//admin logging in with valid credentials
test("Admin logging in", async () => {
    await request(app).post("/admin/login").send({
        name: admin.name,
        password: admin.password,
    }).expect(200);
    const adminOne = await Admin.findById(admin._id);
    expect(adminOne.tokens.length).toBe(2);
});

//admin unable to login with invalid credentials
test("Admin not logging in", async () => {
    const response = await request(app).post("/admin/login").send({
        name: admin.name,
        password: admin.password+"!!",
    }).expect(400);
    expect(response.body).toMatchObject({error: "Username or password is wrong"});
});

//adding a team member with valid details
test("Adding a new member", async () => {
    await request(app).post("/tracker/members/add").send({
        employee_id: 1685742,
        employee_name: "New Employee",
        technology_name: "Node.js",
        experience: 2,
    }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
    .expect(201);
    const members = await Members.find();
    const teams = await Teams.find();
    expect(members.length).toBe(5);
    expect(teams.length).toBe(3);
});

//adding a team member with valid details
test("Adding a new member", async () => {
    await request(app).post("/tracker/members/add").send({
        employee_id: 1685742,
        employee_name: "New Employee",
        technology_name: "Big Data",
        experience: 2,
    }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
    .expect(201);
    const members = await Members.find();
    const teams = await Teams.find();
    expect(members.length).toBe(5);
    expect(teams.length).toBe(4);
});

//adding an already existing team member
test("Adding a new member", async () => {
    const response = await request(app).post("/tracker/members/add").send({
        employee_id: members[0].employee_id,
        employee_name: members[0].employee_name,
        technology_name: members[0].technology_name,
        experience: members[0].experience,
    }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
    .expect(400);
    expect(response.body).toMatchObject({
        error: "Member with same team already exists",
    });
});


//adding a team member with invalid employee id
test("Adding a new member with invalid employee id", async () => {
    await request(app).post("/tracker/members/add").send({
        employee_id: 16857,
        employee_name: "New Employee",
        technology_name: "Node.js",
        experience: 2,
    }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
    .expect(400);
});

//adding a team member with invalid employee id
test("Adding a new member with invalid employee id", async () => {
    await request(app).post("/tracker/members/add").send({
        employee_id: 16857895,
        employee_name: "New Employee",
        technology_name: "Node.js",
        experience: 2,
    }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
    .expect(400);
});

//adding a team member with invalid employee name
test("Adding a new member with invalid employee name", async () => {
    await request(app).post("/tracker/members/add").send({
        employee_id: 1685757,
        employee_name: "Ne",
        technology_name: "Node.js",
        experience: 2,
    }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
    .expect(400);
});

//adding a team member with invalid employee name
test("Adding a new member with invalid employee name", async () => {
    await request(app).post("/tracker/members/add").send({
        employee_id: 1685757,
        employee_name: "Employee@",
        technology_name: "Node.js",
        experience: 2,
    }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
    .expect(400);
});

//adding a team member with invalid employee name
test("Adding a new member with invalid employee name", async () => {
    await request(app).post("/tracker/members/add").send({
        employee_id: 1685757,
        employee_name: "Employee1",
        technology_name: "Node.js",
        experience: 2,
    }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
    .expect(400);
});

//adding a team member with invalid experience
test("Adding a new member with invalid experience", async () => {
    await request(app).post("/tracker/members/add").send({
        employee_id: 1685757,
        employee_name: "Employee",
        technology_name: "Node.js",
        experience: -1,
    }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
    .expect(400);
});

//adding a team member without employee id
test("Adding a new member without employee id", async () => {
    await request(app).post("/tracker/members/add").send({
        employee_name: "Employee",
        technology_name: "Node.js",
        experience: 2,
    }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
    .expect(400);
});

//adding a team member without employee name
test("Adding a new member without employee name", async () => {
    await request(app).post("/tracker/members/add").send({
        employee_id: 1236547,
        technology_name: "Node.js",
        experience: 2,
    }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
    .expect(400);
});

//adding a team member without experience
test("Adding a new member without experience", async () => {
    await request(app).post("/tracker/members/add").send({
        employee_id: 1236547,
        employee_name: "Employee",
        technology_name: "Node.js"
    }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
    .expect(400);
});

//adding a team member without technology name
test("Adding a new member without technology name", async () => {
    await request(app).post("/tracker/members/add").send({
        employee_id: 1236547,
        employee_name: "Employee",
        experience: 2,
    }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
    .expect(400);
});

//getting technologies from db
test("Getting technologies from DB", async () => {
    const response = await request(app).get("/tracker/technologies/get")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    expect(response.body.length).toBe(3);
    expect(response.body[0].name).toBe(teams[0].name);
    expect(response.body[1].name).toBe(teams[1].name);
    expect(response.body[2].name).toBe(teams[2].name);
});

//adding technologies to dropdown
test("Adding a new technology to the dropdown", async () => {
    await request(app).post("/tracker/technologies/add")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .send({
            technology_name: "Big Data"
        }).expect(201);
    const techs = await Teams.find();
    expect(techs.length).toBe(4);
});

//adding technologies to dropdown
test("Adding a new technology to the dropdown", async () => {
    await request(app).post("/tracker/technologies/add")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .send({
            technology_name: "Node.js"
        }).expect(400);
});

//removing technologies to dropdown
test("Removing a new technology to the dropdown", async () => {
    await request(app).delete(`/tracker/technologies/remove/${teams[0].name}`)
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    const techs = await Teams.find();
    expect(techs.length).toBe(2);
    const members = await Members.find();
    expect(members.length).toBe(2);
});

//updating the name of a member
test("Updating a member name", async () => {
    await request(app).patch(`/tracker/members/update/${members[0]._id}`)
        .send({
            employee_name: "Updated Employee"
        }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    const member = await Members.findById(members[0]._id);
    expect(member.employee_name).toBe("Updated Employee");
});

//updating the id of a member
test("Updating a member id", async () => {
    await request(app).patch(`/tracker/members/update/${members[0]._id}`)
        .send({
            employee_id: 1686521
        }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    const member = await Members.findById(members[0]._id);
    expect(member.employee_id).toBe(1686521);
});

//updating the technology name of a member
test("Updating a member technology name", async () => {
    await request(app).patch(`/tracker/members/update/${members[0]._id}`)
        .send({
            technology_name: "Selenium"
        }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    const member = await Members.findById(members[0]._id);
    expect(member.technology_name).toBe("Selenium");
});

//updating the experience of a member
test("Updating a member experience", async () => {
    await request(app).patch(`/tracker/members/update/${members[0]._id}`)
        .send({
            experience: 5
        }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    const member = await Members.findById(members[0]._id);
    expect(member.experience).toBe(5);
});

//not udpating when validation of employee id got failed
test("Not updating when validation for employee id got falied", async() => {
    await request(app).patch(`/tracker/members/update/${members[0]._id}`)
        .send({
            employee_id: 1234,
        }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(400);
});

//not udpating when validation of employee id got failed
test("Not updating when validation for employee id got falied", async() => {
    await request(app).patch(`/tracker/members/update/${members[0]._id}`)
        .send({
            employee_name: "Me",
        }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(400);
});

//not udpating when validation of employee id got failed
test("Not updating when validation for employee id got falied", async() => {
    await request(app).patch(`/tracker/members/update/${members[0]._id}`)
        .send({
            employee_name: "Mead1",
        }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(400);
});

//not udpating when validation of employee id got failed
test("Not updating when validation for employee id got falied", async() => {
    await request(app).patch(`/tracker/members/update/${members[0]._id}`)
        .send({
            employee_name: "Mead%",
        }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(400);
});

//not udpating when validation of employee id got failed
test("Not updating when validation for employee id got falied", async() => {
    await request(app).patch(`/tracker/members/update/${members[0]._id}`)
        .send({
            experience: -1,
        }).set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(400);
});

//getting all the members from the DB
test("Getting members from DB", async () => {
    const response = await request(app).get("/tracker/members/display")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    expect(response.body.length).toBe(4);
    expect(response.body[0].employee_id).toBe(members[0].employee_id);
    expect(response.body[1].employee_name).toBe(members[1].employee_name);
    expect(response.body[2].technology_name).toBe(members[2].technology_name);
    expect(response.body[3].experience).toBe(members[3].experience);
});

//getting all the employees based on the technology name
test("Getting members from DB based on technology name", async () => {
    const response = await request(app).get(`/tracker/members/display?tech=${teams[0].name}`)
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    expect(response.body[0].employee_id).toBe(members[0].employee_id);
    expect(response.body[0].employee_name).toBe(members[0].employee_name);
    expect(response.body[0].technology_name).toBe(members[0].technology_name);
    expect(response.body[0].experience).toBe(members[0].experience);
    expect(response.body[1].employee_id).toBe(members[3].employee_id);
    expect(response.body[1].employee_name).toBe(members[3].employee_name);
    expect(response.body[1].technology_name).toBe(members[3].technology_name);
    expect(response.body[1].experience).toBe(members[3].experience);
});

//getting all the employees based on the experience
test("Getting members from DB based on experience", async () => {
    const response = await request(app).get("/tracker/members/display?experience=3")
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    expect(response.body[0].employee_id).toBe(members[2].employee_id);
    expect(response.body[0].employee_name).toBe(members[2].employee_name);
    expect(response.body[0].technology_name).toBe(members[2].technology_name);
    expect(response.body[0].experience).toBe(members[2].experience);
    expect(response.body[1].employee_id).toBe(members[3].employee_id);
    expect(response.body[1].employee_name).toBe(members[3].employee_name);
    expect(response.body[1].technology_name).toBe(members[3].technology_name);
    expect(response.body[1].experience).toBe(members[3].experience);
});

//getting all the employees based on the technology name and experience
test("Getting members from DB based on technology name and experience", async () => {
    const response = await request(app).get(`/tracker/members/display?tech=${teams[0].name}&experience=3`)
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    expect(response.body[0].employee_id).toBe(members[3].employee_id);
    expect(response.body[0].employee_name).toBe(members[3].employee_name);
    expect(response.body[0].technology_name).toBe(members[3].technology_name);
    expect(response.body[0].experience).toBe(members[3].experience);
});

//deleting a member from DB
test("Deleting members from DB", async () => {
    await request(app).delete(`/tracker/members/delete/${members[0]._id}`)
        .set("Authorization", `Bearer ${admin.tokens[0].token}`)
        .expect(200);
    const all_members = await Members.find();
    expect(all_members.length).toBe(3);
});