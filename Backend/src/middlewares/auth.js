const jwt = require("jsonwebtoken");
const Admin = require("../mongoose/models/admin");
const { secret_token } = require("../../src/helper").helpers;

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            return res.status(401).send({ error: "Authentication required" });
        }
        const decoded = jwt.verify(token, secret_token);
        const admin = await Admin.findOne({ _id: decoded._id, "tokens.token": token });

        if (!admin) {
            throw new Error();
        }

        req.token = token;
        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).send({ error: "Authentication required" });
    }
};

module.exports = auth;