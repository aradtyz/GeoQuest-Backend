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

// Root
app.get("/", (req, res) => {
    res.json({
        name: "GeoQuest Backend",
        status: "online"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`GeoQuest Backend running on port ${PORT}`);
});
