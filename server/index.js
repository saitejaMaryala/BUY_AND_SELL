const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const userModel = require("./model/user");
// const session = require("express-session");
const mongostore = require("connect-mongo");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["POST", "GET"],
    credentials: true,
}));
app.use(cookieParser());


mongoose.connect(process.env.MONGO_STRING)
    .then(() => console.log("successful connection to mongodb"))
    .catch(e => console.log("connection to mongodb failed", e))

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});


function authenticateToken(req, res, next) {
    // console.log("Cookies:", req.cookies); // Log all cookies for debugging
    const authHeader = req.headers.authorization;
    // console.log("Authorization Header:", authHeader);
    const token = req.cookies.token || authHeader && authHeader.split(" ")[1];; // Fetch the token from cookies
    // console.log("Extracted Token:", token);

    if (!token) {
        return res.status(401).json({ message: "No token found!" });
    }

    jwt.verify(token, "123abc", (err, user) => {
        if (err) {
            console.log("JWT Error:", err.message);
            return res.status(403).json({ message: "Invalid or expired token" });f
        }
        req.name = user.name;
        next();
    });
}

app.get("/", authenticateToken, (req, res) => {
    return res.json({ status: 200, name: req.name });
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (user) {
            const checkpass = await bcrypt.compare(password, user.password);
            if (checkpass) {
                console.log(email);
                const name = user.firstName;
                const tokendata = {
                    _id : user._id,
                    name:name,
                    email:email
                }
                const token = jwt.sign(tokendata, "123abc", { expiresIn: "1d" });
                res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
                return res.status(200).json({ message: "success", token });
            } else {
                res.status(401).json({ message: "INCORRECT PASSWORD!!" });
            }
        } else {
            res.status(401).json({ message: "USER does not exist!!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

app.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, age, contactNumber, password } = req.body;
        console.log(firstName + " " + lastName + " " + email + " " + age + " " + contactNumber + " " + password);

        const existinguser = await userModel.findOne({ email });

        if (existinguser) {
            return res.status(400).json({ error: "email already exists" });
        }
        const hashedpass = await bcrypt.hash(password, 9);
        const newuser = new userModel({ firstName, lastName, email, age, contactNumber, password: hashedpass });
        const saveuser = await newuser.save();
        res.status(201).json(newuser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get("/logout", async (req, res) => {
    res.clearCookie("token");
    return res.json({ status: 200 });
})

app.post("/profilepage", async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]); // Fetch the token from cookies or Authorization header

    if (!token) {
        return res.status(401).json({ message: "No token found!" });
    }

    let email = "";
    try {
        // Verify the JWT
        const user = jwt.verify(token, "123abc");
        _id = user._id;
    } catch (err) {
        console.error("JWT Error:", err.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
        // Fetch the user details from the database
        const existinguser = await userModel.findOne({ _id });
        if (!existinguser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send the user data to the frontend
        return res.status(200).json(existinguser);
    } catch (err) {
        console.error("Database Error:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/edituser", async (req, res)=>{

    try{
        const {_id, ...resbody} = req.body;

        const updateuser = await userModel.findByIdAndUpdate(_id,resbody);
        res.json(
            {
                message:"user details updated!!",
                status:200,
                success:true
            }
        )
    }catch(err){
        res.json({
            error:err.message,
            status:400,
        })
    }
})




