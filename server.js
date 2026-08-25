const express = require("express");
const session = require("express-session");

const app = express();

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24
    }
}));

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
        req.session.isAdmin = true;

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

// Check admin session
app.get("/api/admin/me", (req, res) => {
    res.json({
        authenticated: req.session.isAdmin === true
    });
});

// Admin logout
app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({
            success: true,
            message: "Logged out"
        });
    });
});

// Root
app.get("/", (req, res) => {
    res.json({
        name: "GeoQuest Backend",
        status: "online"
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`GeoQuest Backend running on port ${PORT}`);
});
