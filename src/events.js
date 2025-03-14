const express = require("express");
const { authenticate } = require("./auth");

const router = express.Router();
const events = [];

router.post("/", authenticate, (req, res) => {
    const { name, description, date, time, category, reminder } = req.body;

    if (!name || !description || !date || !time || !category) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const event = { 
        name, 
        description, 
        date, 
        time, 
        category, 
        reminder, 
        user: req.user.username 
    };

    events.push(event);
    res.status(201).json({ message: "Event created" });
});

router.get("/", authenticate, (req, res) => {
    const userEvents = events.filter(e => e.user === req.user.username);
    res.status(200).json(userEvents);
});

router.get("/sorted", authenticate, (req, res) => {
    const { sortBy } = req.query;
    let userEvents = events.filter(e => e.user === req.user.username);
    
    if (sortBy === "date") {
        userEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "category") {
        userEvents.sort((a, b) => a.category.localeCompare(b.category));
    } else {
        return res.status(400).json({ message: "Invalid sort parameter" });
    }

    res.status(200).json(userEvents);
});

const checkReminders = () => {
    const now = new Date();
    events.forEach(event => {
        const eventTime = new Date(`${event.date}T${event.time}`);
        if (event.reminder && eventTime - now <= event.reminder * 60000) {
            console.log(`Reminder: ${event.name} is happening soon!`);
        }
    });
};

setInterval(checkReminders, 60000);

module.exports = router;
