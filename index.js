import express from "express";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Add a log entry
app.post("/log", (req, res) => {
  const { type, value, timestamp } = req.body;
  let logs = [];
  
  try {
    logs = JSON.parse(fs.readFileSync("data.json", "utf8"));
  } catch (err) {
    // File may not exist yet, that's fine
  }

  logs.push({ type, value, timestamp });
  fs.writeFileSync("data.json", JSON.stringify(logs, null, 2));

  res.json({ status: "success", logsLength: logs.length });
});

// Get all logs
app.get("/logs", (req, res) => {
  let logs = [];
  try {
    logs = JSON.parse(fs.readFileSync("data.json", "utf8"));
  } catch (err) {
    // ignore
  }
  res.json({ logs });
});

app.listen(port, () => console.log(`CloudPadNotes running on port ${port}`));
