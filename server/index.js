const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const userModel = require("./model/user");
const productModel = require("./model/product");
const cartProductModel = require("./model/cartProducts");
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
    .then(() => {

        console.log("successful connection to mongodb");
        app.listen(process.env.PORT, () => {
            console.log(`server is running on port ${process.env.PORT}`);
        });
    }
    )
    .catch(e => console.log("connection to mongodb failed", e))




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
            return res.status(403).json({ message: "Invalid or expired token" }); f
        }
        req.username = user.name;
        req.id = user._id;
        next();
    });
}

app.get("/", authenticateToken, (req, res) => {
    return res.json({ status: 200, name: req.username });
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
                    _id: user._id,
                    name: name,
                    email: email
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

app.post("/edituser", async (req, res) => {

    try {
        const { _id, ...resbody } = req.body;

        const updateuser = await userModel.findByIdAndUpdate(_id, resbody);
        res.json(
            {
                message: "user details updated!!",
                status: 200,
                success: true
            }
        )
    } catch (err) {
        res.json({
            error: err.message,
            status: 400,
        })
    }
})

app.post("/uploaditem", authenticateToken, async (req, res) => {
    try {

        console.log("hello!");
        // Extract data from the request body
        const { name, price, category, description } = req.body;

        // Extract sellerId and sellerName from the token (set by `authenticateToken`)
        const sellerId = req.id;
        const sellerName = req.username;

        // Validate required fields
        if (!name || !price || !category || !description) {
            return res.status(400).json({
                status: 400,
                message: "All fields (name, price, category, description) are required.",
            });
        }

        //   console.log("name:"+name,"price:"+price,"category:"+category,"description:"+description,"sellerId:"+sellerId,"sellerName:"+sellerName);

        // Create a new product instance
        const newProduct = new productModel({
            name,
            price,
            category,
            description,
            sellerId,
            sellerName
        });

        // Save the product to the database
        await newProduct.save();

        // Respond with success
        res.status(200).json({
            status: 200,
            message: "Product uploaded successfully.",
            product: newProduct,
        });
    } catch (err) {
        console.error("Error uploading item:", err.message);
        res.status(500).json({
            status: 500,
            message: "Server error. Could not upload the product.",
            error: err.message,
        });
    }
});

app.get("/getproduct", authenticateToken, async (req, res) => {
    try {

        const allproducts = await productModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            message: "all products",
            success: true,
            error: false,
            data: allproducts
        })

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
})


app.post("/addtocart", authenticateToken, async (req, res) => {
    try {

        const { productId } = req.body;
        // console.log("product id:",productId);
        const userId = req.id;
        // console.log("userId:",userId);

        const isAvailable = await cartProductModel.findOne({ productId: productId });

        // console.log("is avai:",isAvailable);

        const product = await productModel.findOne({ _id: productId });

        // console.log("sellerId",product.sellerId);


        if (isAvailable) {
            console.log("product already there")
            return res.status(200).json({
                message: "Already exists in Cart",
                error: true,
                success: false
            })
        }

        if (userId === product.sellerId) {
            console.log("same seller and buyer")
            return res.status(200).json({
                message: "You Can't buy your product!!",
                error: true,
                success: false
            })
        }

        const cartproduct = {
            productId: productId,
            userId: userId
        }

        const cartproductobj = new cartProductModel(cartproduct);
        const saveproductcart = await cartproductobj.save();

        return res.status(200).json({
            data: saveproductcart,
            message: "Added to cart",
            error: false,
            success: true
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
})

app.post("/addtocartview",authenticateToken, async (req,res)=>{

    try{

        const userId = req.id;

        const cartproducts = await cartProductModel.find({
            userId:userId
        }).populate("productId");

        res.status(200).json({
            data:cartproducts,
            error:false,
            success:true
        })

    }catch(err){
        res.status(500).json({
            message:err.message || err,
            error :true,
            success:false
        })
    }

})

app.post("/deletefromcart",authenticateToken,async (req,res)=>{
    try{
        const prodId = req.body._id;
        const deleted =  await cartProductModel.deleteOne({
            _id:prodId
        })

        res.status(200).json({
            message:"removed from cart",
            success:true,
            error:false
        });
        
    }catch(err){
        res.status(500).json({
            message:err.message ,
            success:false,
            error:true
    })
    }
})

app.post("/checkoutcart",authenticateToken,async (req,res)=>{
    try{
        const {prodIds,prodsearchIds} = req.body;
        const deleted = await cartProductModel.deleteMany({
            _id: { $in: prodIds } // This will delete all documents with IDs in the array
        });

        const searchdeleted = await productModel.deleteMany({
            _id :{$in:prodsearchIds}
        });

        res.status(200).json({
            message: "Items bought from cart",
            success: true,
            error: false,
            deletedCount: deleted.deletedCount // Optional: returns number of deleted documents
        });
        
    }catch(err){
        res.status(500).json({
            message:err.message ,
            success:false,
            error:true
    })
    }
})


