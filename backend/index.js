const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const userModel = require("./model/user");
const productModel = require("./model/product");
const cartProductModel = require("./model/cartProducts");
const orderHistoryModel = require("./model/orderhistory");
// const session = require("express-session");
const mongostore = require("connect-mongo");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const axios = require("axios");
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
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.username = user.name;
        req.id = user._id;
        next();
    });
}

app.get("/", authenticateToken, (req, res) => {
    if (!req.username) { // If authentication failed, return an error
        return res.status(403).json({ message: "Authentication failed" });
    }
    console.log("Username: verification done", req.username);
    return res.json({ status: 200, name: req.username });
});

app.post("/login", async (req, res) => {
    try {
        const { email, password, recapval } = req.body;

        const secret_key = process.env.RECAPTCHA_SECRET_KEY; // Store in environment variables

        // Verify reCAPTCHA token
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${recapval}`;
        const recaptchaResponse = await axios.post(verificationURL);

        if (!recaptchaResponse.data.success) {
            return res.status(400).json({ message: "reCAPTCHA verification failed!" });
        }

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
                const token = jwt.sign(tokendata, "123abc", { expiresIn: "1h" });
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

app.post("/profilepage", authenticateToken,async (req, res) => {
    // const authHeader = req.headers.authorization;
    // const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]); // Fetch the token from cookies or Authorization header

    // if (!token) {
    //     return res.status(401).json({ message: "No token found!" });
    // }

    // let email = "";
    // try {
    //     // Verify the JWT
    //     const user = jwt.verify(token, "123abc");
    //     _id = user._id;
    // } catch (err) {
    //     console.error("JWT Error:", err.message);
    //     return res.status(403).json({ message: "Invalid or expired token" });
    // }

    const _id = req.id;

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

        const password = req.body.password;
        const hashpassword = await bcrypt.hash(password, 9);

        if (password) {
            resbody.password = await bcrypt.hash(password, 9);
        } else if (password === "") {

            delete resbody.password; // Remove password from update if it's not provided
        }

        const updateuser = await userModel.findByIdAndUpdate(_id, resbody, { new: true });
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

// Endpoint to upload a new product
app.post("/uploaditem", authenticateToken, async (req, res) => {
    try {
        // Extract data from the request body
        const { name, price, category, description } = req.body;
        const status = "Available";

        // Extract sellerId from the token (set by `authenticateToken`)
        const sellerId = req.id; // Assuming `authenticateToken` sets the seller's user ID in `req.id`

        // Validate required fields
        if (!name || !price || !category || !description) {
            return res.status(400).json({
                status: 400,
                message: "All fields (name, price, category, description) are required.",
            });
        }

        // Create a new product instance
        const newProduct = new productModel({
            name,
            price,
            category,
            description,
            status,
            sellerId, // Reference to the user's ObjectId
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

// Endpoint to get all products
app.get("/getproduct", authenticateToken, async (req, res) => {
    try {

        const userId = req.id;
        // Fetch all products and populate the seller's details
        const allProducts = await productModel
            // .find({ sellerId: { $ne: userId } }) // Exclude products where sellerId is equal to userId
            .find({status:{$in : "Available"}})
            .populate("sellerId", "firstName lastName email") // Populates seller details
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "All products retrieved successfully.",
            success: true,
            error: false,
            data: allProducts,
        });
    } catch (err) {
        console.error("Error fetching products:", err.message);
        res.status(500).json({
            message: err.message || "Server error. Could not fetch the products.",
            error: true,
            success: false,
        });
    }
});



app.post("/addtocart", authenticateToken, async (req, res) => {
    try {

        const { productId } = req.body;
        // console.log("product id:",productId);
        const userId = req.id;
        // console.log("userId:",userId);

        const isAvailable = await cartProductModel.findOne({ productId: productId ,userId:userId});

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

        // console.log("userId and sellerId",userId, product.sellerId._id.toString())

        if (userId === product.sellerId._id.toString()) {
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

app.post("/addtocartview", authenticateToken, async (req, res) => {

    try {

        const userId = req.id;

        const cartproducts = await cartProductModel.find({
            userId: userId,
        }).populate("productId");

        res.status(200).json({
            data: cartproducts,
            error: false,
            success: true
        })

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }

})

app.post("/deletefromcart", authenticateToken, async (req, res) => {
    try {
        const prodId = req.body._id;
        const deleted = await cartProductModel.deleteOne({
            _id: prodId
        })

        res.status(200).json({
            message: "removed from cart",
            success: true,
            error: false
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
            success: false,
            error: true
        })
    }
})

app.post("/checkoutcart", authenticateToken, async (req, res) => {
    try {
        const { prodIds, prodsearchIds } = req.body; // `prodIds` are cart entry IDs, `prodsearchIds` are product entry IDs.

        // console.log("cart:",prodIds);

        // Delete cart items corresponding to the provided `prodIds`
        const deleted = await cartProductModel.deleteMany({
            productId: { $in: prodsearchIds }, // Deletes documents with IDs in `prodIds`
        });

        const updatedProducts = await productModel.updateMany(
            { _id: { $in: prodsearchIds } },
            { $set: { status: "Sold" } }
        );

        // Extract buyer information from the token
        const buyerName = req.username;
        const buyerId = req.id;

        const products = await productModel.find({ _id: prodsearchIds })

        // Prepare order history entries for all `prodsearchIds`
        const orderHistoryEntries = products.map(product => ({
            prodId: product._id, // Reference to the product in the `products` collection
            buyerId: buyerId, // Reference to the buyer in the `users` collection
            sellerId: product.sellerId,
            otp: "", // Generate a random 6-digit OTP
            Delivered: "Pending", // Initial delivery status
        }));

        // Insert multiple entries into the `orderHistory` collection
        await orderHistoryModel.insertMany(orderHistoryEntries);

        // Respond with success
        res.status(200).json({
            message: "Order placed successfully.",
            success: true,
            error: false,
            deletedCount: deleted.deletedCount, // Number of cart items deleted
            orderHistory: orderHistoryEntries, // Return the created order entries
        });
    } catch (err) {
        // Handle errors
        res.status(500).json({
            message: err.message,
            success: false,
            error: true,
        });
    }
});


app.post("/boughtsoldandpending", authenticateToken, async (req, res) => {
    try {
        const userId = req.id; // User ID from the token
        // console.log("user Id in boughtsold:",userId);

        const soldprods = await orderHistoryModel
            .find({ sellerId: userId, Delivered: { $ne: "Pending" } })
            .populate("prodId", "name price category description")
            .populate("buyerId", "firstName lastName email");

        // Fetch bought products (where user is the buyer)
        const boughtprods = await orderHistoryModel
            .find({ buyerId: userId, Delivered: { $ne: "Pending" } }) // Use userId directly as it is already an ObjectId
            .populate("prodId", "name price category description")
            .populate("sellerId", "firstName lastName email");
        // console.log("hello1");

        // Handle pending orders (where user is the buyer and order is pending)
        const pendingOrders = await orderHistoryModel
            .find({ buyerId: userId, Delivered: "Pending" }) // No need for `$in`, as we are comparing buyerId directly
            .populate("prodId", "name price category description")
            .populate("sellerId", "firstName lastName email");

        // console.log("hello2");

        // Generate OTP and update the orderHistory for pending orders
        const updatedPendingOrders = [];
        for (let order of pendingOrders) {
            if (order.buyerId.equals(userId)) { // Correct way to compare ObjectId
                // Generate OTP for the buyer
                const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-character OTP

                // Hash the OTP
                const hashedOtp = await bcrypt.hash(otp, 10);

                // Update the OTP in the orderHistory
                order.otp = hashedOtp;
                await order.save();

                // Add OTP to the product details for response
                updatedPendingOrders.push({ ...order.toObject(), otp });
            }
        }
        // console.log("hello3");

        // console.log("buy pending:",pendingOrders);

        // console.log("updated one:",updatedPendingOrders);

        res.status(200).json({
            soldprods,
            boughtprods,
            updatedPendingOrders,
            success: true,
            error: false,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
            success: false,
            error: true,
        });
    }
});

app.post("/deliveritems", authenticateToken, async (req, res) => {

    try {

        const userId = req.id;

        const pendingdelivers = await orderHistoryModel.find({ sellerId: userId, Delivered: "Pending" })
            .populate("prodId", "name price category description")
            .populate("buyerId", "firstName lastName email");

        // console.log("deliver pendings:",pendingdelivers);

        res.status(200).json({
            success: true,
            error: false,
            data: pendingdelivers
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
            success: false,
            error: true,
        });
    }

})

app.post("/completedeliver", authenticateToken, async (req, res) => {
    try {
        const { otp, prodId } = req.body;
        const userId = req.id;

        // Find the pending order where the seller is the current user and the product matches
        const pendingOrder = await orderHistoryModel.findOne({ sellerId: userId, prodId: prodId });

        if (!pendingOrder) {
            return res.status(404).json({
                message: "Order not found or already completed.",
                success: false,
                error: true,
            });
        }

        // Compare the provided OTP with the stored hashed OTP
        const isOtpValid = await bcrypt.compare(otp, pendingOrder.otp);

        if (!isOtpValid) {
            return res.status(200).json({
                message: "Incorrect OTP. Please try again.",
                success: false,
                error: true,
            });
        }

        // Update the delivery status to "Done"
        pendingOrder.Delivered = "Done";
        pendingOrder.TransactionId = pendingOrder._id; 
        await pendingOrder.save();

        res.status(200).json({
            message: "Delivery completed successfully.",
            success: true,
            error: false,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Server error. Could not complete the delivery.",
            success: false,
            error: true,
        });
    }
});


// app.post("/api/generate", async (req, res) => {
//     try {
//       const response = await axios.post(
//         "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDWq1A2JHlGnoAuO337La0d8v6niqHze7M",
//         {
//           contents: [{ parts: [{ text: req.body.prompt }] }]
//         }
//       );
      
//       res.json(response.data['candidates'][0]['content']['parts'][0]['text']);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });

app.post("/api/generate", async (req, res) => {
    try {
      const userMessage = req.body.prompt.toLowerCase();
  
      // Custom response for greetings
      if (userMessage.includes("hello") || userMessage.includes("hi")) {
        return res.json("Hello! Welcome to our platform. Are you looking to buy or sell something today? 🚀 Check out our amazing deals!");
      }
  
      // Custom response for product-related queries
      const productKeywords = ["products", "available", "what do you have", "items", "buy"];
      if (productKeywords.some(keyword => userMessage.includes(keyword))) {
        return res.json("We have a variety of amazing products available! 🛍️ Check them out on our [Store Page](http://localhost:5173/searchitems) for the latest listings.");
      }
      const sellkeywords = ["sell", "upload", "add something","add items","add item"];
      if (sellkeywords.some(keyword => userMessage.includes(keyword))) {
        return res.json("You Can go to the [Store Page](http://localhost:5173/searchitems) and upload your items overthere");
      }
  
      // If no custom responses match, use Gemini API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: req.body.prompt }] }]
        }
      );
  
      res.json(response.data['candidates'][0]['content']['parts'][0]['text']);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  



