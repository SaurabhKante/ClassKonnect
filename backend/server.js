// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const User = require("./models/User");
const Admin = require("./models/Admin");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with the origin of your React app
    credentials: true,
  })
);

const port = 8800;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'saurabhkante7719@gmail.com', // Replace with your Gmail address
//     pass: 'Saurabh@2362', // Replace with the App Password generated for your app
//   },
// });

async function initializeDatabase() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/EduNexaDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database initialization successful.");
  } catch (err) {
    console.error("Error initializing the database:", err);
  }
}

// Register a new user
app.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    // const mailOptions = {
    //   from: 'saurabhkante7719@2362', // Replace with your Gmail address
    //   to: user.email,
    //   subject: 'Registration Confirmation',
    //   text: `Hello ${user.name},\n\nThank you for registering with EduNexa!`,
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.error('Error sending email:', error);
    //   } else {
    //     console.log('Email sent:', info.response);
    //   }
    // });

    res.status(201).json({ message: "User registered successfully!" });
    

  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/admin", async (req, res) => {
  console.log("Admin login request received");
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ admin: username });

    if (!admin) {
      console.log("Admin not found");
      return res.status(404).json({ error: "Admin not found" });
    }

    if (admin.password === password) {
      res.status(200).json({ message: "Admin login successful" });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/admin", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

(async () => {
  await initializeDatabase();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
