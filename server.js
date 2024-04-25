require("dotenv").config();
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const { connectDB } = require("./db/dbConnect");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { userService, orderService, menuService } = require("./services");
const pdf = require("html-pdf");
const fs = require("fs");
const app = express();

const options = {
  origin: "*",
};
app.use(cors(options));

//body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cookies
app.use(cookieParser());

//routes
app.use("/v1", routes);

//ejs
app.set("view engine", "ejs");

// public for img
app.use(express.static("public"));

/* pages */
/* index */
app.get("/", (req, res) => {
  res.render("./index.ejs");
});

/* register */
app.get("/signup", (req, res) => {
  res.render("./signup.ejs");
});

/* login */
app.get("/login", (req, res) => {
  res.render("./login.ejs");
});

/* Add Menu */
app.get("/addmenu", (req, res) => {
  res.render("./addmenu.ejs");
});

/* Add Restorant */
app.get("/addrest", (req, res) => {
  res.render("./addrest.ejs");
});

/* Add payment */
app.get("/addpayment", (req, res) => {
  res.render("./addpayment.ejs");
});

/* Add order */
app.get("/addorder", (req, res) => {
  res.render("./addorder.ejs");
});

/* Convert HTML to PDF and Download */
app.get("/generatepdf", async (req, res) => {
  try {
    // Fetch menu list data from MongoDB
    let menuList = await menuService.getMenu();


    // Convert menu list data to HTML
    let htmlData = "<h1>Menu List</h1>";
    menuList.forEach(menuItem => {
      htmlData += `<p>${menuItem.name}: ${menuItem.price}</p>`;
    });

    // Generate PDF from HTML
    const fileName = "menu_list.pdf";
    pdf.create(htmlData).toFile(fileName, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error generating PDF");
      }

      // Send generated PDF file for download
      res.download(fileName, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error downloading PDF");
        }

        // Delete the generated PDF file after download
        fs.unlinkSync(fileName);
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching menu list");
  }
});


/* Add data */
app.get("/userdata", async (req, res) => {
  try {
    let user = await userService.getUser();
    res.render("./data.ejs", { message: user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/* Get Menu List from MongoDB */
app.get("/menulist", async (req, res) => {
  try {
    let menu = await menuService.getMenu();
    res.render("./menulist.ejs", { message: menu });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//DB connect
connectDB();

//server
http.createServer(app).listen(process.env.PORT, () => {
  console.log("Server started successfully on port " + process.env.PORT);
});
