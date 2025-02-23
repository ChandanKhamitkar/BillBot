import express from "express";
import cors from "cors";
import webhookRoute from "./routes/webhookRoute.js";


const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Default GET route
app.get("/", (req, res) => {
  res.send("Webhook BillBot is running, do not worry I'll handle the server, you go code...🧑‍💻");
});

app.use(webhookRoute);

app.listen(port, () => {
  console.log("Webhook BillBot is running...");
});
