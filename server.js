const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// GeoQuest configuration
const config = {
    maintenance: true
};

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

// Public game configuration
app.get("/api/config", (req, res) => {
    res.json(config);
});

// Admin login
app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        return res.json({
            success: true,
            message: "Login successful"
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid username or password"
    });
});
