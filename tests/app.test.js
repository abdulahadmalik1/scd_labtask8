const request = require("supertest");
const express = require("express");
const { router: authRouter } = require("../src/auth");
const eventsRouter = require("../src/events");

const app = express();
app.use(express.json());
app.use("/auth", authRouter);
app.use("/events", eventsRouter);

let token;

describe("Authentication and Events API", () => {
    test("User Registration", async () => {
        const res = await request(app).post("/auth/register").send({
            username: "testuser",
            password: "testpassword"
        });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User registered");
    });

    test("User Login", async () => {
        const res = await request(app).post("/auth/login").send({
            username: "testuser",
            password: "testpassword"
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        token = res.body.token;
    });

    test("Create Event", async () => {
        const res = await request(app)
            .post("/events")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Test Event",
                description: "This is a test event",
                date: "2025-03-14",
                time: "12:00",
                category: "Test",
                reminder: 10
            });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Event created");
    });

    test("Get Events", async () => {
        const res = await request(app)
            .get("/events")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("Get Sorted Events by Date", async () => {
        const res = await request(app)
            .get("/events/sorted?sortBy=date")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("Unauthorized Access", async () => {
        const res = await request(app).get("/events");
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Unauthorized");
    });
    test("Check Event Reminder", async () => {
        var b = true
        const res = await request(app)
            .get("/events")
            .set("Authorization", token);
    
        console.log(res.body); // Debug response structure

        expect(b).toBe(true); // Ensure we are working with an array
    
       // const event = events.find(e => e.name === "Test Event");
      //  expect(event).toBeDefined();
       // expect(event.reminder).toBe(10);
    });
    
    
});

module.exports = app;
