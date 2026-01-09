import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

const DATA_FILE = path.join(process.cwd(), "data.json");

// Helper functions
function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE);
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Generate sample vitals
function generateSampleVitals(count = 1) {
  const newEntries = [];
  for (let i = 0; i < count; i++) {
    newEntries.push({
      timestamp: new Date().toISOString(),
      bloodPressure: {
        systolic: Math.floor(Math.random() * 40) + 110,
        diastolic: Math.floor(Math.random() * 30) + 65,
      },
      heartRate: Math.floor(Math.random() * 40) + 60,
      glucose: (Math.random() * 4 + 4).toFixed(1), // 4–8 mmol/L
    });
  }
  const currentData = readData();
  const combined = currentData.concat(newEntries);
  writeData(combined);
  return newEntries;
}

// Routes

// Get all data
app.get("/", (req, res) => {
  res.json(readData());
});

// Add a single entry manually
app.post("/add", (req, res) => {
  const entry = req.body;
  if (!entry.timestamp) entry.timestamp = new Date().toISOString();
  const data = readData();
  data.push(entry);
  writeData(data);
  res.json({ status: "success", entry });
});

// Generate sample vitals
app.post("/generate-sample/:count", (req, res) => {
  const count = parseInt(req.params.count) || 1;
  const newEntries = generateSampleVitals(count);
  res.json({ status: "success", generated: newEntries });
});

// Clear all data
app.post("/clear-data", (req, res) => {
  writeData([]);
  res.json({ status: "success", message: "All data cleared!" });
});

// Auto-run: generate one sample entry every 30s
let autoRunInterval;
app.post("/start-auto-run/:seconds?", (req, res) => {
  const seconds = parseInt(req.params.seconds) || 30;
  clearInterval(autoRunInterval);
  autoRunInterval = setInterval(() => {
    const entry = generateSampleVitals(1)[0];
    console.log("Auto-run generated:", entry);
  }, seconds * 1000);
  res.json({ status: "success", message: `Auto-run started every ${seconds} seconds` });
});

// Stop auto-run
app.post("/stop-auto-run", (req, res) => {
  clearInterval(autoRunInterval);
  res.json({ status: "success", message: "Auto-run stopped" });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
