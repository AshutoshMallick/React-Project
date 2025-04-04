const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../mongoose/models/admin");
const Members = require("../mongoose/models/members");
const Teams = require("../mongoose/models/teams");
const { helpers } = require("../helper");
const auth = require("../middlewares/auth");
//setting up router for teams
const membersRouter = new express.Router();

//code goes here for endpoints
// **
//  * 🔹 1.Admin Login
//  */
membersRouter.post("/admin/login", async (req, res) => {
    try {
        const { name, password } = req.body;

        // Find admin by name
        const admin = await Admin.findOne({ name });
        if (!admin || admin.password !== password) {
            return res.status(400).send({ error: "Username or password is wrong" });
        }

        // Generate a new JWT token
        const token = jwt.sign({ _id: admin._id }, helpers.secret_token);

        // Add token to admin's token array
        admin.tokens.push({ token });
        await admin.save();

        res.status(200).send({ token });
    } catch (error) {
        res.status(400).send({ error: "Something went wrong" });
    }
});
//2
membersRouter.post("/tracker/members/add", auth, async (req, res) => {
  try {
    const { employee_id, employee_name, technology_name, experience } = req.body;

    let newMember = await Members.findOne({ employee_id });

    if (!employee_id || typeof employee_id !== "number" || employee_id < 100000 || employee_id > 3000000) {
      return res.status(400).send({ error: "Invalid employee_id. Must be a number between 100000 and 3000000." });
    }
    if (!employee_name || typeof employee_name !== "string" || employee_name.trim().length < 3) {
      return res.status(400).send({ error: "Invalid employee_name. Must be at least 3 characters long." });
    }
    if (!/^[A-Za-z\s]+$/.test(employee_name)) {
      return res.status(400).send({ error: "Invalid employee_name. Must contain only alphabets and spaces." });
    }
    if (!(experience > 0)) {
      return res.status(400).send();
    }
    if (technology_name === undefined) {
      return res.status(400).send();
    }

    if (newMember) {
      return res.status(400).send({ error: "Member with same team already exists" });
    }
    // Creating a new member
    newMember = new Members({
      employee_id,
      employee_name,
      technology_name,
      experience,
    });

    await newMember.save();
    console.log("New member added:", newMember);

    let team = await Teams.findOne({ name: technology_name });

    if (!team) {
      team = new Teams({ name: technology_name });
      await team.save();
      console.log("New team created:", team);
    }

    res.status(201).send({ message: "Team member added successfully", newMember });
  } catch (error) {
    console.error("Error in /tracker/members/add:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
// membersRouter.post("/tracker/members/add",async(req,res)=>{
//     try {
//         const { employee_id, employee_name, technology_name, experience } = req.body;

//         // 🔹 Validate required fields
//         if (!employee_id || !employee_name || !technology_name || experience === undefined) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         // 🔹 Validate employee_id (should be exactly 6 digits)
//         if (!/^\d{6}$/.test(employee_id)) {
//             return res.status(400).json({ error: "Invalid employee ID" });
//         }

//         // 🔹 Validate employee_name (should be at least 3 characters and contain only letters)
//         if (!/^[A-Za-z\s]{3,}$/.test(employee_name)) {
//             return res.status(400).json({ error: "Invalid employee name" });
//         }

//         // 🔹 Validate experience (should be a positive number)
//         if (experience < 0) {
//             return res.status(400).json({ error: "Invalid experience" });
//         }

//         // 🔹 Check if the member already exists with the same technology
//         const existingMember = await Members.findOne({ employee_id, technology_name });
//         if (existingMember) {
//             return res.status(400).json({ error: "Member with same team already exists" });
//         }

//         // 🔹 Check if technology exists in teams collection; if not, add it
//         const existingTeam = await Teams.findOne({ name: technology_name });
//         if (!existingTeam) {
//             await new Teams({ name: technology_name }).save();
//         }

//         // 🔹 Add new member
//         const newMember = new Members({ employee_id, employee_name, technology_name, experience });
//         await newMember.save();

//         res.status(201).json({ message: "Member added successfully" });

//     } catch (error) {
//         res.status(400).json({ error: "Something went wrong" });
//     }
// }
// );

// 3.GET /tracker/technologies/get - Fetch all technologies
// membersRouter.get("/tracker/technologies/get", auth, async (req, res) => {
//     try {
//         const teams = await Teams.find({}, { _id: 0, name: 1 }); // Fetch only the 'name' field
//         res.status(200).send(teams);
//     } catch (error) {
//         res.status(400).send({ error: "Failed to fetch technologies" });
//     }
// });
membersRouter.get("/tracker/technologies/get", auth, async (req, res) => {
    try {
        console.log("Authenticated User:", req.admin); // Debug auth middleware
        const teams = await Teams.find({}, { _id: 0, name: 1 });
        res.status(200).send(teams);
    } catch (error) {
        console.error("Error fetching teams:", error);
        res.status(400).send({ error: "Failed to fetch technologies" });
    }
  });
// 4.POST /tracker/technologies/add - Add a new technology
membersRouter.post("/tracker/technologies/add", auth, async (req, res) => {
    try {
        const { technology_name } = req.body;
        if (!technology_name) {
            return res.status(400).send({ error: "Technology name is required" });
        }

        // Check if technology already exists
        const existingTech = await Teams.findOne({ name: technology_name });
        if (existingTech) {
            return res.status(400).send({ error: "Technology already exists" });
        }

        // Add new technology
        const newTech = new Teams({ name: technology_name });
        await newTech.save();

        res.status(201).send(newTech);
    } catch (error) {
        res.status(400).send({ error: "Failed to add technology" });
    }
});

// 5.DELETE /tracker/technologies/remove/:name - Remove a technology
membersRouter.delete("/tracker/technologies/remove/:name", auth, async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) {
            return res.status(400).send({ error: "Technology name is required" });
        }

        // Check if technology exists
        const existingTech = await Teams.findOne({ name });
        if (!existingTech) {
            return res.status(400).send({ error: "Technology not found" });
        }

        // Delete the technology
        await Teams.deleteOne({ name });

        // Remove members with the deleted technology
        await Members.deleteMany({ technology_name: name });

        res.status(200).send({ message: "Technology removed successfully" });
    } catch (error) {
        res.status(400).send({ error: "Failed to remove technology" });
    }
});

// 6.PATCH /tracker/members/update/:id - Update member details
membersRouter.patch("/tracker/members/update/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id, employee_name, technology_name, experience } = req.body;

    // Fetch existing member
    const member = await Members.findById(id);
    if (!member) {
      return res.status(404).send({ error: "Member not found" });
    }

    // Validation checks
    if (employee_id !== undefined) {
      if (typeof employee_id !== "number" || employee_id < 100000 || employee_id > 3000000) {
        return res.status(400).send({ error: "Invalid Employee ID. It should be between 100000 and 3000000." });
      }
      member.employee_id = employee_id;
    }

    if (employee_name !== undefined) {
      if (!/^[A-Za-z\s]{3,}$/.test(employee_name)) {
        return res.status(400).send({ error: "Invalid Employee Name. It should be at least 3 letters and contain only alphabets and spaces." });
      }
      member.employee_name = employee_name;
    }

    if (technology_name !== undefined) {
      member.technology_name = technology_name;
    }

    if (experience !== undefined) {
      if (typeof experience !== "number" || experience < 0 || experience > 50) {
        return res.status(400).send({ error: "Invalid Experience. It should be between 0 and 50 years." });
      }
      member.experience = experience;
    }

    await member.save();
    res.status(200).send({ message: "Member updated successfully", member });

  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).send({ error: "Something went wrong" });
  }
});
// membersRouter.patch("/tracker/members/update/:id", auth, async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updates = req.body;
//         const allowedUpdates = ["employee_name", "employee_id", "technology_name", "experience"];
//         const updateKeys = Object.keys(updates);

//         // Validate if update fields are allowed
//         const isValidUpdate = updateKeys.every((key) => allowedUpdates.includes(key));
//         if (!isValidUpdate) {
//             return res.status(400).send({ error: "Invalid update fields" });
//         }

//         // Validate employee_name (only alphabets & spaces)
//         if (updates.employee_name && !/^[A-Za-z\s]+$/.test(updates.employee_name)) {
//             return res.status(400).send({ error: "Invalid employee name format" });
//         }

//         // Validate employee_id (should be a 6 or 7 digit number)
//         if (updates.employee_id && !/^\d{6,7}$/.test(updates.employee_id.toString())) {
//             return res.status(400).send({ error: "Invalid employee ID format" });
//         }

//         // Validate experience (should be non-negative)
//         if (updates.experience !== undefined && updates.experience < 0) {
//             return res.status(400).send({ error: "Experience must be non-negative" });
//         }

//         // Find and update member
//         const member = await Members.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

//         if (!member) {
//             return res.status(400).send({ error: "Member not found" });
//         }

//         res.status(200).send(member);
//     } catch (error) {
//         res.status(400).send({ error: "Failed to update member" });
//     }
// });

//7. GET /tracker/members/display - Fetch members with optional filters
membersRouter.get("/tracker/members/display", auth, async (req, res) => {
    try {
        const { tech, experience } = req.query;
        let filter = {};

        // Apply filters if provided
        if (tech) {
            filter.technology_name = tech;
        }
        if (experience) {
            const exp = parseInt(experience, 10);
            if (isNaN(exp) || exp < 0) {
                return res.status(400).send({ error: "Invalid experience value" });
            }
            filter.experience = { $gte: exp };
        }

        // Fetch members based on filters
        const members = await Members.find(filter);

        res.status(200).send(members);
    } catch (error) {
        res.status(400).send({ error: "Failed to fetch members" });
    }
});

//8. DELETE /tracker/members/delete/:id - Delete a member by ID
membersRouter.delete("/tracker/members/delete/:id", auth, async (req, res) => {
    try {
        const deletedMember = await Members.findByIdAndDelete(req.params.id);

        if (!deletedMember) {
            return res.status(400).send({ error: "Member not found" });
        }

        res.status(200).send({ message: "Member deleted successfully" });
    } catch (error) {
        res.status(400).send({ error: "Failed to delete member" });
    }
});

module.exports = membersRouter;

