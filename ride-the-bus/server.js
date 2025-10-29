const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const session = require("express-session");

app.use(
  session({
    secret: "supergeheim",
    resave: false,
    saveUninitialized: false,
  })
);

const registerroute = require("./routes/register");
const loginUser = require("./routes/loginuser");
const gameHandler = require('./sockets/gameHandler');

gameHandler(io);


app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views"));

app.use("/register", registerroute);
app.use("/login", loginUser);

app.get("/", (req, res) => {
  const user = req.session.user || null;
  res.render("index", { title: "Ride the Bus", user });
});

app.get("/lobby", (req, res) => {
  const user = req.session.user || null;
  res.render("lobby", { title: "lobby", user });
});

app.get("/admin", (req, res) => {
  const user = req.session.user || null;
  res.render("admin", { title: "admin" });
});

app.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});
app.get("/login", (req, res) => {
  res.render("login", { title: "Login-page" });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/ride-the-bus", {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
