const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// // app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(express.static(__dirname));
app.use(express.static(__dirname)); // Serve HTML files

mongoose.connect("mongodb://127.0.0.1:27017/fwd", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// // Define Schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  city: String,
  phone: String,
});

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  place: String,
  guests: Number,
});

// Create Models
const User = mongoose.model("User", userSchema);
const Booking = mongoose.model("Booking", bookingSchema);

// Serve the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve the login page
// app.get("/login", (req, res) => {
//   res.sendFile(path.join(__dirname, "login.html"));
// });

// Handle login logic
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Use await to handle the database query
    const user = await User.findOne({ username, password });

    if (user) {
      // If login is successful, send the alert and redirect to packages.html
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Success</title>
            <script type="text/javascript">
              // Show the alert for successful login
              alert("Login Successful");
              // Redirect to packages.html after 2 seconds
              setTimeout(function() {
                window.location.href = '/packages.html'; 
              }, 2000);
            </script>
          </head>
          <body>
            <p>Redirecting to packages page...</p>
          </body>
        </html>
      `);
    } else {
      // If login fails, send the alert and reload the login page
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Failed</title>
            <script type="text/javascript">
              // Show the alert for invalid username or password
              alert("Invalid username or password");
              // Reload the login page after 2 seconds
              setTimeout(function() {
                window.location.href = '/'; 
              }, 2000);
            </script>
          </head>
          <body>
            <p>Redirecting to login page...</p>
          </body>
        </html>
      `);
    }
  } catch (err) {
    console.error(err);
    res.send("Error occurred");
  }
});

// // Serve the registration page
// app.get("/register", (req, res) => {
//   res.sendFile(path.join(__dirname, "signup.html"));
// });

// Handle registration logic
app.post("/register", async (req, res) => {
  const { username, password, email, city, phone } = req.body;
  const newUser = new User({ username, password, email, city, phone });

  try {
    await newUser.save(); // Save the new user

    // Send an HTML page with JavaScript to show the alert and redirect
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registration Success</title>
          <script type="text/javascript">
            // Show the alert for successful registration
            alert("Registration Successful");
            // Redirect to packages.html after 3 seconds
            setTimeout(function() {
              window.location.href = '/packages.html'; 
            }, 3000);
          </script>
        </head>
        <body>
          <p>Redirecting to packages page...</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.send("Error occurred while registering");
  }
});

// Handle booking logic
// Handle booking logic
app.post("/booking", async (req, res) => {
  const { name, email, phone, address, place, guests } = req.body;
  const newBooking = new Booking({
    name,
    email,
    phone,
    address,
    place,
    guests,
  });

  try {
    await newBooking.save(); // Save the new booking

    // Send an HTML page with JavaScript to show the alert and redirect
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
          <script type="text/javascript">
            // Show the alert for booking confirmation
            alert("Your booking data is saved. Proceeding to payment.");
            // Redirect to payment.html after 3 seconds
            setTimeout(function() {
              window.location.href = '/payment.html'; 
            }, 3000);
          </script>
        </head>
        <body>
          <p>Redirecting to payment page...</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.send("Error occurred while booking");
  }
});

// Define Schema for Conatus
const conatusSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

// Create Model for Conatus
const Conatus = mongoose.model("Conatus", conatusSchema);

// Handle Conatus submission
app.post("/conatus", async (req, res) => {
  const { name, email, message } = req.body;

  // Create a new Conatus document
  const newConatus = new Conatus({
    name,
    email,
    message,
  });

  try {
    // Save the new Conatus entry to the database
    await newConatus.save();

    // Send a response with a success message
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Conatus Submission Success</title>
          <script type="text/javascript">
            // Show the alert for successful submission
            alert("Your Conatus data has been successfully submitted.");
            // Redirect to a confirmation or another page (e.g., a thank-you page)
            setTimeout(function() {
              window.location.href = '/index.html'; 
            }, 3000);
          </script>
        </head>
        <body>
          <p>Redirecting...</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.send("Error occurred while submitting Conatus data");
  }
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
