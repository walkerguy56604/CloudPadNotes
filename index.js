import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // allow JSON in request body

// Path to your data.json
const dataFilePath = path.join(process.cwd(), "data.json");

// Initialize data.json if missing or empty
function initializeData() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, "[]");
    console.log("data.json created and initialized.");
  } else {
    try {
      const content = fs.readFileSync(dataFilePath, "utf-8");
      if (!content.trim()) {
        fs.writeFileSync(dataFilePath, "[]");
        console.log("data.json was empty and has been initialized.");
      }
    } catch (err) {
      console.error("Error reading data.json:", err);
      fs.writeFileSync(dataFilePath, "[]"); // reset if corrupted
      console.log("data.json reset due to read error.");
    }
  }
}

// Call initialization on startup
initializeData();

// Helper: safely read JSON file
function readData() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading data.json:", err);
    return [];
  }
}

// Helper: safely write JSON file
function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing data.json:", err);
  }
}

// GET all data
app.get("/", (req, res) => {
  const data = readData();
  res.json(data);
});

// POST new entry (automatically adds timestamp)
app.post("/add", (req, res) => {
  const data = readData();
  const newEntry = {
    ...req.body,
    timestamp: new Date().toISOString(), // automatically add timestamp
  };
  data.push(newEntry);
  writeData(data);
  res.json({ status: "success", added: newEntry });
});

app.listen(port, () => console.log(`CloudPad Notes running on port ${port}`));
