const express = require("express");
const { router: authRouter, authenticate } = require("./auth");
const eventsRouter = require("./events");

const app = express();
app.use(express.json());

app.use("/auth", authRouter);
app.use("/events", authenticate, eventsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // Export app for testing
