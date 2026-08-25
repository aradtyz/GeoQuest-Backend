const express = require("express");
const session = require("express-session");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "https://aradtyz.github.io",
    credentials: true
}));

app.set("trust proxy", 1);

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
    maintenance: false 
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

// Admin authentication middleware
function requireAdmin(req, res, next) {
    if (req.session.isAdmin !== true) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    next();
}

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

// Change maintenance mode
app.post("/api/admin/maintenance", requireAdmin, (req, res) => {
    const { maintenance } = req.body;

    if (typeof maintenance !== "boolean") {
        return res.status(400).json({
            success: false,
            message: "maintenance must be true or false"
        });
    }

    config.maintenance = maintenance;

    res.json({
        success: true,
        maintenance: config.maintenance
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
