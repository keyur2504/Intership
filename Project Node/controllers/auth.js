const mysql = require("mysql2/promise"); // Import mysql2 with promise support
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.register = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    const [results] = await pool.execute(
      "SELECT email FROM users WHERE email = ?",
      [email]
    );

    if (results.length > 0) {
      return res.render("register", {
        message: "That Email is Already in use",
      });
    } else if (password !== passwordConfirm) {
      return res.render("register", {
        message: "Passwords Do not Match",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    // Use an array for the values in the INSERT query
    await pool.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return res.render("register", {
      message: "User Registered",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};
const getUserByEmail = async (email) => {
    const [results] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    return results.length > 0 ? results[0] : null;
  };
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).render("login", {
          message: "Please provide both email and password",
        });
      }
  
      const user = await getUserByEmail(email);
  
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).render("login", {
          message: "Incorrect email or password",
        });
      }
  
      const id = user.id;
      const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      console.log("Token: " + token);

      res.cookie("jwt", token);
      return res.status(200).redirect("/");

      
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error for login");
    }
  };

  exports.about = (req, res) => {
    const token = req.cookies.jwt;
  
    if (!token) {
      // Redirect to login page if no token is present
      return res.redirect("/login");
    }
  
    // Verify the token to check if it's valid
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // Invalid token, redirect to login page
        return res.redirect("/login");
      }
  
      // Valid token, user is logged in, render the "about" page
      return res.render("about", {
        user: decodedToken.id, // You might use this information to personalize the about page
      });
    });
  };
