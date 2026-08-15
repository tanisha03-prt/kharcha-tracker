const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// ROUTES
// ==========================================

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/transactions",
  require("./routes/transactionRoutes")
);

app.use(
  "/api/budget",
  require("./routes/budgetRoutes")
);


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    status:
      "Kharcha Tracker backend chal raha hai",
  });
});


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error(
      "MongoDB error:",
      error
    );
  });


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});