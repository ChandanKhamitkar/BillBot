import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import createRoute from "./routes/createRoute.js";
import updateRoute from "./routes/updateRoute.js";
import readRoute from "./routes/readRoute.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3003;
app.use(express.json());
app.use(express.text());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));
// Default GET route
app.get("/", (req, res) => {
    res.send("Prisma + PostgreSQL DB Backend System is Running, I will handle the DB CRUD operations");
});
app.use(createRoute); // Create Route Hanlder
app.use(updateRoute); // Update Route Hanlder
app.use(readRoute); // Read Route Hanlder
app.listen(port, () => {
    console.log("Prisma + PostgreSQL DB Backend System is Running : ", port);
});
